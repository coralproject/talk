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

  public computeStoryMembersKey(tenantID: string, storyID: string) {
    return `${tenantID}:${storyID}:commentActions:members`;
  }

  public computeCommentMembersKey(tenantID: string, commentID: string) {
    return `${tenantID}:${commentID}:commentActions:members`;
  }

  public async populateByStoryID(
    tenantID: string,
    storyID: string,
    isArchived = false
  ) {
    const collection = isArchived
      ? this.mongo.archivedCommentActions()
      : this.mongo.commentActions();
    const cursor = collection.find({ tenantID, storyID });

    const cmd = this.redis.multi();

    const storyMembersKey = this.computeStoryMembersKey(tenantID, storyID);
    cmd.expire(storyMembersKey, this.expirySeconds);

    const commentActions: Readonly<CommentAction>[] = [];
    while (await cursor.hasNext()) {
      const commentAction = await cursor.next();
      if (!commentAction) {
        continue;
      }

      const dataKey = this.computeDataKey(tenantID, commentAction.id);
      cmd.set(dataKey, this.serializeObject(commentAction));
      cmd.expire(dataKey, this.expirySeconds);

      const commentMembersKey = this.computeCommentMembersKey(
        tenantID,
        commentAction.commentID
      );
      cmd.sadd(commentMembersKey, commentAction.id);
      cmd.expire(commentMembersKey, this.expirySeconds);

      cmd.sadd(storyMembersKey, commentAction.id);

      this.commentActionsByKey.set(dataKey, commentAction);
      commentActions.push(commentAction);
    }

    await cmd.exec();

    return commentActions;
  }

  public async populateByCommentIDs(
    tenantID: string,
    ids: string[],
    isArchived = false
  ) {
    const collection = isArchived
      ? this.mongo.archivedCommentActions()
      : this.mongo.commentActions();
    const cursor = collection.find({ tenantID, commentID: { $in: ids } });

    const cmd = this.redis.multi();

    const commentActions: Readonly<CommentAction>[] = [];
    const storyMemberKeys: string[] = [];
    while (await cursor.hasNext()) {
      const commentAction = await cursor.next();
      if (!commentAction) {
        continue;
      }

      const dataKey = this.computeDataKey(tenantID, commentAction.id);
      cmd.set(dataKey, this.serializeObject(commentAction));
      cmd.expire(dataKey, this.expirySeconds);

      const storyMembersKey = this.computeStoryMembersKey(
        tenantID,
        commentAction.storyID
      );
      cmd.sadd(storyMembersKey, commentAction.id);
      storyMemberKeys.push(storyMembersKey);

      const commentMembersKey = this.computeCommentMembersKey(
        tenantID,
        commentAction.commentID
      );
      cmd.sadd(commentMembersKey, commentAction.id);
      cmd.expire(commentMembersKey, this.expirySeconds);

      this.commentActionsByKey.set(dataKey, commentAction);
      commentActions.push(commentAction);
    }

    for (const key of storyMemberKeys) {
      cmd.expire(key, this.expirySeconds);
    }

    await cmd.exec();

    return commentActions;
  }

  public async primeCommentActions(tenantID: string, storyID: string) {
    const membersKey = this.computeStoryMembersKey(tenantID, storyID);
    const hasMembers = await this.redis.exists(membersKey);
    if (!hasMembers) {
      return;
    }

    const members = await this.redis.smembers(membersKey);

    const keys = members.map((m) => this.computeDataKey(tenantID, m));

    const start = Date.now();
    const records = keys && keys.length > 0 ? await this.redis.mget(keys) : [];
    const end = Date.now();
    this.logger.info({ elapsedMs: end - start }, "primeCommentActions - mget");

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

  public async findMany(tenantID: string, commentIDs: string[]) {
    const cmd = this.redis.multi();

    const idSet = new Set<string>();
    for (const commentID of commentIDs) {
      const key = this.computeCommentMembersKey(tenantID, commentID);
      cmd.smembers(key);
      idSet.add(commentID);
    }

    const results = await cmd.exec();

    const commentActionIDs: string[] = [];
    for (const [err, result] of results) {
      if (err) {
        continue;
      }

      if (!result) {
        continue;
      }

      const memberIDs = result as string[];
      if (!memberIDs) {
        continue;
      }

      commentActionIDs.push(...memberIDs);
    }

    const keys = commentActionIDs.map((id) => {
      return { id, key: this.computeDataKey(tenantID, id) };
    });

    const commentActions: Readonly<CommentAction>[] = [];
    const notFoundLocallyKeys: string[] = [];
    for (const entry of keys) {
      const commentAction = this.commentActionsByKey.get(entry.key);
      if (commentAction) {
        commentActions.push(commentAction);
      } else {
        notFoundLocallyKeys.push(entry.id);
      }
    }

    if (notFoundLocallyKeys.length > 0) {
      const notFoundIDs = keys.map((k) => k.id);
      await this.populateByCommentIDs(tenantID, notFoundIDs);

      const records = await this.redis.mget(notFoundLocallyKeys);
      for (const record of records) {
        if (!record) {
          continue;
        }

        const commentAction = this.deserializeObject(record);
        commentActions.push(commentAction);
      }
    }

    return commentActions;
  }

  public async add(commentAction: Readonly<CommentAction>) {
    const dataKey = this.computeDataKey(
      commentAction.tenantID,
      commentAction.id
    );
    const storyMemberKey = this.computeStoryMembersKey(
      commentAction.tenantID,
      commentAction.storyID
    );
    const commentMemberKey = this.computeCommentMembersKey(
      commentAction.tenantID,
      commentAction.commentID
    );

    const cmd = this.redis.multi();

    cmd.set(dataKey, this.serializeObject(commentAction));
    cmd.expire(dataKey, this.expirySeconds);

    cmd.sadd(storyMemberKey, commentAction.id);
    cmd.sadd(commentMemberKey, commentAction.id);

    await cmd.exec();

    this.commentActionsByKey.set(dataKey, commentAction);
  }

  public async remove(commentAction: Readonly<CommentAction>) {
    const dataKey = this.computeDataKey(
      commentAction.tenantID,
      commentAction.id
    );
    const storyMemberKey = this.computeStoryMembersKey(
      commentAction.tenantID,
      commentAction.storyID
    );
    const commentMemberKey = this.computeCommentMembersKey(
      commentAction.tenantID,
      commentAction.commentID
    );

    const cmd = this.redis.multi();

    cmd.del(dataKey);

    cmd.srem(storyMemberKey, commentAction.id);
    cmd.srem(commentMemberKey, commentAction.id);

    await cmd.exec();

    this.commentActionsByKey.delete(dataKey);
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
