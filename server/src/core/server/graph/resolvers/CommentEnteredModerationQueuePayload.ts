import { GQLCommentEnteredModerationQueuePayloadTypeResolver } from "coral-server/graph/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentEnteredModerationQueueInput } from "./Subscription/commentEnteredModerationQueue";

export const CommentEnteredModerationQueuePayload: GQLCommentEnteredModerationQueuePayloadTypeResolver<CommentEnteredModerationQueueInput> =
  {
    comment: ({ commentID, storyID }, args, ctx, info) =>
      maybeLoadOnlyID(ctx, info, storyID, commentID),
  };
