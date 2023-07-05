import RedisClient, { Pipeline, Redis } from "ioredis";

import { Config } from "coral-server/config";
import { WrappedInternalError } from "coral-server/errors";
import logger from "coral-server/logger";

interface AugmentedRedisCommands {
  mhincrby(key: string, ...args: any[]): Promise<void>;
}

export interface AugmentedPipeline extends Pipeline {
  mhincrby(key: string, ...args: any[]): Pipeline;
}

export type AugmentedRedis = Omit<Redis, "pipeline"> &
  AugmentedRedisCommands & {
    pipeline(commands?: string[][]): AugmentedPipeline;
  };

function augmentRedisClient(redis: Redis): AugmentedRedis {
  // mhincrby will increment many hash values.
  redis.defineCommand("mhincrby", {
    numberOfKeys: 1,
    lua: `
      for i = 1, #ARGV, 2 do
        redis.call('HINCRBY', KEYS[1], ARGV[i], ARGV[i + 1])
      end
    `,
  });

  return redis as AugmentedRedis;
}

function attachHandlers(redis: Redis) {
  // There appears to already be 10 error listeners on Redis. They must be added
  // by the framework. Increase the maximum number of listeners to avoid the
  // memory leak warning.
  redis.setMaxListeners(11);
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

export function createRedisClient(config: Config, lazyConnect = false): Redis {
  try {
    const options = config.get("redis_options") || {};

    const redis = new RedisClient(config.get("redis"), {
      // Merge in the custom options.
      ...options,
      // Enforce the lazyConnect option as provided by the function invocation.
      lazyConnect,
    });

    // Configure the redis client with the handlers for logging
    attachHandlers(redis);

    return redis;
  } catch (err) {
    throw new WrappedInternalError(err, "could not connect to redis");
  }
}

export function createRedisClientFactory(config: Config) {
  let redis: Redis | undefined;

  return (): Redis => {
    if (!redis) {
      redis = createRedisClient(config);
    }

    return redis;
  };
}

/**
 * createAugmentedRedisClient will connect to the Redis instance identified in
 * the configuration.
 *
 * @param config application configuration.
 */
export async function createAugmentedRedisClient(
  config: Config
): Promise<AugmentedRedis> {
  try {
    const redis = augmentRedisClient(createRedisClient(config, true));

    // Connect the redis client.
    await redis.connect();

    return redis;
  } catch (err) {
    throw new WrappedInternalError(err, "could not connect to redis");
  }
}
