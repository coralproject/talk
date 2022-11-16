import { MongoContext } from "coral-server/data/context";

import { CommentCache } from "./comments";

export class DataCache {
  private mongo: MongoContext;

  public readonly comments: CommentCache;

  constructor(mongo: MongoContext) {
    this.mongo = mongo;

    this.comments = new CommentCache(this.mongo);
  }
}
