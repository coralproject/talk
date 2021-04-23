import { GQLCommentStatusChangedPayloadTypeResolver } from "coral-server/graph/schema/__generated__/types";
import { CommentStatusChangedInput } from "./Subscription/commentStatusChanged";

export const CommentStatusChangedPayload: GQLCommentStatusChangedPayloadTypeResolver<CommentStatusChangedInput> = {
  commentID: ({ commentID }, args, ctx, info) => commentID,
};
