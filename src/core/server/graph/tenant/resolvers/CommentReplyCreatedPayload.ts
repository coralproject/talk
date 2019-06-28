import { GQLCommentReplyCreatedPayloadTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentReplyCreatedInput } from "./Subscription/commentReplyCreated";

export const CommentReplyCreatedPayload: GQLCommentReplyCreatedPayloadTypeResolver<
  CommentReplyCreatedInput
> = {
  comment: ({ commentID }, args, ctx, info) =>
    maybeLoadOnlyID(ctx, info, commentID),
};
