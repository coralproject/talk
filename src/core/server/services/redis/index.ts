import RedisClient, { Pipeline, Redis } from "ioredis";

import { Omit } from "talk-common/types";
import { Config } from "talk-server/config";
import { InternalError } from "talk-server/errors";
import logger from "talk-server/logger";

export interface AugmentedRedisCommands {
  mhincrby(key: string, ...args: any[]): Promise<void>;
}

export type AugmentedPipeline = Pipeline & AugmentedRedisCommands;

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
  // Attach to the error event.
  redis.on("error", (err: Error) => {
    logger.error({ err }, "an error occurred with redis");
  });
}

export function createRedisClient(
  config: Config,
  lazyConnect: boolean = false
): Redis {
  try {
    const redis = new RedisClient(config.get("redis"), {
      lazyConnect,
    });

    // Configure the redis client with the handlers for logging
    attachHandlers(redis);

    return redis;
  } catch (err) {
    throw new InternalError(err, "could not connect to redis");
  }
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
    throw new InternalError(err, "could not connect to redis");
  }
}
