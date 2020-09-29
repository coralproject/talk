import Queue from "bull";
import { Redis } from "ioredis";
import { container, singleton } from "tsyringe";

import { RedisService } from "coral-server/services/redis";

@singleton()
// QUESTION: There has to be a better way to do this...
export class TaskQueueOptions implements Queue.QueueOptions {
  constructor(
    private readonly client: RedisService,
    private readonly subscriber: RedisService
  ) {}

  public createClient = (type: "client" | "subscriber" | "bclient"): Redis => {
    switch (type) {
      case "subscriber":
        return this.subscriber.redis;
      case "client":
        return this.client.redis;
      case "bclient":
        return container.resolve(RedisService).redis;
    }
  };
}
