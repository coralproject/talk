import { MongoContext } from "coral-server/data/context";
import { GQLCOMMENT_SORT } from "coral-server/graph/schema/__generated__/types";
import { Comment } from "coral-server/models/comment";

export class CommentCache {
  private mongo: MongoContext;
  private commentsByStoryID: Map<string, Map<string, Readonly<Comment>>>;

  constructor(mongo: MongoContext) {
    this.mongo = mongo;

    this.commentsByStoryID = new Map<string, Map<string, Readonly<Comment>>>();
  }

  public async loadCommentsForStory(
    tenantID: string,
    storyID: string,
    isArchived: boolean
  ) {
    const collection =
      isArchived && this.mongo.archive
        ? this.mongo.archivedComments()
        : this.mongo.comments();

    const comments = await collection.find({ tenantID, storyID }).toArray();

    const map = new Map<string, Readonly<Comment>>();

    for (const comment of comments) {
      map.set(comment.id, comment);
    }

    this.commentsByStoryID.set(storyID, map);
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

  public childCommentsForParent(
    storyID: string,
    parentID: string,
    orderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_ASC
  ) {
    const comments = this.commentsByStoryID.get(storyID);
    if (!comments) {
      return [];
    }

    const rootComments: Readonly<Comment>[] = [];
    for (const value of comments.values()) {
      if (value.parentID === parentID) {
        rootComments.push(value);
      }
    }

    return this.sortComments(rootComments, orderBy);
  }

  public rootCommentsForStory(
    storyID: string,
    orderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_DESC
  ) {
    const comments = this.commentsByStoryID.get(storyID);
    if (!comments) {
      return [];
    }

    // Get all root level comments
    const rootComments: Readonly<Comment>[] = [];
    for (const value of comments.values()) {
      if (!value.parentID) {
        rootComments.push(value);
      }
    }

    return this.sortComments(rootComments, orderBy);
  }

  private async createConnection(comments: Readonly<Comment>[]) {
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

  public async rootCommentsConnectionForStory(
    storyID: string,
    orderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_DESC
  ) {
    const comments = this.rootCommentsForStory(storyID, orderBy);
    return this.createConnection(comments);
  }

  public async repliesConnectionForParent(
    storyID: string,
    parentID: string,
    orderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_ASC
  ) {
    const comments = this.childCommentsForParent(storyID, parentID, orderBy);
    return this.createConnection(comments);
  }
}
