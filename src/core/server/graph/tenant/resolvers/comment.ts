import { GQLCommentTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { Comment } from "talk-server/models/comment";

const Comment: GQLCommentTypeResolver<Comment> = {
  createdAt: comment => comment.created_at,
  author: (comment, input, ctx) =>
    ctx.loaders.Users.user.load(comment.author_id),
  replies: (comment, input, ctx) =>
    ctx.loaders.Comments.forParent(comment.asset_id, comment.id, input),
};

export default Comment;
