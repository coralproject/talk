import { isNumber } from "lodash";

import { MongoContext } from "coral-server/data/context";
import { Comment } from "coral-server/models/comment";

import {
  GQLCOMMENT_SORT,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

export interface Filter {
  tag?: GQLTAG;
  rating?: number;
}

export class CommentCache {
  private mongo: MongoContext;

  private commentsByStoryID: Map<
    string,
    Map<string | null, Readonly<Comment>[]>
  >;

  constructor(mongo: MongoContext) {
    this.mongo = mongo;

    this.commentsByStoryID = new Map<
      string,
      Map<string, Readonly<Comment>[]>
    >();
  }

  public async loadCommentsForStory(
    tenantID: string,
    storyID: string,
    isArchived: boolean,
    filter: Filter
  ) {
    const { rating, tag } = filter;
    const hasRatingFilter =
      isNumber(rating) && Number.isInteger(rating) && rating < 1 && rating > 5;

    const collection =
      isArchived && this.mongo.archive
        ? this.mongo.archivedComments()
        : this.mongo.comments();

    const comments = await collection.find({ tenantID, storyID }).toArray();

    const map = new Map<string | null, Readonly<Comment>[]>();

    for (const comment of comments) {
      // apply rating filter if available
      if (hasRatingFilter && !comment.rating && comment.rating !== rating) {
        continue;
      }

      // apply tag filter if available
      if (tag && !comment.tags.find((t) => t.type === tag)) {
        continue;
      }

      const parentID = comment.parentID ? comment.parentID : null;

      if (!map.has(parentID)) {
        map.set(parentID, new Array<Readonly<Comment>>());
      }

      const bucket = map.get(parentID);
      if (bucket) {
        bucket.push(comment);
      }
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

    const childComments = comments.get(parentID);
    if (!childComments) {
      return [];
    }

    return this.sortComments(childComments, orderBy);
  }

  private recursivelyFindChildren(
    comments: Readonly<Comment>[],
    lookup: Map<string | null, Readonly<Comment>[]>
  ) {
    const result: Readonly<Comment>[] = [];
    for (const comment of comments) {
      result.push(comment);

      const children = lookup.get(comment.id);
      if (children) {
        const subChildren = this.recursivelyFindChildren(children, lookup);
        for (const subChild of subChildren) {
          result.push(subChild);
        }
      }
    }

    return result;
  }

  public flattenedChildCommentsForParent(
    storyID: string,
    parentID: string,
    orderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_ASC
  ) {
    const comments = this.commentsByStoryID.get(storyID);
    if (!comments) {
      return [];
    }

    const children = comments.get(parentID);
    if (!children) {
      return [];
    }

    const result = this.recursivelyFindChildren(children, comments);
    return this.sortComments(result, orderBy);
  }

  public rootCommentsForStory(
    storyID: string,
    orderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_DESC
  ) {
    const comments = this.commentsByStoryID.get(storyID);
    if (!comments) {
      return [];
    }

    const rootComments = comments.get(null);
    if (!rootComments) {
      return [];
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

  public async flattenedRepliesConnectionForParent(
    storyID: string,
    parentID: string,
    orderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_ASC
  ) {
    const comments = this.flattenedChildCommentsForParent(
      storyID,
      parentID,
      orderBy
    );
    return this.createConnection(comments);
  }
}