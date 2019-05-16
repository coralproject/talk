import { GraphQLResolveInfo } from "graphql";

import { getRequestedFields } from "coral-server/graph/tenant/resolvers/util";
import {
  GQLComment,
  GQLCommentTypeResolver,
} from "coral-server/graph/tenant/schema/__generated__/types";
import {
  ACTION_TYPE,
  decodeActionCounts,
} from "coral-server/models/action/comment";
import * as comment from "coral-server/models/comment";
import { getLatestRevision } from "coral-server/models/comment";
import { createConnection } from "coral-server/models/helpers/connection";
import { getCommentEditableUntilDate } from "coral-server/services/comments";

import TenantContext from "../context";
import { getURLWithCommentID } from "./util";

const maybeLoadOnlyID = (
  ctx: TenantContext,
  info: GraphQLResolveInfo,
  id?: string
) => {
  // If there isn't an id, then return nothing!
  if (!id) {
    return null;
  }

  // Get the field names of the fields being requested, if it's only the ID,
  // we have that, so no need to make a database request.
  const fields = getRequestedFields<GQLComment>(info);
  if (fields.length === 1 && fields[0] === "id") {
    return {
      id,
    };
  }

  // We want more than the ID! Get the comment!
  // TODO: (wyattjoh) if the parent and the parents (containing the parent) are requested, the parent comment is retrieved from the database twice. Investigate ways of reducing i/o.
  return ctx.loaders.Comments.comment.load(id);
};

export const Comment: GQLCommentTypeResolver<comment.Comment> = {
  body: c => getLatestRevision(c).body,
  // Send the whole comment back when you request revisions. This way, we get to
  // know the comment ID. The field mapping is handled by the CommentRevision
  // resolver.
  revision: c => ({ revision: getLatestRevision(c), comment: c }),
  revisionHistory: c => c.revisions.map(revision => ({ revision, comment: c })),
  editing: ({ revisions, createdAt }, input, ctx) => ({
    // When there is more than one body history, then the comment has been
    // edited.
    edited: revisions.length > 1,
    // The date that the comment is editable until is the tenant's edit window
    // length added to the comment created date.
    editableUntil: getCommentEditableUntilDate(ctx.tenant, createdAt),
  }),
  author: (c, input, ctx) => ctx.loaders.Users.user.load(c.authorID),
  statusHistory: ({ id }, input, ctx) =>
    ctx.loaders.CommentModerationActions.forComment(input, id),
  replies: (c, input, ctx) =>
    // If there is at least one reply, then use the connection loader, otherwise
    // return a blank connection.
    c.replyCount > 0
      ? ctx.loaders.Comments.forParent(c.storyID, c.id, input)
      : createConnection(),
  // Action Counts are encoded, decode them for use with the GraphQL system.
  actionCounts: c => decodeActionCounts(c.actionCounts),
  flags: ({ id }, { first = 10, after }, ctx) =>
    ctx.loaders.CommentActions.connection({
      first,
      after,
      filter: {
        actionType: ACTION_TYPE.FLAG,
        commentID: id,
      },
    }),
  viewerActionPresence: (c, input, ctx) =>
    ctx.user ? ctx.loaders.Comments.retrieveMyActionPresence.load(c.id) : null,
  parentCount: c => (c.parentID ? c.grandparentIDs.length + 1 : 0),
  depth: c => (c.parentID ? c.grandparentIDs.length + 1 : 0),
  rootParent: (c, input, ctx, info) =>
    maybeLoadOnlyID(
      ctx,
      info,
      c.grandparentIDs.length > 0 ? c.grandparentIDs[0] : c.parentID
    ),
  parent: (c, input, ctx, info) => maybeLoadOnlyID(ctx, info, c.parentID),
  parents: (c, input, ctx) =>
    // Some resolver optimization.
    c.parentID ? ctx.loaders.Comments.parents(c, input) : createConnection(),
  story: (c, input, ctx) => ctx.loaders.Stories.story.load(c.storyID),
  permalink: async (c, input, ctx) => {
    const story = await ctx.loaders.Stories.story.load(c.storyID);
    if (!story) {
      // TODO: better error reporting?
      throw new Error("Story not found");
    }
    return getURLWithCommentID(story.url, c.id);
  },
};
