/* eslint-disable max-classes-per-file */

import { Redis } from "ioredis";
import { DateTime } from "luxon";
import ms from "ms";

import { Config } from "coral-server/config";
import { RateLimitExceeded } from "coral-server/errors";
import { Request } from "coral-server/types/express";

export interface LimiterOptions {
  redis: Redis;
  ttl: string;
  max: number;
  resource: string;
  operation: string;
  prefix: string;
  config: Config;
}

export class Limiter {
  private redis: Redis;
  private ttl: number;
  private max: number;
  private prefix: string;
  private resource: string;
  private operation: string;
  private disabled: boolean;

  constructor(options: LimiterOptions) {
    this.redis = options.redis;
    this.ttl = Math.floor(ms(options.ttl) / 1000);
    this.max = options.max;
    this.prefix = options.prefix;
    this.resource = options.resource;
    this.operation = options.operation;
    this.disabled = options.config.get("disable_rate_limiters");
  }

  private key(key: string, resource?: string, operation?: string): string {
    return `limiter[${this.prefix}][${resource || this.resource}][${
      operation || this.operation
    }][${key}]`;
  }

  public async test(
    value: string,
    resource?: string,
    operation?: string
  ): Promise<number> {
    if (this.disabled) {
      return 0;
    }

    const key = this.key(value, resource, operation);

    const [[, tries], [, expiry]] = await this.redis
      .multi()
      .incr(key)
      .expire(key, this.ttl)
      .exec();

    // if this is new or has no expiry
    if (tries === 1 || expiry === -1) {
      // then expire it after the timeout
      void this.redis.expire(key, this.ttl);
    }

    if (tries > this.max) {
      const resetsAt = DateTime.fromJSDate(new Date())
        .plus({ seconds: this.ttl })
        .toJSDate();
      throw new RateLimitExceeded(key, this.max, resetsAt, tries);
    }

    return tries;
  }
}

export type RequestLimiterOptions = Omit<
  LimiterOptions,
  "operation" | "resource"
>;

export class RequestLimiter {
  private limiter: Limiter;

  constructor(options: RequestLimiterOptions) {
    this.limiter = new Limiter({
      ...options,
      operation: "",
      resource: "",
    });
  }

  public async test(req: Request, value: string) {
    return this.limiter.test(value, req.originalUrl, req.method);
  }
}
