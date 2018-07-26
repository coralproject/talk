import { RedisPubSub } from "graphql-redis-subscriptions";
import { Config } from "talk-server/config";
import { createRedisClient } from "talk-server/services/redis";

export function createPubSub(config: Config): RedisPubSub {
  // Create the Redis clients for the PubSub server.
  const publisher = createRedisClient(config);
  const subscriber = createRedisClient(config);

  // Create the new PubSub manager.
  return new RedisPubSub({
    publisher,
    subscriber,
  });
}
