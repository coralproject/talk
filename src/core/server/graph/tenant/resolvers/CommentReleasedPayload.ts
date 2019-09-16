import { GQLCommentReleasedPayloadTypeResolver } from "coral-server/graph/tenant/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentReleasedInput } from "./Subscription/commentReleased";

export const CommentReleasedPayload: GQLCommentReleasedPayloadTypeResolver<
  CommentReleasedInput
> = {
  comment: ({ commentID }, args, ctx, info) =>
    maybeLoadOnlyID(ctx, info, commentID),
};
