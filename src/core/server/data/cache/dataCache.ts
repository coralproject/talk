import { MongoContext } from "coral-server/data/context";
import { AugmentedRedis } from "coral-server/services/redis";

import { CommentCache } from "./commentCache";
import { UserCache } from "./userCache";

export class DataCache {
  private mongo: MongoContext;
  private redis: AugmentedRedis;

  public readonly comments: CommentCache;
  public readonly users: UserCache;

  constructor(mongo: MongoContext, redis: AugmentedRedis) {
    this.mongo = mongo;
    this.redis = redis;

    this.comments = new CommentCache(this.mongo, this.redis);
    this.users = new UserCache(this.mongo);
  }
}
