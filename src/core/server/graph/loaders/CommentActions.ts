import { defaultTo } from "lodash";

import Context from "coral-server/graph/context";
import {
  CommentActionConnectionInput,
  retrieveCommentActionConnection,
} from "coral-server/models/action/comment";

import { GQLCOMMENT_SORT } from "../schema/__generated__/types";

export default (ctx: Context) => ({
  connection: ({
    first,
    after,
    orderBy,
    filter,
  }: CommentActionConnectionInput) =>
    retrieveCommentActionConnection(ctx.mongo, ctx.tenant.id, {
      first: defaultTo(first, 10),
      after,
      filter,
      orderBy: defaultTo(orderBy, GQLCOMMENT_SORT.CREATED_AT_DESC),
    }),
});
