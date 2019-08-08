import DataLoader from "dataloader";
import { isNil, omitBy } from "lodash";
import { DateTime } from "luxon";

import Context from "coral-server/graph/tenant/context";
import {
  CommentToParentsArgs,
  CommentToRepliesArgs,
  GQLActionPresence,
  GQLCOMMENT_SORT,
  GQLTAG,
  GQLUSER_ROLE,
  QueryToCommentsArgs,
  StoryToCommentsArgs,
  UserToAllCommentsArgs,
  UserToCommentsArgs,
  UserToRejectedCommentsArgs,
} from "coral-server/graph/tenant/schema/__generated__/types";
import { retrieveManyUserActionPresence } from "coral-server/models/action/comment";
import {
  Comment,
  CommentConnectionInput,
  retrieveAllCommentsUserConnection,
  retrieveCommentConnection,
  retrieveCommentParentsConnection,
  retrieveCommentRepliesConnection,
  retrieveCommentStoryConnection,
  retrieveCommentUserConnection,
  retrieveManyComments,
  retrieveManyRecentStatusCounts,
  retrieveRejectedCommentUserConnection,
  retrieveStoryCommentTagCounts,
} from "coral-server/models/comment";
import { hasPublishedStatus } from "coral-server/models/comment/helpers";
import { Connection } from "coral-server/models/helpers";
import { retrieveSharedModerationQueueQueuesCounts } from "coral-server/models/story/counts/shared";
import { User } from "coral-server/models/user";

import { SingletonResolver } from "./util";

const tagFilter = (tag?: GQLTAG): CommentConnectionInput["filter"] => {
  if (tag) {
    return {
      "tags.type": tag,
    };
  }

  return {};
};

/**
 * primeCommentsFromConnection will prime a given context with the comments
 * retrieved via a connection.
 *
 * @param ctx graph context to use to prime the loaders.
 */
const primeCommentsFromConnection = (ctx: Context) => (
  connection: Readonly<Connection<Readonly<Comment>>>
) => {
  if (!ctx.disableCaching) {
    // For each of the nodes, prime the comment loader.
    connection.nodes.forEach(comment => {
      ctx.loaders.Comments.comment.prime(comment.id, comment);
    });
  }

  return connection;
};

/**
 * mapVisibleComment will provide a mapping function that will mark as null each
 * comment that should not be visible to the target User.
 *
 * @param user the User to determine the visibility status with based on
 * permissions
 */
const mapVisibleComment = (user?: Pick<User, "role">) => {
  // Check to see if this user is privileged and can view non-visible comments.
  const isPrivilegedUser = Boolean(
    user && [GQLUSER_ROLE.ADMIN, GQLUSER_ROLE.MODERATOR].includes(user.role)
  );

  // Return a function that will map out the non-visible comments if needed.
  return (comment: Readonly<Comment> | null) => {
    if (comment === null) {
      return null;
    }

    if (hasPublishedStatus(comment) || isPrivilegedUser) {
      return comment;
    }

    return null;
  };
};

/**
 * mapVisibleComments will map each comment an array to an array of Comment and
 * null.
 *
 * @param user the User to determine the visibility status with based on
 * permissions
 */
const mapVisibleComments = (user?: Pick<User, "role">) => (
  comments: Array<Readonly<Comment> | null>
): Array<Readonly<Comment> | null> => comments.map(mapVisibleComment(user));

