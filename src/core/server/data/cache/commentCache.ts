import { MongoContext } from "coral-server/data/context";
import { Comment } from "coral-server/models/comment";
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
    if (!comments) {
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
    if (!comments) {
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
      return { conn: this.createConnection([]), authorIDs: [] };
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

    return {
      conn: this.createConnection(sortedComments),
      authorIDs: this.selectAuthorIDs(comments),
    };
  }

  public async replies(
    tenantID: string,
    storyID: string,
    parentID: string,
    isArchived: boolean,
    orderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_ASC
  ) {
    const key = `${tenantID}:${storyID}:${parentID}`;
    let commentIDs = await this.redis.smembers(key);
    if (!commentIDs || commentIDs.length === 0) {
      commentIDs = await this.populateReplies(
        tenantID,
        storyID,
        parentID,
        isArchived
      );
    }

    if (commentIDs.length === 0) {
      return { conn: this.createConnection([]), authorIDs: [] };
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

    const sortedComments = this.sortComments(comments, orderBy);

    return {
      conn: this.createConnection(sortedComments),
      authorIDs: this.selectAuthorIDs(comments),
    };
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

  private selectAuthorIDs(comments: Readonly<Comment>[]) {
    const result: string[] = [];
    for (const comment of comments) {
      if (comment.authorID) {
        result.push(comment.authorID);
      }
    }

    return result;
  }
}
