import { defaultTo } from "lodash";

import Context from "coral-server/graph/context";
import {
  CommentActionConnectionInput,
  retrieveCommentActionConnection,
} from "coral-server/models/action/comment";

export default (ctx: Context) => ({
  connection: ({ first, after, filter }: CommentActionConnectionInput) =>
    retrieveCommentActionConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 10),
      after,
      filter,
    }),
});
