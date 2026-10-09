import Joi from "joi";

import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { extractTokenFromRequest } from "coral-server/services/jwt";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

/**
 * The auth handoff passes a signed in user's access token from the sign in
 * popup to the page that opened it, through the server. It's used when the
 * popup has lost `window.opener`, which happens when a sign in page it visited
 * sends `Cross-Origin-Opener-Policy: same-origin` (bsky.social does).
 *
 * The page creates a random ID and gives it to the popup. The popup stores its
 * token under the ID, and the page polls for it. The ID is only known to the
 * two of them, a token can be stored under it once, and it can be read once.
 */

// How long a handed off token waits to be picked up, in seconds.
const HANDOFF_TTL = 2 * 60;

// IDs are 32 random bytes, base64url encoded.
const HANDOFF_ID = /^[A-Za-z0-9_-]{43}$/;

const handoffKey = (tenantID: string, id: string) =>
  `authHandoff:${tenantID}:${id}`;

type Options = Pick<AppOptions, "redis" | "config">;

interface HandoffBody {
  id: string;
}

const HandoffBodySchema = Joi.object().keys({
  id: Joi.string().pattern(HANDOFF_ID).required(),
});

/**
 * storeAuthHandoffHandler stores the request's own access token under the ID.
 * It must be mounted behind authentication, so only a valid token is stored.
 */
export const storeAuthHandoffHandler =
  ({ redis }: Options): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    try {
      const { tenant } = req.coral;
      const { id }: HandoffBody = validate(HandoffBodySchema, req.body);

      const token = extractTokenFromRequest(req, true);
      if (!token) {
        throw new Error("missing access token");
      }

      // NX: an ID can only be used once, so it can't be overwritten.
      const stored = await redis.set(
        handoffKey(tenant.id, id),
        token,
        "EX",
        HANDOFF_TTL,
        "NX"
      );
      if (stored !== "OK") {
        throw new Error("handoff id already used");
      }

      res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };

/**
 * retrieveAuthHandoffHandler returns the token stored under the ID once, then
 * deletes it. It answers 204 while there is nothing to pick up yet.
 */
export const retrieveAuthHandoffHandler = ({
  redis,
  config,
}: Options): RequestHandler<TenantCoralRequest> => {
  // The page polls every couple of seconds for up to five minutes (about 150
  // requests), so this allows a few sign in attempts per IP.
  const ipLimiter = new RequestLimiter({
    redis,
    ttl: "10m",
    max: 400,
    prefix: "authHandoff",
    config,
  });

  return async (req, res, next) => {
    try {
      await ipLimiter.test(req, req.ip);

      const { tenant } = req.coral;
      const { id } = req.params;
      if (typeof id !== "string" || !HANDOFF_ID.test(id)) {
        res.sendStatus(400);
        return;
      }

      // Read and delete together, so a token can only be picked up once.
      const key = handoffKey(tenant.id, id);
      const results = await redis.multi().get(key).del(key).exec();
      const token = results?.[0]?.[1];

      res.header("Cache-Control", "private, no-cache, no-store");
      if (typeof token !== "string") {
        res.sendStatus(204);
        return;
      }

      res.json({ token });
    } catch (err) {
      return next(err);
    }
  };
};