export default (ctx: Context) => ({
  comment: new DataLoader<string, Readonly<Comment> | null>(
    (ids: string[]) =>
      retrieveManyComments(ctx.mongo, ctx.tenant.id, ids).then(
        mapVisibleComments(ctx.user)
      ),
    {
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cache: !ctx.disableCaching,
    }
  ),
  forFilter: ({
    first = 10,
    after,
    storyID,
    status,
    tag,
  }: QueryToCommentsArgs) =>
    retrieveCommentConnection(ctx.mongo, ctx.tenant.id, {
      first,
      after,
      orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
      filter: omitBy(
        {
          ...tagFilter(tag),
          storyID,
          status,
        },
        isNil
      ),
    }).then(primeCommentsFromConnection(ctx)),
  retrieveMyActionPresence: new DataLoader<string, GQLActionPresence>(
    (commentIDs: string[]) => {
      if (!ctx.user) {
        // This should only ever be accessed when a user is logged in. It should
        // be safe to get the user here, but we'll throw an error anyways just
        // in case.
        throw new Error("can't get action presence of an undefined user");
      }

      return retrieveManyUserActionPresence(
        ctx.mongo,
        ctx.tenant.id,
        ctx.user.id,
        commentIDs
      );
    }
  ),
  forUser: (
    userID: string,
    // Apply the graph schema defaults at the loader.
    {
      first = 10,
      orderBy = GQLCOMMENT_SORT.CREATED_AT_DESC,
      after,
    }: UserToCommentsArgs
  ) =>
    retrieveCommentUserConnection(ctx.mongo, ctx.tenant.id, userID, {
      first,
      orderBy,
      after,
    }).then(primeCommentsFromConnection(ctx)),
  forUserAll: (
    userID: string,
    // Apply the graph schema defaults at the loader.
    { first = 10, after }: UserToAllCommentsArgs
  ) =>
    retrieveAllCommentsUserConnection(ctx.mongo, ctx.tenant.id, userID, {
      first,
      orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
      after,
    }).then(primeCommentsFromConnection(ctx)),
  forUserRejected: (
    userID: string,
    // Apply the graph schema defaults at the loader.
    { first = 10, after }: UserToRejectedCommentsArgs
  ) =>
    retrieveRejectedCommentUserConnection(ctx.mongo, ctx.tenant.id, userID, {
      first,
      orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
      after,
    }).then(primeCommentsFromConnection(ctx)),
  taggedForStory: (
    storyID: string,
    tag: GQLTAG,
    // Apply the graph schema defaults at the loader.
    {
      first = 10,
      orderBy = GQLCOMMENT_SORT.CREATED_AT_DESC,
      after,
    }: StoryToCommentsArgs
  ) =>
    retrieveCommentStoryConnection(ctx.mongo, ctx.tenant.id, storyID, {
      first,
      orderBy,
      after,
      filter: {
        // Filter optionally for comments with a specific tag.
        "tags.type": tag,
      },
    }).then(primeCommentsFromConnection(ctx)),
  forStory: (
    storyID: string,
    // Apply the graph schema defaults at the loader.
    {
      first = 10,
      orderBy = GQLCOMMENT_SORT.CREATED_AT_DESC,
      after,
    }: StoryToCommentsArgs
  ) =>
    retrieveCommentStoryConnection(ctx.mongo, ctx.tenant.id, storyID, {
      first,
      orderBy,
      after,
      filter: {
        // Only get Comments that are top level. If the client wants to load
        // another layer, they can request another nested connection.
        parentID: null,
      },
    }).then(primeCommentsFromConnection(ctx)),
  forParent: (
    storyID: string,
    parentID: string,
    // Apply the graph schema defaults at the loader.
    {
      first = 10,
      orderBy = GQLCOMMENT_SORT.CREATED_AT_DESC,
      after,
    }: CommentToRepliesArgs
  ) =>
    retrieveCommentRepliesConnection(
      ctx.mongo,
      ctx.tenant.id,
      storyID,
      parentID,
      {
        first,
        orderBy,
        after,
      }
    ).then(primeCommentsFromConnection(ctx)),
  parents: (comment: Comment, { last = 1, before }: CommentToParentsArgs) =>
    retrieveCommentParentsConnection(ctx.mongo, ctx.tenant.id, comment, {
      last,
      // The cursor passed here is always going to be a number.
      before: before as number,
    }).then(primeCommentsFromConnection(ctx)),
  sharedModerationQueueQueuesCounts: new SingletonResolver(
    () =>
      retrieveSharedModerationQueueQueuesCounts(
        ctx.mongo,
        ctx.redis,
        ctx.tenant.id,
        ctx.now
      ),
    {
      // Disable caching for the DataLoader if the Context is designed to be
      // long lived.
      cacheable: !ctx.disableCaching,
    }
  ),
  tagCounts: new DataLoader((storyIDs: string[]) =>
    retrieveStoryCommentTagCounts(ctx.mongo, ctx.tenant.id, storyIDs)
  ),
  authorStatusCounts: new DataLoader((authorIDs: string[]) =>
    retrieveManyRecentStatusCounts(
      ctx.mongo,
      ctx.tenant.id,
      DateTime.fromJSDate(ctx.now)
        .plus({ seconds: -ctx.tenant.recentCommentHistory.timeFrame })
        .toJSDate(),
      authorIDs
    )
  ),
});
