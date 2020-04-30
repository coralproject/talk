import { Redis } from "ioredis";
import { isNumber } from "lodash";

const THREE_HOUR_EXPIRY = 3 * 3600;

export class CachedDbCount {
  private redis: Redis;
  private keys: string[];
  private expiry: number;

  constructor(redis: Redis, keyPrefixes: string[], expiry = THREE_HOUR_EXPIRY) {
    this.redis = redis;
    this.keys = keyPrefixes.map((prefix) => `${prefix}:allTimeCount`);
    this.expiry = expiry;
  }

  public increment() {
    const multi = this.redis.multi();
    for (const key of this.keys) {
      multi.incr(key);
    }
    return multi.exec();
  }

  public async retrieveTotal(cb: () => Promise<number[]>) {
    const cachedCounts = await this.redis.mget(...this.keys);
    if (
      cachedCounts &&
      cachedCounts.length === this.keys.length &&
      cachedCounts.filter(isNumber).length === this.keys.length
    ) {
      return cachedCounts.map((count) =>
        isNumber(count) ? parseInt(count, 10) : 0
      );
    }
    const counts = await cb();
    const multi = this.redis.multi();
    for (let i = 0; i < this.keys.length; i++) {
      multi.set(this.keys[i], counts[i], "EX", this.expiry);
    }
    await multi.exec();
    return counts;
  }
}
