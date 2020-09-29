import RedisClient, { Pipeline as IOPipeline, Redis as IORedis } from "ioredis";
import { inject, injectable } from "tsyringe";

import { CONFIG, Config } from "coral-server/config";
import logger from "coral-server/logger";

export const REDIS = Symbol("REDIS");

interface Pipeline extends IOPipeline {
  mhincrby(key: string, ...args: any[]): IOPipeline;
}

export interface Redis extends IORedis {
  pipeline(commands?: string[][]): Pipeline;
  mhincrby(key: string, ...args: any[]): Promise<void>;
}

function augmentRedisClient(redis: IORedis): Redis {
  // mhincrby will increment many hash values.
  redis.defineCommand("mhincrby", {
    numberOfKeys: 1,
    lua: `
      for i = 1, #ARGV, 2 do
        redis.call('HINCRBY', KEYS[1], ARGV[i], ARGV[i + 1])
      end
    `,
  });

  return redis as Redis;
}

function attachHandlers(redis: IORedis) {
  // There appears to already be 10 error listeners on Redis. They must be added
  // by the framework. Increase the maximum number of listeners to avoid the
  // memory leak warning.
  redis.setMaxListeners(11);

  // Attach to the error event.
  redis.on("error", (err: Error) => {
    logger.error({ err }, "an error occurred with redis");
  });
  redis.on("close", () => {
    logger.warn("redis connection has been closed");
  });
  redis.on("reconnecting", () => {
    logger.warn("redis has reconnected");
  });
}

export function createRedis(config: Config): Redis {
  const options = config.get("redis_options") || {};

  const redis = new RedisClient(config.get("redis"), {
    // Merge in the custom options.
    ...options,
  });

  // configure the redis client with the handlers for logging
  attachHandlers(redis);

  return augmentRedisClient(redis);
}

@injectable()
export class RedisService {
  // TODO: remove this once we've better integrated this.
  public readonly redis: Redis;

  constructor(@inject(CONFIG) config: Config) {
    this.redis = createRedis(config);
  }
}
