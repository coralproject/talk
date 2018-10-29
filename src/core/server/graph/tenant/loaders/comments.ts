import DataLoader from "dataloader";

import Context from "talk-server/graph/tenant/context";
import {
  CommentToParentsArgs,
  CommentToRepliesArgs,
  GQLActionPresence,
  GQLCOMMENT_SORT,
  StoryToCommentsArgs,
} from "talk-server/graph/tenant/schema/__generated__/types";
import {
  ACTION_ITEM_TYPE,
  retrieveManyUserActionPresence,
} from "talk-server/models/action";
import {
  Comment,
  retrieveCommentParentsConnection,
  retrieveCommentRepliesConnection,
  retrieveCommentStoryConnection,
  retrieveCommentUserConnection,
  retrieveManyComments,
} from "talk-server/models/comment";
import { Connection } from "talk-server/models/connection";

/**
 * primeCommentsFromConnection will prime a given context with the comments
 * retrieved via a connection.
 *
 * @param ctx graph context to use to prime the loaders.
 */
const primeCommentsFromConnection = (ctx: Context) => (
  connection: Readonly<Connection<Readonly<Comment>>>
) => {
  // For each of the edges, prime the comment loader.
  connection.edges.forEach(({ node }) => {
    ctx.loaders.Comments.comment.prime(node.id, node);
  });

  return connection;
};

export default (ctx: Context) => ({
  comment: new DataLoader((ids: string[]) =>
    retrieveManyComments(ctx.mongo, ctx.tenant.id, ids)
  ),
  retrieveMyActionPresence: new DataLoader<string, GQLActionPresence>(
    (itemIDs: string[]) =>
      retrieveManyUserActionPresence(
        ctx.mongo,
        ctx.tenant.id,
        // This should only ever be accessed when a user is logged in.
        ctx.user!.id,
        ACTION_ITEM_TYPE.COMMENTS,
        itemIDs
      )
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
    }),
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
});
