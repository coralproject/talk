import { CacheScope } from "apollo-cache-control";
import { GraphQLResolveInfo } from "graphql";
import { defaultTo } from "lodash";

import { setCacheHint } from "coral-common/graphql";
import { StoryNotFoundError } from "coral-server/errors";
import { getRequestedFields } from "coral-server/graph/resolvers/util";
import {
  ACTION_TYPE,
  decodeActionCounts,
} from "coral-server/models/action/comment";
import * as comment from "coral-server/models/comment";
import {
  getDepth,
  getLatestRevision,
  hasAncestors,
  hasPublishedStatus,
} from "coral-server/models/comment/helpers";
import { createConnection } from "coral-server/models/helpers";
import { getURLWithCommentID } from "coral-server/models/story";
import { canModerate } from "coral-server/models/user/helpers";
import {
  getCommentEditableUntilDate,
  hasRejectedAncestors,
} from "coral-server/services/comments";

import {
  GQLComment,
  GQLCOMMENT_SORT,
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
  return ctx.loaders.Comments.visible.load(id);
};

export const Comment: GQLCommentTypeResolver<comment.Comment> = {
  body: (c) => (c.revisions.length > 0 ? getLatestRevision(c).body : null),
  // Send the whole comment back when you request revisions. This way, we get to
  // know the comment ID. The field mapping is handled by the CommentRevision
  // resolver.
  revision: (c) =>
    c.revisions.length > 0
      ? { revision: getLatestRevision(c), comment: c }
      : null,
  canModerate: (c, input, ctx) => {
    if (!ctx.user) {
      return false;
    }

    return canModerate(ctx.user, { siteID: c.siteID });
  },
  canReply: async (c, input, ctx) => {
    const story = await ctx.loaders.Stories.find.load({ id: c.storyID });
    if (!story || story.isArchived || story.isArchiving) {
      return false;
    }

    const rejectedAncestors = await hasRejectedAncestors(
      ctx.mongo,
      ctx.tenant.id,
      c.id,
      story.isArchived || story.isArchiving
    );

    return !rejectedAncestors;
  },
  deleted: ({ deletedAt }) => !!deletedAt,
  revisionHistory: (c) =>
    c.revisions.map((revision) => ({ revision, comment: c })),
  editing: ({ authorID, revisions, createdAt }, input, ctx) => ({
    // When there is more than one body history, then the comment has been
    // edited.
    edited: revisions.length > 1,
    // The date that the comment is editable until is the tenant's edit window
    // length added to the comment created date. This will return null if the
    // current user is not the author.
    editableUntil:
      authorID === ctx.user?.id
        ? getCommentEditableUntilDate(ctx.tenant, createdAt)
        : null,
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

    const children = await ctx.loaders.Comments.visible.loadMany(childIDs);
    return children.reduce(
      (sum: number, c: any) => (c && hasPublishedStatus(c) ? sum + 1 : sum),
      0
    );
  },
  // Action Counts are encoded, decode them for use with the GraphQL system.
  actionCounts: (c) => decodeActionCounts(c.actionCounts),
  reactions: ({ id }, { first, after }, ctx) =>
    ctx.loaders.CommentActions.connection({
      first: defaultTo(first, 10),
      after,
      orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
      filter: {
        actionType: ACTION_TYPE.REACTION,
        commentID: id,
      },
    }),
  flags: ({ id }, { first, after }, ctx) =>
    ctx.loaders.CommentActions.connection({
      first: defaultTo(first, 10),
      after,
      orderBy: GQLCOMMENT_SORT.CREATED_AT_DESC,
      filter: {
        actionType: ACTION_TYPE.FLAG,
        commentID: id,
      },
    }),
  viewerActionPresence: (c, input, ctx, info) => {
    if (!ctx.user) {
      return null;
    }

    setCacheHint(info, { scope: CacheScope.Private });

    return ctx.loaders.Comments.retrieveMyActionPresence.load(c.id);
  },

  parentCount: (c) => getDepth(c),
  depth: (c) => getDepth(c),
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
  allChildComments: (c, input, ctx) =>
    ctx.loaders.Comments.allChildComments(c, input),
  story: (c, input, ctx) => ctx.loaders.Stories.story.load(c.storyID),
  site: (c, input, ctx) => ctx.loaders.Sites.site.load(c.siteID),
  permalink: async ({ id, storyID }, input, ctx) => {
    const story = await ctx.loaders.Stories.story.load(storyID);
    if (!story) {
      throw new StoryNotFoundError(storyID);
    }
    return getURLWithCommentID(story.url, id);
  },
  seen: async ({ storyID, authorID, id }, input, ctx) => {
    if (!ctx.user) {
      return false;
    }

    if (authorID === ctx.user.id) {
      return true;
    }

    const seenComments = await ctx.loaders.SeenComments.find.load({
      storyID,
      userID: ctx.user.id,
    });

    // Check if we had previously seen this comment
    const seen = seenComments ? id in seenComments.comments : false;
    return seen;
  },
};
