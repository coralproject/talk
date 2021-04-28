import { GQLCommentRejectedPayloadTypeResolver } from "coral-server/graph/schema/__generated__/types";
import { CommentRejectedInput } from "./Subscription/commentRejected";

export const CommentRejectedPayload: GQLCommentRejectedPayloadTypeResolver<CommentRejectedInput> = {
  commentID: ({ commentID }, args, ctx, info) => commentID,
};
