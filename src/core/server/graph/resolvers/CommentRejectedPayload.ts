import { GQLCommentRejectedPayloadTypeResolver } from "coral-server/graph/schema/__generated__/types";
import { maybeLoadOnlyID } from "./Comment";
import { CommentRejectedInput } from "./Subscription/commentRejected";

export const CommentRejectedPayload: GQLCommentRejectedPayloadTypeResolver<CommentRejectedInput> = {
  comment: ({ commentID }, args, ctx, info) =>
    maybeLoadOnlyID(ctx, info, commentID, { filterNonVisible: false }),
};
