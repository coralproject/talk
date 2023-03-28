import { MongoContext } from "coral-server/data/context";
import { Logger } from "coral-server/logger";
import { LoadCacheQueue } from "coral-server/queue/tasks/loadCache";
import { AugmentedRedis } from "coral-server/services/redis";
import { CommentActionsCache } from "./commentActionsCache";

import { CommentCache } from "./commentCache";
import { UserCache } from "./userCache";

export const DEFAULT_DATA_EXPIRY_SECONDS = 24 * 60 * 60;

export class DataCache {
  private mongo: MongoContext;
  private redis: AugmentedRedis;
  private queue: LoadCacheQueue | null;
  private logger: Logger;

  private expirySeconds: number;

  public readonly comments: CommentCache;
  public readonly users: UserCache;
  public readonly commentActions: CommentActionsCache;

  private traceID = "c2603e5c-1de3-46f1-80fb-9dcc3b4e2c22";

  constructor(
    mongo: MongoContext,
    redis: AugmentedRedis,
    queue: LoadCacheQueue | null,
    logger: Logger,
    disableCaching?: boolean,
    expirySeconds: number = DEFAULT_DATA_EXPIRY_SECONDS
  ) {
    this.mongo = mongo;
    this.redis = redis;
    this.queue = queue;
    this.logger = logger.child({ traceID: this.traceID });
    this.expirySeconds = expirySeconds;

    this.comments = new CommentCache(
      this.mongo,
      this.redis,
      this.queue,
      this.logger,
      Boolean(disableCaching),
      this.expirySeconds
    );
    this.commentActions = new CommentActionsCache(
      this.mongo,
      this.redis,
      this.logger,
      this.expirySeconds
    );
    this.users = new UserCache(
      this.mongo,
      this.redis,
      this.logger,
      this.expirySeconds
    );
  }
}
