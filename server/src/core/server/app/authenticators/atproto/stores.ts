import type {
  NodeSavedSession,
  NodeSavedSessionStore,
  NodeSavedState,
  NodeSavedStateStore,
} from "@atproto/oauth-client-node";

import { AugmentedRedis } from "coral-server/services/redis";

// An authorization has to be completed within this many seconds.
const STATE_TTL = 10 * 60;

// Coral only needs the session to identify the user at the callback, it does
// not make further requests to the user's PDS, so it doesn't need to live long.
const SESSION_TTL = 60 * 60;

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

export function createSessionStore(
  redis: AugmentedRedis,
  tenantID: string
): NodeSavedSessionStore {
  return new RedisStore<NodeSavedSession>(
    redis,
    `atproto:${tenantID}:session`,
    SESSION_TTL
  );
}
