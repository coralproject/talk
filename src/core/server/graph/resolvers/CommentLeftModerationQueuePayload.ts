import { GQLCommentLeftModerationQueuePayloadTypeResolver } from "coral-server/graph/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentLeftModerationQueueInput } from "./Subscription/commentLeftModerationQueue";

export const CommentLeftModerationQueuePayload: GQLCommentLeftModerationQueuePayloadTypeResolver<CommentLeftModerationQueueInput> =
  {
    comment: ({ commentID }, args, ctx, info) =>
      maybeLoadOnlyID(ctx, info, commentID),
  };
