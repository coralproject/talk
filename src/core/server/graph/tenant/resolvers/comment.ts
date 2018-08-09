import { GQLCommentTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
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
};

export default Comment;
