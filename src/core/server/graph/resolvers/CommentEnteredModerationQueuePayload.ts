import { GQLCommentEnteredModerationQueuePayloadResolvers } from "coral-server/graph/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentEnteredModerationQueueInput } from "./Subscription/commentEnteredModerationQueue";

import GraphContext from "../context";

export const CommentEnteredModerationQueuePayload: GQLCommentEnteredModerationQueuePayloadResolvers<
  GraphContext,
  CommentEnteredModerationQueueInput
> = {
  comment: ({ commentID, storyID }, args, ctx, info) =>
    maybeLoadOnlyID(ctx, info, storyID, commentID),
};
