import { RedisPubSub } from "graphql-redis-subscriptions";
import { Redis } from "ioredis";

export function createPubSubClient(
  publisher: Redis,
  subscriber: Redis
): RedisPubSub {
  return new RedisPubSub({
    publisher,
    subscriber,
  });
}
