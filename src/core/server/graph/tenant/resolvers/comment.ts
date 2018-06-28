import { GQLCommentTypeResolver } from "talk-server/graph/tenant/schema/__generated__/types";
import { Comment } from "talk-server/models/comment";

const Comment: GQLCommentTypeResolver<Comment> = {
  author: async (comment, args, ctx) =>
    ctx.loaders.Users.user.load(comment.author_id),
  replies: async (comment, input, ctx) =>
    ctx.loaders.Comments.forParent(comment.asset_id, comment.id, input),
};

export default Comment;
