import RedisClient, { Redis } from "ioredis";
import { Config } from "talk-server/config";

/**
 * create will connect to the Redis instance identified in the configuration.
 *
 * @param config application configuration.
 */
export async function createRedisClient(config: Config): Promise<Redis> {
  return new RedisClient(config.get("redis"), {});
}
