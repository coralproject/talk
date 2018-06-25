import Context from "talk-server/graph/tenant/context";
import { Comment, ConnectionInput } from "talk-server/models/comment";

export default {
  author: async (comment: Comment, _: any, ctx: Context) =>
    ctx.loaders.Users.user.load(comment.author_id),
  replies: async (comment: Comment, input: ConnectionInput, ctx: Context) =>
    ctx.loaders.Comments.forParent(comment.asset_id, comment.id, input),
};
