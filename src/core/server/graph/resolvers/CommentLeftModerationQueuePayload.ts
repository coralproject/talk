import { GQLCommentLeftModerationQueuePayloadResolvers } from "coral-server/graph/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentLeftModerationQueueInput } from "./Subscription/commentLeftModerationQueue";

import GraphContext from "../context";

export const CommentLeftModerationQueuePayload: GQLCommentLeftModerationQueuePayloadResolvers<
  GraphContext,
  CommentLeftModerationQueueInput
> = {
  comment: ({ commentID, storyID }, args, ctx, info) =>
    maybeLoadOnlyID(ctx, info, storyID, commentID),
};
