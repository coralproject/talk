import { Redis } from "ioredis";
import Joi from "joi";

import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { Limiter, RequestLimiter } from "coral-server/app/request/limiter";
import logger from "coral-server/logger";
import { extractTokenFromRequest } from "coral-server/services/jwt";
import { AugmentedRedis, createRedisClient } from "coral-server/services/redis";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

/**
 * The auth handoff passes a signed in user's access token from the sign in
 * popup to the page that opened it, through the server. It's used when the
 * popup has lost `window.opener`, which happens when a sign in page it visited
 * sends `Cross-Origin-Opener-Policy: same-origin` (bsky.social does).
 *
 * The page creates a random ID and gives it to the popup. The popup sends it
 * with the request that starts sign in, which marks it pending here. When the
 * popup is about to leave for the sign in page, it tells the page, which then
 * makes a single request that waits here until the popup stores its token
 * under the ID (or a time limit passes). Only a pending ID can be waited on,
 * so a wait can't be opened without starting a sign in. The ID is only known
 * to the two of them, a token can be stored under it once, and it can be
 * picked up once.
 */

// How long a started sign in, and a stored token, wait to be picked up, in
// seconds. Abandoned sign ins expire out of Redis after this.
const HANDOFF_TTL = 2 * 60;

// How long a waiting request is held open before answering empty.
const WAIT_TIMEOUT = 2 * 60 * 1000;

// IDs are 32 random bytes, base64url encoded.
const HANDOFF_ID = /^[A-Za-z0-9_-]{43}$/;

const handoffKey = (tenantID: string, id: string) =>
  `authHandoff:${tenantID}:${id}`;

const pendingKey = (tenantID: string, id: string) =>
  `${handoffKey(tenantID, id)}:pending`;

// Only a "ready" signal is published, never the token itself.
const handoffChannel = (tenantID: string, id: string) =>
  `${handoffKey(tenantID, id)}:ready`;

type Options = Pick<AppOptions, "redis" | "config">;

interface HandoffBody {
  id: string;
}

const HandoffBodySchema = Joi.object().keys({
  id: Joi.string().pattern(HANDOFF_ID).required(),
});

/**
 * markAuthHandoffPending records that a sign in was started for the handoff ID,
 * so the page may wait for it. Invalid IDs are ignored.
 */
export async function markAuthHandoffPending(
  redis: AugmentedRedis,
  tenantID: string,
  id: unknown
) {
  if (typeof id !== "string" || !HANDOFF_ID.test(id)) {
    return;
  }

  await redis.set(pendingKey(tenantID, id), "1", "EX", HANDOFF_TTL, "NX");
}

/**
 * completeAuthHandoff stores the access token under a pending handoff ID and
 * wakes the request waiting for it. It does nothing, and returns false, when
 * no sign in is pending for the ID or a token was already stored for it.
 */
export async function completeAuthHandoff(
  redis: AugmentedRedis,
  tenantID: string,
  id: unknown,
  token: string
) {
  if (typeof id !== "string" || !HANDOFF_ID.test(id)) {
    return false;
  }
  if (!(await redis.exists(pendingKey(tenantID, id)))) {
    return false;
  }

  // NX: an ID can only be used once, so it can't be overwritten.
  const stored = await redis.set(
    handoffKey(tenantID, id),
    token,
    "EX",
    HANDOFF_TTL,
    "NX"
  );
  if (stored !== "OK") {
    return false;
  }

  await redis.publish(handoffChannel(tenantID, id), "ready");
  return true;
}

/**
 * takeToken returns the token stored under the key and deletes it, so it can
 * only be picked up once.
 */
async function takeToken(redis: AugmentedRedis, key: string) {
  const results = await redis.multi().get(key).del(key).exec();
  const token = results?.[0]?.[1];
  if (typeof token !== "string") {
    return null;
  }

  // The sign in is done, so it's no longer pending.
  await redis.del(`${key}:pending`);

  return token;
}

/**
 * storeAuthHandoffHandler stores the request's own access token under the ID
 * and wakes the request waiting for it. The popup calls it once the user has
 * completed their account. It must be mounted behind
 * authentication, so only a valid token is stored.
 */
