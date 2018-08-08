import RedisClient, { Redis } from "ioredis";
import { Config } from "talk-common/config";

/**
 * create will connect to the Redis instance identified in the configuration.
 *
 * @param config application configuration.
 */
export function createRedisClient(config: Config): Redis {
  return new RedisClient(config.get("redis"), {});
}
