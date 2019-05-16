import Context from "coral-server/graph/tenant/context";
import {
  CommentActionConnectionInput,
  retrieveCommentActionConnection,
} from "coral-server/models/action/comment";

export default (ctx: Context) => ({
  connection: ({ first = 10, after, filter }: CommentActionConnectionInput) =>
    retrieveCommentActionConnection(ctx.mongo, ctx.tenant.id, {
      first,
      after,
      filter,
    }),
});
