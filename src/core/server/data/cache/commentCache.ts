import { MongoContext } from "coral-server/data/context";
import { Logger } from "coral-server/logger";
import { Comment } from "coral-server/models/comment";
import { PUBLISHED_STATUSES } from "coral-server/models/comment/constants";
import { AugmentedRedis } from "coral-server/services/redis";
import { TenantCache } from "coral-server/services/tenant/cache";

import {
  GQLCOMMENT_SORT,
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

import { dataCacheAvailable, IDataCache } from "./dataCache";

const REDIS_SUPPORTED_SORTS = [
  GQLCOMMENT_SORT.CREATED_AT_ASC,
  GQLCOMMENT_SORT.CREATED_AT_DESC,
];

export interface Filter {
  tag?: GQLTAG;
  rating?: number;
  statuses?: GQLCOMMENT_STATUS[];
}

export class CommentCache implements IDataCache {
  private disableLocalCaching: boolean;
  private expirySeconds: number;

  private mongo: MongoContext;
  private redis: AugmentedRedis;
  private logger: Logger;

  private commentsByKey: Map<string, Readonly<Comment>>;
  private membersLookup: Map<string, string[]>;
  private tenantCache: TenantCache | null;

  constructor(
    mongo: MongoContext,
    redis: AugmentedRedis,
    tenantCache: TenantCache | null,
    logger: Logger,
    disableLocalCaching: boolean,
    expirySeconds: number
  ) {
    this.mongo = mongo;
    this.redis = redis;
    this.tenantCache = tenantCache;

    this.logger = logger.child({ dataCache: "CommentCache" });

    this.disableLocalCaching = disableLocalCaching;
    this.expirySeconds = expirySeconds;

    this.commentsByKey = new Map<string, Readonly<Comment>>();
    this.membersLookup = new Map<string, string[]>();
  }

  public async available(tenantID: string): Promise<boolean> {
    return dataCacheAvailable(this.tenantCache, tenantID);
  }

  public computeLockKey(tenantID: string, storyID: string) {
    const key = `${tenantID}:${storyID}:lock`;
    return key;
  }

  public computeDataKey(tenantID: string, storyID: string, commentID: string) {
    const key = `${tenantID}:${storyID}:${commentID}:data`;
    return key;
  }

  public computeMembersKey(
    tenantID: string,
    storyID: string,
    parentID?: string | null
  ) {
    const key = parentID
      ? `${tenantID}:${storyID}:${parentID}:members`
      : `${tenantID}:${storyID}:root:members`;
    return key;
  }

  public computeStoryAllCommentsKey(tenantID: string, storyID: string) {
    const key = `${tenantID}:${storyID}:allComments`;
    return key;
  }

  public computeSortKey(
    tenantID: string,
    storyID: string,
    parentID: string | null | undefined
  ) {
    const sortKey = parentID
      ? `${tenantID}:${storyID}:${parentID}:dateSort`
      : `${tenantID}:${storyID}:root:dateSort`;
    return sortKey;
  }

  public async isCached(tenantID: string, storyID: string) {
    const lockKey = this.computeLockKey(tenantID, storyID);
    const hasCommentsInRedis = await this.redis.exists(lockKey);

    return hasCommentsInRedis > 0;
  }

  public async invalidateCache(tenantID: string, storyID: string) {
    const lockKey = this.computeLockKey(tenantID, storyID);
    const success = (await this.redis.del(lockKey)) > 0;

    return success;
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

    const comments = await collection
      .find({ tenantID, storyID, status: { $in: ["APPROVED", "NONE"] } })
      .toArray();
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

    const start1 = Date.now();
    const allCommentsIDs = await this.redis.smembers(key);
    const commentIDs = allCommentsIDs.map((id) => id.split(":")[1]);
    const end1 = Date.now();

    const start2 = Date.now();
    const comments = await this.findMany(tenantID, storyID, commentIDs);
    const end2 = Date.now();

    this.logger.info({ elapsedMs: end1 - start1 }, "primeComments - smembers");
    this.logger.info({ elapsedMs: end2 - start2 }, "primeComments - findMany");

    return comments;
  }

  public async populateCommentsInCache(
    tenantID: string,
    storyID: string,
    isArchived: boolean,
    now: Date
  ) {
    const comments = await this.retrieveCommentsFromMongoForStory(
      tenantID,
      storyID,
      isArchived
    );

    await this.createRelationalCommentKeysInRedis(
      tenantID,
      storyID,
      comments,
      now
    );

    const userIDs = new Set<string>();
    const commentIDs = new Set<string>();
    for (const comment of comments) {
      if (comment.authorID) {
        userIDs.add(comment.authorID);
      }
      commentIDs.add(comment.id);
    }

    return {
      userIDs: Array.from(userIDs),
      commentIDs: Array.from(commentIDs),
    };
  }

  public async primeCommentsForStory(
    tenantID: string,
    storyID: string,
    isArchived: boolean
  ) {
    const lockKey = this.computeLockKey(tenantID, storyID);
    const hasCommentsInRedis = await this.redis.exists(lockKey);

    const comments = hasCommentsInRedis
      ? await this.retrieveCommentsFromRedisForStory(tenantID, storyID)
      : await this.retrieveCommentsFromMongoForStory(
          tenantID,
          storyID,
          isArchived
        );

    await this.createRelationalCommentKeysLocally(tenantID, storyID, comments);

    const userIDs = new Set<string>();
    const commentIDs = new Set<string>();
    for (const comment of comments) {
      if (comment.authorID) {
        userIDs.add(comment.authorID);
      }
      commentIDs.add(comment.id);
    }

    return {
      userIDs: Array.from(userIDs),
      commentIDs: Array.from(commentIDs),
      retrievedFrom: hasCommentsInRedis ? "redis" : "mongo",
    };
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
    comments: Readonly<Comment>[],
    now: Date
  ) {
    const cmd = this.redis.multi();

    const lockKey = this.computeLockKey(tenantID, storyID);
    cmd.set(lockKey, now.getTime());
    cmd.expire(lockKey, this.expirySeconds);

    const allCommentsKey = this.computeStoryAllCommentsKey(tenantID, storyID);
    if (comments.length > 0) {
      cmd.sadd(
        allCommentsKey,
        comments.map((c) => `${c.parentID}:${c.id}`)
      );
      cmd.expire(allCommentsKey, this.expirySeconds);
    }

    const sortKeys = new Set<string>();
    for (const comment of comments) {
      const sortKey = this.computeSortKey(tenantID, storyID, comment.parentID);
      cmd.zadd(sortKey, comment.createdAt.getTime(), comment.id);

      sortKeys.add(sortKey);
    }

    for (const key of sortKeys) {
      cmd.expire(key, this.expirySeconds);
    }

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
      cmd.expire(key, this.expirySeconds);
    }

    // Create the parent to child key-value look ups
    for (const parentID of commentIDs.keys()) {
      const childIDs = commentIDs.get(parentID);
      if (!childIDs) {
        continue;
      }

      const key = this.computeMembersKey(tenantID, storyID, parentID);
      cmd.sadd(key, childIDs);
      cmd.expire(key, this.expirySeconds);
    }

    await cmd.exec();
  }

  public async find(
    tenantID: string,
    storyID: string,
    id: string
  ): Promise<Readonly<Comment> | null> {
    const key = this.computeDataKey(tenantID, storyID, id);

    const localComment = this.commentsByKey.get(key);
    if (localComment && !this.disableLocalCaching) {
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

  public async findCommentsInMongo(
    tenantID: string,
    storyID: string,
    parentID?: string | null,
    isArchived?: boolean
  ): Promise<Readonly<Comment>[]> {
    const filter = parentID
      ? {
          tenantID,
          storyID,
          parentID,
          status: { $in: ["APPROVED", "NONE"] },
        }
      : {
          tenantID,
          storyID,
          parentID: null,
          status: { $in: ["APPROVED", "NONE"] },
        };

    const collection = isArchived
      ? this.mongo.archivedComments()
      : this.mongo.comments();
    const comments = await collection.find(filter).toArray();

    return comments;
  }

  public async findMany(tenantID: string, storyID: string, ids: string[]) {
    if (ids.length === 0) {
      return [];
    }

    let results: Readonly<Comment>[] = [];
    const keys = ids.map((id) => this.computeDataKey(tenantID, storyID, id));
    if (keys.length === 0) {
      return [];
    }

    // try and load all the comments from the local cache
    const loadStart = Date.now();
    let someNotFound = false;
    for (const key of keys) {
      const localComment = this.commentsByKey.get(key);
      if (localComment && !this.disableLocalCaching) {
        results.push(localComment);
      } else {
        someNotFound = true;
        break;
      }
    }
    const loadEnd = Date.now();
    const loadElapsed = loadEnd - loadStart;
    if (loadElapsed > 1) {
      this.logger.info({ elapsedMs: loadElapsed }, "findMany - localLoad");
    }

    // we're missing some comments, just load em from redis
    if (someNotFound && keys && keys.length > 0) {
      results = [];

      const start = Date.now();
      const records = await this.redis.mget(keys);
      const end = Date.now();
      this.logger.info({ elapsedMs: end - start }, "findMany - mget");

      const deserStart = Date.now();
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
      const deserEnd = Date.now();
      this.logger.info(
        { elapsedMs: deserEnd - deserStart },
        "findMany - deserialize"
      );
    }

    return results;
  }

  public async findAllCommentsForStory(
    tenantID: string,
    storyID: string,
    isArchived: boolean
  ): Promise<Readonly<Comment>[]> {
    const lockKey = this.computeLockKey(tenantID, storyID);
    const hasCommentsInRedis = await this.redis.exists(lockKey);

    const comments = hasCommentsInRedis
      ? await this.retrieveCommentsFromRedisForStory(tenantID, storyID)
      : await this.retrieveCommentsFromMongoForStory(
          tenantID,
          storyID,
          isArchived
        );

    return comments;
  }

  public async findAncestors(tenantID: string, storyID: string, id: string) {
    const comment = await this.find(tenantID, storyID, id);
    if (!comment) {
      return [];
    }

    return this.findMany(tenantID, storyID, comment.ancestorIDs);
  }

  public async hasSortKey(
    tenantID: string,
    storyID: string,
    parentID: string | null | undefined
  ) {
    const sortKey = this.computeSortKey(tenantID, storyID, parentID);
    const redisHasSort = await this.redis.exists(sortKey);
    return redisHasSort;
  }

  public async canSortWithRedis(
    tenantID: string,
    storyID: string,
    parentID: string | null | undefined,
    orderBy: GQLCOMMENT_SORT
  ) {
    const hasSort = await this.hasSortKey(tenantID, storyID, parentID);
    return REDIS_SUPPORTED_SORTS.includes(orderBy) && hasSort;
  }

  public async sortWithRedis(
    tenantID: string,
    storyID: string,
    parentID: string | null | undefined,
    comments: Readonly<Comment>[],
    orderBy: GQLCOMMENT_SORT
  ) {
    let start = Date.now();
    const sortKey = this.computeSortKey(tenantID, storyID, parentID);
    const orderedIDs = await this.redis.zrange(sortKey, 0, comments.length * 2);
    let end = Date.now();

    this.logger.info(
      { elapsedMs: end - start, orderBy, count: comments.length },
      "redis - sort - zrange"
    );

    start = Date.now();
    const sortedComments: Readonly<Comment>[] = [];
    let index =
      orderBy === GQLCOMMENT_SORT.CREATED_AT_ASC ? 0 : orderedIDs.length - 1;
    const incr = orderBy === GQLCOMMENT_SORT.CREATED_AT_ASC ? 1 : -1;

    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < orderedIDs.length; i++) {
      const id = orderedIDs[index];
      index += incr;

      const dataKey = this.computeDataKey(tenantID, storyID, id);
      const comment = this.commentsByKey.get(dataKey);
      if (comment) {
        sortedComments.push(comment);
      }
    }
    end = Date.now();
    this.logger.info(
      { elapsedMs: end - start, orderBy, count: orderedIDs.length },
      "redis - sort - organize"
    );

    return this.createConnection(sortedComments);
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
      const lockKey = this.computeLockKey(tenantID, storyID);
      const redisHasLock = await this.redis.exists(lockKey);
      if (!redisHasLock) {
        return this.createConnection(
          await this.findCommentsInMongo(tenantID, storyID, null, isArchived)
        );
      }

      const redisHasMembers = await this.redis.exists(membersKey);
      if (redisHasMembers) {
        const start = Date.now();
        rootCommentIDs = await this.redis.smembers(membersKey);
        const end = Date.now();
        this.logger.info({ elapsedMs: end - start }, "rootComments - smembers");
      } else {
        rootCommentIDs = [];
      }
    }

    if (rootCommentIDs.length === 0) {
      return this.createConnection([]);
    }

    const comments = await this.findMany(tenantID, storyID, rootCommentIDs);

    if (await this.canSortWithRedis(tenantID, storyID, null, orderBy)) {
      return await this.sortWithRedis(
        tenantID,
        storyID,
        null,
        comments,
        orderBy
      );
    } else {
      const sortedComments = this.sortComments(comments, orderBy);
      return this.createConnection(sortedComments);
    }
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

  public async allChildCommentsRecursive(
    parent: Readonly<Comment>,
    isArchived: boolean,
    orderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_ASC
  ): Promise<Readonly<Comment>[]> {
    const repliesConnection = await this.replies(
      parent.tenantID,
      parent.storyID,
      parent.id,
      isArchived,
      orderBy
    );
    const replies = repliesConnection.nodes as Readonly<Comment>[];

    const results: Readonly<Comment>[] = [];
    for (const reply of replies) {
      results.push(reply);
      const children = await this.allChildCommentsRecursive(
        reply,
        isArchived,
        orderBy
      );
      for (const child of children) {
        results.push(child);
      }
    }

    return results;
  }

  public async allChildComments(
    tenantID: string,
    storyID: string,
    parentID: string,
    isArchived: boolean,
    orderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_ASC
  ) {
    const repliesConnection = await this.replies(
      tenantID,
      storyID,
      parentID,
      isArchived,
      orderBy
    );
    const replies = repliesConnection.nodes as Readonly<Comment>[];

    const results: Readonly<Comment>[] = [];
    for (const reply of replies) {
      results.push(reply);
      const children = await this.allChildCommentsRecursive(
        reply,
        isArchived,
        orderBy
      );
      for (const child of children) {
        results.push(child);
      }
    }

    return this.createConnection(results);
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

    if (await this.canSortWithRedis(tenantID, storyID, parentID, orderBy)) {
      return await this.sortWithRedis(
        tenantID,
        storyID,
        parentID,
        comments,
        orderBy
      );
    } else {
      const sortedComments = this.sortComments(comments, orderBy);
      return this.createConnection(sortedComments);
    }
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
      const lockKey = this.computeLockKey(tenantID, storyID);
      const redisHasLock = await this.redis.exists(lockKey);
      if (!redisHasLock) {
        return await this.findCommentsInMongo(
          tenantID,
          storyID,
          parentID,
          isArchived
        );
      }

      const redisHasMembers = await this.redis.exists(membersKey);
      if (redisHasMembers) {
        const start = Date.now();
        commentIDs = await this.redis.smembers(membersKey);
        const end = Date.now();
        this.logger.info({ elapsedMs: end - start }, "replies - smembers");
      } else {
        commentIDs = [];
      }
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
    cmd.expire(dataKey, this.expirySeconds);

    const parentKey = this.computeMembersKey(
      comment.tenantID,
      comment.storyID,
      comment.parentID
    );
    cmd.sadd(parentKey, comment.id);
    cmd.expire(parentKey, this.expirySeconds);

    const allKey = this.computeStoryAllCommentsKey(
      comment.tenantID,
      comment.storyID
    );
    cmd.sadd(allKey, `${comment.parentID}:${comment.id}`);
    cmd.expire(allKey, this.expirySeconds);

    const sortKey = this.computeSortKey(
      comment.tenantID,
      comment.storyID,
      comment.parentID
    );
    cmd.zadd(sortKey, comment.createdAt.getTime(), comment.id);
    cmd.expire(sortKey, this.expirySeconds);

    await cmd.exec();

    this.commentsByKey.set(dataKey, comment);

    if (!this.membersLookup.has(parentKey)) {
      this.membersLookup.set(parentKey, []);
    }
    this.membersLookup.get(parentKey)!.push(comment.id);
  }

  public async remove(comment: Readonly<Comment>) {
    const cmd = this.redis.multi();

    const dataKey = this.computeDataKey(
      comment.tenantID,
      comment.storyID,
      comment.id
    );

    const parentKey = this.computeMembersKey(
      comment.tenantID,
      comment.storyID,
      comment.parentID
    );

    const allKey = this.computeStoryAllCommentsKey(
      comment.tenantID,
      comment.storyID
    );

    const sortKey = this.computeSortKey(
      comment.tenantID,
      comment.storyID,
      comment.parentID
    );

    cmd.del(dataKey);
    cmd.srem(parentKey, comment.id);
    cmd.srem(allKey, `${comment.parentID}:${comment.id}`);
    cmd.zrem(sortKey, comment.createdAt.getTime(), comment.id);

    await cmd.exec();
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
    return json;
  }

  private deserializeObject(data: string): Readonly<Comment> {
    const parsed = JSON.parse(data);
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
    };
  }
}
