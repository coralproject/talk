import { MongoContext } from "coral-server/data/context";

import { CommentCache } from "./commentCache";
import { UserCache } from "./userCache";

export class DataCache {
  private mongo: MongoContext;

  public readonly comments: CommentCache;
  public readonly users: UserCache;

  constructor(mongo: MongoContext) {
    this.mongo = mongo;

    this.comments = new CommentCache(this.mongo);
    this.users = new UserCache(this.mongo);
  }
}
