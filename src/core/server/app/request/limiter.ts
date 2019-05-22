// tslint:disable:max-classes-per-file

import { Redis } from "ioredis";
import ms from "ms";

import { Omit } from "coral-common/types";
import { RateLimitExceeded } from "coral-server/errors";
import { Request } from "coral-server/types/express";

export interface LimiterOptions {
  client: Redis;
  ttl: string;
  max: number;
  resource: string;
  operation: string;
  prefix: string;
}

export class Limiter {
  private client: Redis;
  private ttl: number;
  private max: number;
  private prefix: string;
  private resource: string;
  private operation: string;

  constructor(options: LimiterOptions) {
    this.client = options.client;
    this.ttl = Math.floor(ms(options.ttl) / 1000);
    this.max = options.max;
    this.prefix = options.prefix;
    this.resource = options.resource;
    this.operation = options.operation;
  }

  private key(key: string, resource?: string, operation?: string): string {
    return `limiter[${this.prefix}][${resource || this.resource}][${operation ||
      this.operation}][${key}]`;
  }

  public async test(
    value: string,
    resource?: string,
    operation?: string
  ): Promise<number> {
    const key = this.key(value, resource, operation);

    const [[, tries], [, expiry]] = await this.client
      .multi()
      .incr(key)
      .expire(key, this.ttl)
      .exec();

    // if this is new or has no expiry
    if (tries === 1 || expiry === -1) {
      // then expire it after the timeout
      this.client.expire(key, this.ttl);
    }

    if (tries > this.max) {
      throw new RateLimitExceeded(key, this.max, tries);
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