export const storeAuthHandoffHandler = ({
  redis,
  config,
}: Options): RequestHandler<TenantCoralRequest> => {
  const ipLimiter = new RequestLimiter({
    redis,
    ttl: "10m",
    max: 10,
    prefix: "ip",
    config,
  });

  return async (req, res, next) => {
    try {
      await ipLimiter.test(req, req.ip);

      const { tenant } = req.coral;
      const { id }: HandoffBody = validate(HandoffBodySchema, req.body);

      const token = extractTokenFromRequest(req, true);
      if (!token) {
        throw new Error("missing access token");
      }

      // The sign in callback may have completed the handoff already, and the
      // page may have stopped waiting, so this doesn't fail the popup.
      await completeAuthHandoff(redis, tenant.id, id, token);

      res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};

/**
 * HandoffWaiters shares one Redis subscriber connection between all the
 * requests waiting in this process, with one channel per handoff ID, so a
 * signal only reaches the process holding that ID's request.
 */
class HandoffWaiters {
  private subscriber: Redis | null = null;
  private readonly waiters = new Map<string, () => void>();

  constructor(private readonly options: Options) {}

  private getSubscriber() {
    if (!this.subscriber) {
      // Subscribing needs its own connection, Redis can't run other commands
      // on a connection while it's subscribed.
      this.subscriber = createRedisClient(this.options.config);
      this.subscriber.on("message", (channel: string) => {
        this.waiters.get(channel)?.();
      });
    }

    return this.subscriber;
  }

  /**
   * wait resolves when the channel is signalled, or rejects if subscribing
   * fails. The returned stop function must be called when done waiting.
   */
  public async wait(channel: string, onReady: () => void) {
    const subscriber = this.getSubscriber();
    this.waiters.set(channel, onReady);
    await subscriber.subscribe(channel);

    return () => {
      this.waiters.delete(channel);
      void subscriber.unsubscribe(channel).catch((err) => {
        logger.warn({ err }, "could not unsubscribe auth handoff channel");
      });
    };
  }
}

/**
 * retrieveAuthHandoffHandler holds the request open until a token is stored
 * under the ID, then returns it once. It answers 204 if none arrives in time,
 * and the page doesn't ask again.
 */
export const retrieveAuthHandoffHandler = (
  options: Options
): RequestHandler<TenantCoralRequest> => {
  const { redis, config } = options;
  const waiters = new HandoffWaiters(options);

  // A page makes one request per sign in attempt. The URL holds the ID, so
  // the limit is counted on a fixed resource instead.
  const ipLimiter = new Limiter({
    redis,
    ttl: "10m",
    max: 10,
    prefix: "ip",
    resource: "/api/auth/handoff/:id",
    operation: "GET",
    config,
  });

  return async (req, res, next) => {
    let stop: (() => void) | null = null;
    let timer: ReturnType<typeof setTimeout> | null = null;
    let done = false;

    const finish = (token: string | null) => {
      if (done) {
        return;
      }
      done = true;
      if (timer) {
        clearTimeout(timer);
      }
      if (stop) {
        stop();
      }
      if (res.headersSent || res.writableEnded) {
        return;
      }

      res.header("Cache-Control", "private, no-cache, no-store");
      if (token) {
        res.json({ token });
      } else {
        res.sendStatus(204);
      }
    };

    try {
      await ipLimiter.test(req.ip);

      const { tenant } = req.coral;
      const { id } = req.params;
      if (typeof id !== "string" || !HANDOFF_ID.test(id)) {
        res.sendStatus(400);
        return;
      }

      const key = handoffKey(tenant.id, id);

      // The token may already be there if sign in finished first.
      const existing = await takeToken(redis, key);
      if (existing) {
        finish(existing);
        return;
      }

      // Only wait for a sign in that was actually started.
      if (!(await redis.exists(pendingKey(tenant.id, id)))) {
        res.sendStatus(404);
        return;
      }

      // Stop waiting if the page goes away.
      req.on("close", () => finish(null));
      timer = setTimeout(() => finish(null), WAIT_TIMEOUT);

      stop = await waiters.wait(handoffChannel(tenant.id, id), () => {
        void takeToken(redis, key).then(finish, (err) => {
          logger.error({ err }, "could not pick up auth handoff token");
          finish(null);
        });
      });
      if (done) {
        // The page went away while subscribing.
        stop();
        return;
      }

      // Check again, in case the token was stored while subscribing.
      const stored = await takeToken(redis, key);
      if (stored) {
        finish(stored);
      }
    } catch (err) {
      if (timer) {
        clearTimeout(timer);
      }
      if (stop) {
        stop();
      }
      done = true;
      return next(err);
    }
  };
};
