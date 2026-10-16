import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
  RuntimeLock,
} from "@atproto/oauth-client-node";
import crypto from "crypto";

import { AugmentedRedis } from "coral-server/services/redis";

// An authorization has to be completed within this many seconds.
const STATE_TTL = 10 * 60;

// Coral is a public client (no client authentication), and atproto limits a
// public client's whole session, and each refresh token, to two weeks.
export const MAX_SESSION_TTL = 14 * 24 * 60 * 60;

class RedisStore<T> {
  constructor(
    private readonly redis: AugmentedRedis,
    private readonly prefix: string,
    private readonly ttl: number
  ) {}

  private key(key: string) {
    return `${this.prefix}:${key}`;
  }

  public async get(key: string): Promise<T | undefined> {
    const value = await this.redis.get(this.key(key));
    if (!value) {
      return undefined;
    }

    return JSON.parse(value) as T;
  }

  public async set(key: string, value: T) {
    await this.redis.set(this.key(key), JSON.stringify(value), "EX", this.ttl);
  }

  public async del(key: string) {
    await this.redis.del(this.key(key));
  }
}

export function createStateStore(
  redis: AugmentedRedis,
  tenantID: string
): NodeSavedStateStore {
  return new RedisStore<NodeSavedState>(
    redis,
    `atproto:${tenantID}:state`,
    STATE_TTL
  );
}

/**
 * createSessionStore stores users' sessions with their PDS, so they can be
 * refreshed while the user is signed in to Coral, and revoked when they sign
 * out. ttl is in seconds, and is stored again on every refresh.
 */
export function createSessionStore(
  redis: AugmentedRedis,
  tenantID: string,
  ttl: number
): NodeSavedSessionStore {
  return new RedisStore<NodeSavedSession>(
    redis,
    `atproto:${tenantID}:session`,
    ttl
  );
}

// How long a lock is held at most, in case its holder dies before releasing
// it. A token refresh is a single request, so it finishes well within this.
const LOCK_TTL_MS = 30 * 1000;

// How long to wait for a lock held elsewhere, and how often to check it.
const LOCK_WAIT_MS = 30 * 1000;
const LOCK_RETRY_MS = 100;

// Deletes the lock only if it still holds our value, so a lock that expired
// and was taken by someone else isn't released.
const RELEASE_LOCK = `
if redis.call("get", KEYS[1]) == ARGV[1] then
  return redis.call("del", KEYS[1])
end
return 0
`;

/**
 * createRequestLock returns a lock shared by every Coral instance through
 * Redis. The library holds it while it refreshes a session's tokens: refresh
 * tokens are single-use, and two instances refreshing the same session at once
 * would send the same one twice, which can get the session revoked.
 */
export function createRequestLock(
  redis: AugmentedRedis,
  tenantID: string
): RuntimeLock {
  return async (name, fn) => {
    const key = `atproto:${tenantID}:lock:${name}`;
    const value = crypto.randomBytes(16).toString("hex");

    const deadline = Date.now() + LOCK_WAIT_MS;
    for (;;) {
      const acquired = await redis.set(key, value, "PX", LOCK_TTL_MS, "NX");
      if (acquired === "OK") {
        break;
      }
      if (Date.now() >= deadline) {
        throw new Error(`timed out waiting for atproto lock ${name}`);
      }
      await new Promise((resolve) => setTimeout(resolve, LOCK_RETRY_MS));
    }

    try {
      return await fn();
    } finally {
      await redis.eval(RELEASE_LOCK, 1, key, value);
    }
  };
}
