import { GQLCommentReleasedPayloadResolvers } from "coral-server/graph/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentReleasedInput } from "./Subscription/commentReleased";

import GraphContext from "../context";

export const CommentReleasedPayload: GQLCommentReleasedPayloadResolvers<
  GraphContext,
  CommentReleasedInput
> = {
  comment: ({ commentID, storyID }, args, ctx, info) =>
    maybeLoadOnlyID(ctx, info, storyID, commentID),
};
