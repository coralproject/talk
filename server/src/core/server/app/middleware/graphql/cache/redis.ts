import { KeyValueCache, KeyValueCacheSetOptions } from "apollo-server-caching";
import DataLoader from "dataloader";
import { Redis } from "ioredis";

// This is based on the implementation at: https://npmjs.com/package/apollo-server-cache-redis

export class RedisCache implements KeyValueCache<string> {
  public readonly defaultSetOptions: KeyValueCacheSetOptions = {
    ttl: 300,
  };

  private readonly loader: DataLoader<string, string | null> = new DataLoader(
    (keys) => this.client.mget(...keys),
    {
      // We don't want to cache these here because we're using the DataLoader
      // just for batching.
      cache: false,
    }
  );

  constructor(private readonly client: Redis) {}

  public async set(
    key: string,
    value: string,
    options?: KeyValueCacheSetOptions
  ): Promise<void> {
    const { ttl } = Object.assign({}, this.defaultSetOptions, options);
    if (typeof ttl === "number") {
      await this.client.set(key, value, "EX", ttl);
    } else {
      await this.client.set(key, value);
    }
  }

  public async get(key: string): Promise<string | undefined> {
    const reply = await this.loader.load(key);
    if (reply !== null) {
      return reply;
    }
    return;
  }

  public async delete(key: string): Promise<boolean> {
    const result = await this.client.del(key);
    return result === 1;
  }
}
