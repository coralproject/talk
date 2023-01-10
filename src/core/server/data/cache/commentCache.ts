import zlib from "zlib";

import { MongoContext } from "coral-server/data/context";
import { Logger } from "coral-server/logger";
import { Comment } from "coral-server/models/comment";
import { PUBLISHED_STATUSES } from "coral-server/models/comment/constants";
import { AugmentedRedis } from "coral-server/services/redis";

import {
  GQLCOMMENT_SORT,
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

export const COMMENT_CACHE_DATA_EXPIRY = 24 * 60 * 60;

export interface Filter {
  tag?: GQLTAG;
  rating?: number;
  statuses?: GQLCOMMENT_STATUS[];
}

export class CommentCache {
  private mongo: MongoContext;
  private redis: AugmentedRedis;
  private logger: Logger;

  private commentsByKey: Map<string, Readonly<Comment>>;
  private membersLookup: Map<string, string[]>;

  constructor(mongo: MongoContext, redis: AugmentedRedis, logger: Logger) {
    this.mongo = mongo;
    this.redis = redis;
    this.logger = logger.child({ dataCache: "CommentCache" });

    this.commentsByKey = new Map<string, Readonly<Comment>>();
    this.membersLookup = new Map<string, string[]>();
  }

  private computeDataKey(tenantID: string, storyID: string, commentID: string) {
    const key = `${tenantID}:${storyID}:${commentID}:data`;
    return key;
  }

  private computeMembersKey(
    tenantID: string,
    storyID: string,
    parentID?: string | null
  ) {
    const key = parentID
      ? `${tenantID}:${storyID}:${parentID}`
      : `${tenantID}:${storyID}:root`;
    return key;
  }

  private computeStoryAllCommentsKey(tenantID: string, storyID: string) {
    const key = `${tenantID}:${storyID}:members`;
    return key;
  }

  private async retrieveCommentsFromMongoForStory(
    tenantID: string,
    storyID: string,
    isArchived: boolean
  ): Promise<Readonly<Comment>[]> {
    const collection =
      isArchived && this.mongo.archive
        ? this.mongo.archivedComments()
        : this.mongo.comments();

    const comments = await collection.find({ tenantID, storyID }).toArray();
    if (!comments || comments.length === 0) {
      return [];
    }

    return comments;
  }

  private async retrieveCommentsFromRedisForStory(
    tenantID: string,
    storyID: string
  ): Promise<Readonly<Comment>[]> {
    const key = this.computeStoryAllCommentsKey(tenantID, storyID);
    const allCommentsIDs = await this.redis.smembers(key);
    const commentIDs = allCommentsIDs.map((id) => id.split(":")[1]);

    const comments = await this.findMany(tenantID, storyID, commentIDs);
    return comments;
  }

  public async primeCommentsForStory(
    tenantID: string,
    storyID: string,
    isArchived: boolean
  ) {
    const allKey = this.computeStoryAllCommentsKey(tenantID, storyID);
    const hasCommentsInRedis = await this.redis.exists(allKey);

    const comments = hasCommentsInRedis
      ? await this.retrieveCommentsFromRedisForStory(tenantID, storyID)
      : await this.retrieveCommentsFromMongoForStory(
          tenantID,
          storyID,
          isArchived
        );

    await this.createRelationalCommentKeysLocally(tenantID, storyID, comments);

    if (!hasCommentsInRedis) {
      await this.createRelationalCommentKeysInRedis(
        tenantID,
        storyID,
        comments
      );
    }
  }

  private async createRelationalCommentKeysLocally(
    tenantID: string,
    storyID: string,
    comments: Readonly<Comment>[]
  ) {
    for (const comment of comments) {
      const dataKey = this.computeDataKey(tenantID, storyID, comment.id);
      this.commentsByKey.set(dataKey, comment);

      const parentKey = this.computeMembersKey(
        tenantID,
        storyID,
        comment.parentID
      );

      if (!this.membersLookup.has(parentKey)) {
        this.membersLookup.set(parentKey, []);
      }
      this.membersLookup.get(parentKey)!.push(comment.id);
    }
  }

  private async createRelationalCommentKeysInRedis(
    tenantID: string,
    storyID: string,
    comments: Readonly<Comment>[]
  ) {
    const cmd = this.redis.multi();

    const allCommentsKey = this.computeStoryAllCommentsKey(tenantID, storyID);
    cmd.sadd(allCommentsKey, ...comments.map((c) => `${c.parentID}:${c.id}`));

    // Create the comment data key-value look ups
    const commentIDs = new Map<string, string[]>();
    for (const comment of comments) {
      const parentID = comment.parentID ? comment.parentID : "root";

      if (!commentIDs.has(parentID)) {
        commentIDs.set(parentID, []);
      }

      commentIDs.get(parentID)!.push(comment.id);

      const key = this.computeDataKey(tenantID, storyID, comment.id);
      const value = this.serializeObject(comment);

      cmd.set(key, value);
      cmd.expire(key, COMMENT_CACHE_DATA_EXPIRY);
    }

    // Create the parent to child key-value look ups
    for (const parentID of commentIDs.keys()) {
      const childIDs = commentIDs.get(parentID);
      if (!childIDs) {
        continue;
      }

      const key = this.computeMembersKey(tenantID, storyID, parentID);
      cmd.sadd(key, ...childIDs);
      cmd.expire(key, COMMENT_CACHE_DATA_EXPIRY);
    }

    await cmd.exec();
  }

  private async populateRootComments(
    tenantID: string,
    storyID: string,
    isArchived: boolean
  ): Promise<string[]> {
    const collection =
      isArchived && this.mongo.archive
        ? this.mongo.archivedComments()
        : this.mongo.comments();

    const comments = await collection.find({ tenantID, storyID }).toArray();
    if (!comments || comments.length === 0) {
      return [];
    }

    await this.createRelationalCommentKeysInRedis(tenantID, storyID, comments);

    return comments.map((c) => c.id);
  }

  private async populateReplies(
    tenantID: string,
    storyID: string,
    parentID: string,
    isArchived: boolean
  ) {
    const collection =
      isArchived && this.mongo.archive
        ? this.mongo.archivedComments()
        : this.mongo.comments();

    const comments = await collection
      .find({ tenantID, storyID, parentID })
      .toArray();
    if (!comments || comments.length === 0) {
      return [];
    }

    await this.createRelationalCommentKeysInRedis(tenantID, storyID, comments);

    return comments.map((c) => c.id);
  }

  public async find(
    tenantID: string,
    storyID: string,
    id: string
  ): Promise<Readonly<Comment> | null> {
    const key = this.computeDataKey(tenantID, storyID, id);

    const localComment = this.commentsByKey.get(key);
    if (localComment) {
      return localComment;
    }

    const start = Date.now();
    const record = await this.redis.get(key);
    const end = Date.now();
    this.logger.info({ elapsedMs: end - start }, "find - get");

    if (!record) {
      return null;
    }

    const comment = this.deserializeObject(record);
    this.commentsByKey.set(key, comment);

    return comment;
  }

  public async findMany(tenantID: string, storyID: string, ids: string[]) {
    if (ids.length === 0) {
      return [];
    }

    const results: Readonly<Comment>[] = [];
    const keys = ids.map((id) => this.computeDataKey(tenantID, storyID, id));

    const notFound: string[] = [];
    for (const key of keys) {
      const localComment = this.commentsByKey.get(key);
      if (localComment) {
        results.push(localComment);
      } else {
        notFound.push(key);
      }
    }

    if (notFound.length > 0) {
      const batches: string[][] = [];
      let index = 0;
      const batchSize = 25;

      batches.push([]);

      for (const key of notFound) {
        const batch = batches[index];
        batch.push(key);

        if (batch.length >= batchSize) {
          index++;
          batches.push([]);
        }
      }

      const pipeline = this.redis.pipeline();
      for (const batch of batches) {
        pipeline.mget(...batch);
      }

      const start = Date.now();
      const recordSets = await pipeline.exec();
      const end = Date.now();
      this.logger.info({ elapsedMs: end - start }, "findMany - pipeline(mget)");

      const records: (string | null)[] = [];
      for (const [err, set] of recordSets) {
        if (!set || err) {
          continue;
        }

        for (const record of set) {
          records.push(record);
        }
      }

      for (const record of records) {
        if (!record) {
          continue;
        }

        const comment = this.deserializeObject(record);

        this.commentsByKey.set(
          this.computeDataKey(comment.tenantID, comment.storyID, comment.id),
          comment
        );
        results.push(comment);
      }

      // PIPELINE GET

      // const pipeline = this.redis.pipeline();
      // for (const key of notFound) {
      //   pipeline.get(key);
      // }

      // const records = await pipeline.exec();

      // for (const [err, record] of records) {
      //   if (!record || err) {
      //     continue;
      //   }

      //   const comment = this.deserializeObject(record);

      //   this.commentsByKey.set(
      //     this.computeDataKey(comment.tenantID, comment.storyID, comment.id),
      //     comment
      //   );
      //   results.push(comment);
      // }
    }

    const ordered: Readonly<Comment>[] = [];
    for (const id of ids) {
      const comment = results.find((c) => c.id === id);
      if (comment) {
        ordered.push(comment);
      }
    }

    return ordered;
  }

  public async oldFindMany(tenantID: string, storyID: string, ids: string[]) {
    if (ids.length === 0) {
      return [];
    }

    const results: Readonly<Comment>[] = [];
    const keys = ids.map((id) => this.computeDataKey(tenantID, storyID, id));

    const notFound: string[] = [];
    for (const key of keys) {
      const localComment = this.commentsByKey.get(key);
      if (localComment) {
        results.push(localComment);
      } else {
        notFound.push(key);
      }
    }

    if (notFound.length > 0) {
      const start = Date.now();
      const records = await this.redis.mget(...notFound);
      const end = Date.now();
      this.logger.info({ elapsedMs: end - start }, "oldFindMany - mget");

      for (const record of records) {
        if (!record) {
          continue;
        }

        const comment = this.deserializeObject(record);

        this.commentsByKey.set(
          this.computeDataKey(comment.tenantID, comment.storyID, comment.id),
          comment
        );
        results.push(comment);
      }
    }

    const ordered: Readonly<Comment>[] = [];
    for (const id of ids) {
      const comment = results.find((c) => c.id === id);
      if (comment) {
        ordered.push(comment);
      }
    }

    return ordered;
  }

  public async findAncestors(tenantID: string, storyID: string, id: string) {
    const comment = await this.find(tenantID, storyID, id);
    if (!comment) {
      return [];
    }

    return this.findMany(tenantID, storyID, comment.ancestorIDs);
  }

  public async rootComments(
    tenantID: string,
    storyID: string,
    isArchived: boolean,
    orderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_DESC
  ) {
    const membersKey = this.computeMembersKey(tenantID, storyID);

    let rootCommentIDs = this.membersLookup.get(membersKey);
    if (!rootCommentIDs) {
      const start = Date.now();
      rootCommentIDs = await this.redis.smembers(membersKey);
      const end = Date.now();
      this.logger.info({ elapsedMs: end - start }, "rootComments - smembers");

      if (!rootCommentIDs || rootCommentIDs.length === 0) {
        rootCommentIDs = await this.populateRootComments(
          tenantID,
          storyID,
          isArchived
        );
      }

      this.membersLookup.set(membersKey, rootCommentIDs);
    }

    if (rootCommentIDs.length === 0) {
      return this.createConnection([]);
    }

    const comments = await this.findMany(tenantID, storyID, rootCommentIDs);
    const sortedComments = this.sortComments(comments, orderBy);

    return this.createConnection(sortedComments);
  }

  public async flattenedReplies(
    tenantID: string,
    storyID: string,
    parentID: string,
    isArchived: boolean,
    orderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_ASC
  ) {
    const comments = await this.flattenRepliesRecursive(
      tenantID,
      storyID,
      parentID,
      isArchived
    );
    const sortedComments = this.sortComments(comments, orderBy);

    return this.createConnection(sortedComments);
  }

  private async flattenRepliesRecursive(
    tenantID: string,
    storyID: string,
    parentID: string,
    isArchived: boolean
  ) {
    const result: Readonly<Comment>[] = [];

    const replies = await this.retrieveReplies(
      tenantID,
      storyID,
      parentID,
      isArchived
    );
    for (const reply of replies) {
      result.push(reply);

      if (reply.childCount > 0) {
        const childrenOfReplies = await this.flattenRepliesRecursive(
          tenantID,
          storyID,
          reply.id,
          isArchived
        );
        for (const child of childrenOfReplies) {
          result.push(child);
        }
      }
    }

    return result;
  }

  public async replies(
    tenantID: string,
    storyID: string,
    parentID: string,
    isArchived: boolean,
    orderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_ASC
  ) {
    const comments = await this.retrieveReplies(
      tenantID,
      storyID,
      parentID,
      isArchived
    );
    const sortedComments = this.sortComments(comments, orderBy);

    return this.createConnection(sortedComments);
  }

  private async retrieveReplies(
    tenantID: string,
    storyID: string,
    parentID: string,
    isArchived: boolean
  ) {
    const parent = await this.find(tenantID, storyID, parentID);
    if (!parent || parent.childCount === 0) {
      return [];
    }

    const membersKey = this.computeMembersKey(tenantID, storyID, parentID);
    let commentIDs = this.membersLookup.get(membersKey);
    if (!commentIDs) {
      const start = Date.now();
      commentIDs = await this.redis.smembers(membersKey);
      const end = Date.now();
      this.logger.info({ elapsedMs: end - start }, "replies - smembers");
      if (!commentIDs || commentIDs.length === 0) {
        commentIDs = await this.populateReplies(
          tenantID,
          storyID,
          parentID,
          isArchived
        );
      }

      this.membersLookup.set(membersKey, commentIDs);
    }

    if (commentIDs.length === 0) {
      return [];
    }

    const comments = await this.findMany(tenantID, storyID, commentIDs);

    return comments;
  }

  public async update(comment: Readonly<Comment>) {
    if (!PUBLISHED_STATUSES.includes(comment.status)) {
      return;
    }

    const cmd = this.redis.multi();

    const dataKey = this.computeDataKey(
      comment.tenantID,
      comment.storyID,
      comment.id
    );
    cmd.set(dataKey, this.serializeObject(comment));
    cmd.expire(dataKey, COMMENT_CACHE_DATA_EXPIRY);

    const parentKey = this.computeMembersKey(
      comment.tenantID,
      comment.storyID,
      comment.parentID
    );
    cmd.sadd(parentKey, comment.id);
    cmd.expire(parentKey, COMMENT_CACHE_DATA_EXPIRY);

    const allKey = this.computeStoryAllCommentsKey(
      comment.tenantID,
      comment.storyID
    );
    cmd.sadd(allKey, `${comment.parentID}:${comment.id}`);

    await cmd.exec();

    this.commentsByKey.set(dataKey, comment);

    if (!this.membersLookup.has(parentKey)) {
      this.membersLookup.set(parentKey, []);
    }
    this.membersLookup.get(parentKey)!.push(comment.id);
  }

  private createConnection(comments: Readonly<Comment>[]) {
    const edges: any[] = [];
    const nodes: any[] = [];

    for (const comment of comments) {
      nodes.push(comment);
      edges.push({
        cursor: comment.createdAt,
        node: comment,
      });
    }

    return {
      edges,
      nodes,
      pageInfo: {
        endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : null,
        startCursor: null,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
  }

  private sortComments(
    comments: Readonly<Comment>[],
    orderBy: GQLCOMMENT_SORT
  ) {
    return comments.sort((a, b) => {
      if (orderBy === GQLCOMMENT_SORT.CREATED_AT_ASC) {
        return a.createdAt.getTime() - b.createdAt.getTime();
      }
      if (orderBy === GQLCOMMENT_SORT.CREATED_AT_DESC) {
        return b.createdAt.getTime() - a.createdAt.getTime();
      }
      if (orderBy === GQLCOMMENT_SORT.REPLIES_DESC) {
        return b.childCount - a.childCount;
      }
      if (orderBy === GQLCOMMENT_SORT.REACTION_DESC) {
        const aCount = a.actionCounts.REACTION ?? 0;
        const bCount = b.actionCounts.REACTION ?? 0;

        return bCount - aCount;
      }

      return 0;
    });
  }

  private serializeObject(comment: Readonly<Comment>) {
    const json = JSON.stringify(comment);
    const data = zlib.brotliCompressSync(json).toString("base64");

    return data;
  }

  private deserializeObject(data: string): Readonly<Comment> {
    const buffer = Buffer.from(data, "base64");
    const json = zlib.brotliDecompressSync(buffer).toString();
    const parsed = JSON.parse(json);

    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
    };
  }
}
