import { getRequestedFields } from "talk-server/graph/tenant/resolvers/util";
import {
  GQLComment,
  GQLCommentTypeResolver,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { Comment } from "talk-server/models/comment";

const Comment: GQLCommentTypeResolver<Comment> = {
  editing: (comment, input, ctx) => ({
    // When there is more than one body history, then the comment has been
    // edited.
    edited: comment.body_history.length > 1,
    // The date that the comment is editable until is the tenant's edit window
    // length added to the comment created date.
    editableUntil: new Date(
      comment.created_at.valueOf() + ctx.tenant.editCommentWindowLength
    ),
  }),
  createdAt: comment => comment.created_at,
  author: (comment, input, ctx) =>
    ctx.loaders.Users.user.load(comment.author_id),
  replies: (comment, input, ctx) =>
    ctx.loaders.Comments.forParent(comment.asset_id, comment.id, input),
  parentCount: comment =>
    comment.parent_id ? comment.grandparent_ids.length + 1 : 0,
  replyCount: comment => comment.child_ids.length,
  parent: (comment, input, ctx, info) => {
    // If there isn't a parent, then return nothing!
    if (!comment.parent_id) {
      return null;
    }

    // Get the field names of the fields being requested, if it's only the ID,
    // we have that, so no need to make a database request.
    const fields = getRequestedFields<GQLComment>(info);
    if (fields.length === 1 && fields[0] === "id") {
      return {
        id: comment.parent_id,
      };
    }

    // We want more than the ID! Get the comment!
    // TODO: (wyattjoh) if the parent and the parents (containing the parent) are requested, the parent comment is retrieved from the database twice. Investigate ways of reducing i/o.
    return ctx.loaders.Comments.comment.load(comment.parent_id);
  },
  parents: (comment, input, ctx) =>
    ctx.loaders.Comments.parents(comment, input),
};

export default Comment;
