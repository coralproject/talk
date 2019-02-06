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

function configureRedisClient(redis: Redis) {
  // Attach to the error event.
  redis.on("error", (err: Error) => {
    logger.error({ err }, "an error occurred with redis");
  });

  // mhincrby will increment many hash values.
  redis.defineCommand("mhincrby", {
    numberOfKeys: 1,
    lua: `
      for i = 1, #ARGV, 2 do
        redis.call('HINCRBY', KEYS[1], ARGV[i], ARGV[i + 1])
      end
    `,
  });
}

/**
 * create will connect to the Redis instance identified in the configuration.
 *
 * @param config application configuration.
 */
export async function createRedisClient(
  config: Config
): Promise<AugmentedRedis> {
  try {
    const redis = new RedisClient(config.get("redis"), {
      lazyConnect: true,
    });

    // Configure the redis client for use with the custom commands.
    configureRedisClient(redis);

    // Connect the redis client.
    await redis.connect();

    return redis as AugmentedRedis;
  } catch (err) {
    throw new InternalError(err, "could not connect to redis");
  }
}
