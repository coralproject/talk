import { GraphQLResolveInfo } from "graphql";
import { defaultTo } from "lodash";

import { StoryNotFoundError } from "coral-server/errors";
import { getRequestedFields } from "coral-server/graph/resolvers/util";
import {
  ACTION_TYPE,
  decodeActionCounts,
} from "coral-server/models/action/comment";
import * as comment from "coral-server/models/comment";
import {
  getLatestRevision,
  hasAncestors,
  hasPublishedStatus,
} from "coral-server/models/comment/helpers";
import { createConnection } from "coral-server/models/helpers";
import { getURLWithCommentID } from "coral-server/models/story";
import { getCommentEditableUntilDate } from "coral-server/services/comments";

import {
  GQLComment,
  GQLCommentTypeResolver,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "../context";

export const maybeLoadOnlyID = (
  ctx: GraphContext,
  info: GraphQLResolveInfo,
  id: string
) => {
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
  body: c => (c.revisions.length > 0 ? getLatestRevision(c).body : null),
  // Send the whole comment back when you request revisions. This way, we get to
  // know the comment ID. The field mapping is handled by the CommentRevision
  // resolver.
  revision: c =>
    c.revisions.length > 0
      ? { revision: getLatestRevision(c), comment: c }
      : null,
  revisionHistory: c => c.revisions.map(revision => ({ revision, comment: c })),
  editing: ({ revisions, createdAt }, input, ctx) => ({
    // When there is more than one body history, then the comment has been
    // edited.
    edited: revisions.length > 1,
    // The date that the comment is editable until is the tenant's edit window
    // length added to the comment created date.
    editableUntil: getCommentEditableUntilDate(ctx.tenant, createdAt),
  }),
  author: (c, input, ctx) =>
    c.authorID ? ctx.loaders.Users.user.load(c.authorID) : null,
  statusHistory: ({ id }, input, ctx) =>
    ctx.loaders.CommentModerationActions.forComment(input, id),
  replies: (c, input, ctx) =>
    // If there is at least one reply, then use the connection loader, otherwise
    // return a blank connection.
    c.childCount > 0
      ? ctx.loaders.Comments.forParent(c.storyID, c.id, input)
      : createConnection(),
  replyCount: async ({ childIDs }, input, ctx) => {
    // TODO: (wyattjoh) the childCount should be used eventually, but it should be managed with the status so it's only a count of published comments
    if (childIDs.length === 0) {
      return 0;
    }

    const children = await ctx.loaders.Comments.comment.loadMany(childIDs);
    return children.reduce(
      (sum: any, c: any) => (c && hasPublishedStatus(c) ? sum + 1 : sum),
      0
    );
  },
  // Action Counts are encoded, decode them for use with the GraphQL system.
  actionCounts: c => decodeActionCounts(c.actionCounts),
  flags: ({ id }, { first, after }, ctx) =>
    ctx.loaders.CommentActions.connection({
      first: defaultTo(first, 10),
      after,
      filter: {
        actionType: ACTION_TYPE.FLAG,
        commentID: id,
      },
    }),
  viewerActionPresence: (c, input, ctx) =>
    ctx.user ? ctx.loaders.Comments.retrieveMyActionPresence.load(c.id) : null,
  parentCount: c => (hasAncestors(c) ? c.ancestorIDs.length : 0),
  depth: c => (hasAncestors(c) ? c.ancestorIDs.length : 0),
  rootParent: (c, input, ctx, info) =>
    hasAncestors(c)
      ? maybeLoadOnlyID(ctx, info, c.ancestorIDs[c.ancestorIDs.length - 1])
      : null,
  parent: (c, input, ctx, info) =>
    hasAncestors(c) ? maybeLoadOnlyID(ctx, info, c.parentID) : null,
  parents: (c, input, ctx) =>
    // Some resolver optimization.
    hasAncestors(c)
      ? ctx.loaders.Comments.parents(c, input)
      : createConnection(),
  story: (c, input, ctx) => ctx.loaders.Stories.story.load(c.storyID),
  site: (c, input, ctx) => ctx.loaders.Sites.site.load(c.siteID),
  permalink: async ({ id, storyID }, input, ctx) => {
    const story = await ctx.loaders.Stories.story.load(storyID);
    if (!story) {
      throw new StoryNotFoundError(storyID);
    }
    return getURLWithCommentID(story.url, id);
  },
};
