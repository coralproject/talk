import { MongoContext } from "coral-server/data/context";
import { Logger } from "coral-server/logger";
import { AugmentedRedis } from "coral-server/services/redis";

import { CommentCache } from "./commentCache";
import { UserCache } from "./userCache";

export const DATA_EXPIRY_SECONDS = 24 * 60 * 60;

export class DataCache {
  private mongo: MongoContext;
  private redis: AugmentedRedis;
  private logger: Logger;

  public readonly comments: CommentCache;
  public readonly users: UserCache;

  private traceID = "c2603e5c-1de3-46f1-80fb-9dcc3b4e2c22";

  constructor(mongo: MongoContext, redis: AugmentedRedis, logger: Logger) {
    this.mongo = mongo;
    this.redis = redis;
    this.logger = logger.child({ traceID: this.traceID });

    this.comments = new CommentCache(
      this.mongo,
      this.redis,
      this.logger,
      DATA_EXPIRY_SECONDS
    );
    this.users = new UserCache(
      this.mongo,
      this.redis,
      this.logger,
      DATA_EXPIRY_SECONDS
    );
  }
}
