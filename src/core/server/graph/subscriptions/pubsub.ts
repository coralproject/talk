import { singleton } from "tsyringe";

import { RedisService } from "coral-server/services/redis";
import { RedisPubSub } from "graphql-redis-subscriptions";

@singleton()
export class PubSubService extends RedisPubSub {
  constructor(publisher: RedisService, subscriber: RedisService) {
    super({
      publisher: publisher.redis,
      subscriber: subscriber.redis,
    });
  }
}
