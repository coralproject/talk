import { getRequestedFields } from "talk-server/graph/tenant/resolvers/util";
import {
  GQLComment,
  GQLCommentTypeResolver,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { decodeActionCounts } from "talk-server/models/action";
import * as comment from "talk-server/models/comment";
import { createConnection } from "talk-server/models/connection";

export const Comment: GQLCommentTypeResolver<comment.Comment> = {
  editing: (c, input, ctx) => ({
    // When there is more than one body history, then the comment has been
    // edited.
    edited: c.body_history.length > 1,
    // The date that the comment is editable until is the tenant's edit window
    // length added to the comment created date.
    editableUntil: new Date(
      c.created_at.valueOf() + ctx.tenant.editCommentWindowLength
    ),
  }),
  createdAt: c => c.created_at,
  author: (c, input, ctx) => ctx.loaders.Users.user.load(c.author_id),
  replies: (c, input, ctx) =>
    c.reply_count > 0
      ? ctx.loaders.Comments.forParent(c.story_id, c.id, input)
      : createConnection(),
  actionCounts: c => decodeActionCounts(c.action_counts),
  myActionPresence: (c, input, ctx) =>
    ctx.user ? ctx.loaders.Comments.retrieveMyActionPresence.load(c.id) : null,
  parentCount: c => (c.parent_id ? c.grandparent_ids.length + 1 : 0),
  depth: c => (c.parent_id ? c.grandparent_ids.length + 1 : 0),
  replyCount: c => c.reply_count,
  rootParent: (c, input, ctx, info) => {
    // If there isn't a parent, then return nothing!
    if (!c.parent_id) {
      return null;
    }

    // rootParentID is the root parent id for a given comment.
    const rootParentID =
      c.grandparent_ids.length > 0 ? c.grandparent_ids[0] : c.parent_id;

    // Get the field names of the fields being requested, if it's only the ID,
    // we have that, so no need to make a database request.
    const fields = getRequestedFields<GQLComment>(info);
    if (fields.length === 1 && fields[0] === "id") {
      return {
        id: rootParentID,
      };
    }

    // We want more than the ID! Get the comment!
    // TODO: (wyattjoh) if the parent and the parents (containing the parent) are requested, the parent comment is retrieved from the database twice. Investigate ways of reducing i/o.
    return ctx.loaders.Comments.comment.load(rootParentID);
  },
  parent: (c, input, ctx, info) => {
    // If there isn't a parent, then return nothing!
    if (!c.parent_id) {
      return null;
    }

    // Get the field names of the fields being requested, if it's only the ID,
    // we have that, so no need to make a database request.
    const fields = getRequestedFields<GQLComment>(info);
    if (fields.length === 1 && fields[0] === "id") {
      return {
        id: c.parent_id,
      };
    }

    // We want more than the ID! Get the comment!
    // TODO: (wyattjoh) if the parent and the parents (containing the parent) are requested, the parent comment is retrieved from the database twice. Investigate ways of reducing i/o.
    return ctx.loaders.Comments.comment.load(c.parent_id);
  },
  parents: (c, input, ctx) =>
    // Some resolver optimization.
    c.parent_id ? ctx.loaders.Comments.parents(c, input) : createConnection(),
  story: (c, input, ctx) => ctx.loaders.Stories.story.load(c.story_id),
};
