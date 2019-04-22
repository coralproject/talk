import DataLoader from "dataloader";
import { isNil, omitBy } from "lodash";

import Context from "talk-server/graph/tenant/context";
import {
  CommentToParentsArgs,
  CommentToRepliesArgs,
  GQLActionPresence,
  GQLCOMMENT_SORT,
  QueryToCommentsArgs,
  StoryToCommentsArgs,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { retrieveManyUserActionPresence } from "talk-server/models/action/comment";
import {
  Comment,
  retrieveCommentConnection,
  retrieveCommentParentsConnection,
  retrieveCommentRepliesConnection,
  retrieveCommentStoryConnection,
  retrieveCommentUserConnection,
  retrieveManyComments,
} from "talk-server/models/comment";
import { Connection } from "talk-server/models/helpers/connection";
import { retrieveSharedModerationQueueQueuesCounts } from "talk-server/models/story/counts/shared";

import { SingletonResolver } from "./util";

/**
 * primeCommentsFromConnection will prime a given context with the comments
 * retrieved via a connection.
 *
 * @param ctx graph context to use to prime the loaders.
 */
const primeCommentsFromConnection = (ctx: Context) => (
  connection: Readonly<Connection<Readonly<Comment>>>
) => {
  // For each of the nodes, prime the comment loader.
  connection.nodes.forEach(comment => {
    ctx.loaders.Comments.comment.prime(comment.id, comment);
  });

  return connection;
};

export default (ctx: Context) => ({
  comment: new DataLoader((ids: string[]) =>
    retrieveManyComments(ctx.mongo, ctx.tenant.id, ids)
  ),
  forFilter: ({ first = 10, after, storyID, status }: QueryToCommentsArgs) =>
    retrieveCommentConnection(ctx.mongo, ctx.tenant.id, {
      first,
      after,
      orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
      filter: omitBy(
        {
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
        throw new Error("can't get action presense of an undefined user");
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
    }: StoryToCommentsArgs
  ) =>
    retrieveCommentUserConnection(ctx.mongo, ctx.tenant.id, userID, {
      first,
      orderBy,
      after,
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
  sharedModerationQueueQueuesCounts: new SingletonResolver(() =>
    retrieveSharedModerationQueueQueuesCounts(
      ctx.mongo,
      ctx.redis,
      ctx.tenant.id,
      ctx.now
    )
  ),
});
