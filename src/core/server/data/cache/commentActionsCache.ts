import { Logger } from "coral-server/logger";
import { CommentAction } from "coral-server/models/action/comment";
import { AugmentedRedis } from "coral-server/services/redis";

import { MongoContext } from "../context";

export class CommentActionsCache {
  private expirySeconds: number;

  private mongo: MongoContext;
  private redis: AugmentedRedis;
  private logger: Logger;

  private commentActionsByKey: Map<string, Readonly<CommentAction>>;

  constructor(
    mongo: MongoContext,
    redis: AugmentedRedis,
    logger: Logger,
    expirySeconds: number
  ) {
    this.mongo = mongo;
    this.redis = redis;
    this.logger = logger.child({ dataCache: "CommentActionsCache" });

    this.expirySeconds = expirySeconds;

    this.commentActionsByKey = new Map<string, Readonly<CommentAction>>();
  }

  private computeDataKey(tenantID: string, id: string) {
    const key = `${tenantID}:${id}:commentActionData`;
    return key;
  }

  public async populateByStoryID(
    tenantID: string,
    storyID: string,
    isArchived: boolean = false
  ) {
    const collection = isArchived
      ? this.mongo.archivedCommentActions()
      : this.mongo.commentActions();
    const cursor = await collection.find({ tenantID, storyID });

    const cmd = this.redis.multi();

    const commentActions: Readonly<CommentAction>[] = [];
    while (await cursor.hasNext()) {
      const commentAction = await cursor.next();
      if (!commentAction) {
        continue;
      }

      const dataKey = this.computeDataKey(tenantID, commentAction.id);
      cmd.set(dataKey, this.serializeObject(commentAction));
      cmd.expire(dataKey, this.expirySeconds);

      this.commentActionsByKey.set(dataKey, commentAction);
      commentActions.push(commentAction);
    }

    await cmd.exec();

    return commentActions;
  }

  public async populateByIDs(
    tenantID: string,
    ids: string[],
    isArchived: boolean = false
  ) {
    const collection = isArchived
      ? this.mongo.archivedCommentActions()
      : this.mongo.commentActions();
    const cursor = await collection.find({ tenantID, id: { $in: ids } });

    const cmd = this.redis.multi();

    const commentActions: Readonly<CommentAction>[] = [];
    while (await cursor.hasNext()) {
      const commentAction = await cursor.next();
      if (!commentAction) {
        continue;
      }

      const dataKey = this.computeDataKey(tenantID, commentAction.id);
      cmd.set(dataKey, this.serializeObject(commentAction));
      cmd.expire(dataKey, this.expirySeconds);

      this.commentActionsByKey.set(dataKey, commentAction);
      commentActions.push(commentAction);
    }

    await cmd.exec();

    return commentActions;
  }

  public async loadCommentActions(
    tenantID: string,
    ids: string[]
  ) {
    const keys = ids.map((id) => this.computeDataKey(tenantID, id));

    const start = Date.now();
    const records = keys && keys.length > 0 ? await this.redis.mget(keys) : [];
    const end = Date.now();
    this.logger.info({ elapsedMs: end - start }, "loadCommentActions - mget");

    if (records.length !== ids.length) {
      await this.populateByIDs(tenantID, ids);
    }

    for (const record of records) {
      if (!record) {
        continue;
      }

      const commentAction = this.deserializeObject(record);
      this.commentActionsByKey.set(
        this.computeDataKey(tenantID, commentAction.id),
        commentAction
      );
    }
  }

  public async findUser(tenantID: string, id: string) {
    const key = this.computeDataKey(tenantID, id);
    let commentAction = this.commentActionsByKey.get(key);
    if (!commentAction) {
      const start = Date.now();
      let record = await this.redis.get(key);
      const end = Date.now();
      this.logger.info({ elapsedMs: end - start }, "findCommentAction - get");

      if (!record) {
        await this.populateByIDs(tenantID, [id]);
        record = await this.redis.get(key);
      }

      // check that we have a record after trying to ensure
      // it exists via populate comment actions
      if (!record) {
        throw new Error("comment action not found");
      }

      commentAction = this.deserializeObject(record);
      this.commentActionsByKey.set(key, commentAction);
    }

    if (!commentAction) {
      throw new Error("comment action not found");
    }

    return commentAction;
  }

  private serializeObject(comment: Readonly<CommentAction>) {
    const json = JSON.stringify(comment);
    return json;
  }

  private deserializeObject(data: string): Readonly<CommentAction> {
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
    };
  }
}
