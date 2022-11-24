import { isNumber } from "lodash";

import { MongoContext } from "coral-server/data/context";
import { Comment } from "coral-server/models/comment";

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

  private commentsByParentID: Map<
    string,
    Map<string | null, Readonly<Comment>[]>
  >;
  private commentsByID: Map<string, Map<string, Readonly<Comment>>>;

  constructor(mongo: MongoContext) {
    this.mongo = mongo;

    this.commentsByParentID = new Map<
      string,
      Map<string, Readonly<Comment>[]>
    >();

    this.commentsByID = new Map<string, Map<string, Readonly<Comment>>>();
  }

  private computeSortFilter(orderBy: GQLCOMMENT_SORT) {
    switch (orderBy) {
      case GQLCOMMENT_SORT.CREATED_AT_DESC:
        return { createdAt: -1 };
      case GQLCOMMENT_SORT.CREATED_AT_ASC:
        return { createdAt: 1 };
      case GQLCOMMENT_SORT.REPLIES_DESC:
        return { childCount: -1, createdAt: -1 };
      case GQLCOMMENT_SORT.REACTION_DESC:
        return { "actionCounts.REACTION": -1, createdAt: -1 };
    }
  }

  public async loadCommentsForStory(
    tenantID: string,
    storyID: string,
    isArchived: boolean,
    filter: Filter,
    orderBy: GQLCOMMENT_SORT
  ) {
    const { rating, tag, statuses } = filter;
    const hasRatingFilter =
      isNumber(rating) && Number.isInteger(rating) && rating < 1 && rating > 5;

    const collection =
      isArchived && this.mongo.archive
        ? this.mongo.archivedComments()
        : this.mongo.comments();

    const sortBy = this.computeSortFilter(orderBy);

    const comments = collection.find({ tenantID, storyID }).sort(sortBy);

    const parentMap = new Map<string | null, Readonly<Comment>[]>();
    const commentMap = new Map<string, Readonly<Comment>>();

    const authorIDs = new Set<string>();

    while (await comments.hasNext()) {
      const comment = await comments.next();
      if (!comment) {
        continue;
      }

      // apply rating filter if available
      if (hasRatingFilter && !comment.rating && comment.rating !== rating) {
        continue;
      }

      // apply tag filter if available
      if (tag && !comment.tags.find((t) => t.type === tag)) {
        continue;
      }

      // filter by status if available
      if (statuses && !statuses.includes(comment.status)) {
        continue;
      }

      const parentID = comment.parentID ? comment.parentID : null;

      if (!parentMap.has(parentID)) {
        parentMap.set(parentID, new Array<Readonly<Comment>>());
      }

      const bucket = parentMap.get(parentID);
      if (bucket) {
        bucket.push(comment);
        commentMap.set(comment.id, comment);

        if (comment.authorID) {
          authorIDs.add(comment.authorID);
        }
      }
    }

    this.commentsByParentID.set(storyID, parentMap);

    return Array.from(authorIDs);
  }

  public find(storyID: string, id: string): Readonly<Comment> | null {
    const comments = this.commentsByID.get(storyID);
    if (!comments) {
      return null;
    }

    const comment = comments.get(id);
    if (!comment) {
      return null;
    }

    return comment;
  }

  public findAncestors(storyID: string, id: string) {
    const comments = this.commentsByID.get(storyID);
    if (!comments) {
      return [];
    }

    const comment = comments.get(id);
    if (!comment) {
      return [];
    }

    const result: Readonly<Comment>[] = [];
    for (const ancestorID of comment.ancestorIDs) {
      const ancestor = comments.get(ancestorID);
      if (ancestor) {
        result.push(ancestor);
      }
    }

    return result;
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
    const comments = this.commentsByParentID.get(storyID);
    if (!comments) {
      return [];
    }

    const childComments = comments.get(parentID);
    if (!childComments) {
      return [];
    }

    const sorted = this.sortComments(childComments, orderBy);
    return sorted;
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
    const comments = this.commentsByParentID.get(storyID);
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
    const comments = this.commentsByParentID.get(storyID);
    if (!comments) {
      return [];
    }

    const rootComments = comments.get(null);
    if (!rootComments) {
      return [];
    }

    return rootComments;
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

  public rootCommentsConnectionForStory(
    storyID: string,
    orderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_DESC
  ) {
    const comments = this.rootCommentsForStory(storyID, orderBy);
    return this.createConnection(comments);
  }

  public repliesConnectionForParent(
    storyID: string,
    parentID: string,
    orderBy: GQLCOMMENT_SORT = GQLCOMMENT_SORT.CREATED_AT_ASC
  ) {
    const comments = this.childCommentsForParent(storyID, parentID, orderBy);
    const conn = this.createConnection(comments);

    return conn;
  }

  public flattenedRepliesConnectionForParent(
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
