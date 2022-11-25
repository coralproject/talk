import { MongoContext } from "coral-server/data/context";
import { Comment } from "coral-server/models/comment";
import { PUBLISHED_STATUSES } from "coral-server/models/comment/constants";
import { AugmentedRedis } from "coral-server/services/redis";

import {
  GQLCOMMENT_SORT,
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

export interface Filter {
  tag?: GQLTAG;
  rating?: number;
  statuses?: GQLCOMMENT_STATUS[];
}

export class CommentCache {
  private mongo: MongoContext;
  private redis: AugmentedRedis;

  constructor(mongo: MongoContext, redis: AugmentedRedis) {
    this.mongo = mongo;
    this.redis = redis;
  }

  private async createCommentKeysInRedis(
    tenantID: string,
    storyID: string,
    comments: Readonly<Comment>[]
  ) {
    const cmd = this.redis.multi();

    const commentIDs = new Map<string, string[]>();
    for (const comment of comments) {
      const parentID = comment.parentID ? comment.parentID : "root";

      if (!commentIDs.has(parentID)) {
        commentIDs.set(parentID, []);
      }

      commentIDs.get(parentID)!.push(comment.id);

      const key = `${tenantID}:${storyID}:${comment.id}:data`;
      const value = JSON.stringify(comment);

      cmd.set(key, value);
      cmd.expire(key, 24 * 60 * 60);
    }

    for (const parentID of commentIDs.keys()) {
      const childIDs = commentIDs.get(parentID);
      if (!childIDs) {
        continue;
      }

      const key = `${tenantID}:${storyID}:${parentID}`;
      cmd.sadd(key, ...childIDs);
      cmd.expire(key, 24 * 60 * 60);
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

    await this.createCommentKeysInRedis(tenantID, storyID, comments);

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

    await this.createCommentKeysInRedis(tenantID, storyID, comments);

    return comments.map((c) => c.id);
  }

  public async find(
    tenantID: string,
    storyID: string,
    id: string
  ): Promise<Readonly<Comment> | null> {
    const key = `${tenantID}:${storyID}:${id}:data`;
    const record = await this.redis.get(key);
    if (!record) {
      return null;
    }

    const comment = JSON.parse(record) as Comment;
    return comment;
  }

  public async findMany(tenantID: string, storyID: string, ids: string[]) {
    if (ids.length === 0) {
      return [];
    }

    const keys = ids.map((id) => `${tenantID}:${storyID}:${id}:data`);
    const records = await this.redis.mget(...keys);

    const result: Readonly<Comment>[] = [];
    for (const record of records) {
      if (!record) {
        continue;
      }

      const comment = JSON.parse(record) as Comment;
      result.push(comment);
    }

    return result;
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
    let rootCommentIDs = await this.redis.smembers(
      `${tenantID}:${storyID}:root`
    );
    if (!rootCommentIDs || rootCommentIDs.length === 0) {
      rootCommentIDs = await this.populateRootComments(
        tenantID,
        storyID,
        isArchived
      );
    }

    if (rootCommentIDs.length === 0) {
      return this.createConnection([]);
    }

    const rawRecords = await this.redis.mget(
      ...rootCommentIDs.map((id) => `${tenantID}:${storyID}:${id}:data`)
    );

    const comments: Readonly<Comment>[] = [];
    for (const rawRecord of rawRecords) {
      if (rawRecord === null) {
        continue;
      }

      comments.push(this.parseJSONIntoComment(rawRecord));
    }

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
    const parentKey = `${tenantID}:${storyID}:${parentID}:data`;
    const parentRecord = await this.redis.get(parentKey);
    if (!parentRecord) {
      return [];
    }

    const parent = this.parseJSONIntoComment(parentRecord);
    if (parent.childCount === 0) {
      return [];
    }

    const membersKey = `${tenantID}:${storyID}:${parentID}`;
    let commentIDs = await this.redis.smembers(membersKey);
    if (!commentIDs || commentIDs.length === 0) {
      commentIDs = await this.populateReplies(
        tenantID,
        storyID,
        parentID,
        isArchived
      );
    }

    if (commentIDs.length === 0) {
      return [];
    }

    const rawRecords = await this.redis.mget(
      ...commentIDs.map((id) => `${tenantID}:${storyID}:${id}:data`)
    );

    const comments: Readonly<Comment>[] = [];
    for (const rawRecord of rawRecords) {
      if (rawRecord === null) {
        continue;
      }

      comments.push(this.parseJSONIntoComment(rawRecord));
    }

    return comments;
  }

  public async update(comment: Readonly<Comment>) {
    if (!PUBLISHED_STATUSES.includes(comment.status)) {
      return;
    }

    const cmd = this.redis.multi();

    const dataKey = `${comment.tenantID}:${comment.storyID}:${comment.id}:data`;
    cmd.set(dataKey, JSON.stringify(comment));
    cmd.expire(dataKey, 24 * 60 * 60);

    const parentKey = `${comment.tenantID}:${comment.storyID}:${
      comment.parentID ?? "root"
    }`;
    cmd.sadd(parentKey, comment.id);
    cmd.expire(parentKey, 24 * 60 * 60);

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

  private parseJSONIntoComment(json: string): Readonly<Comment> {
    const parsed = JSON.parse(json);

    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
    };
  }
}
