import { GQLCommentEnteredPayloadResolvers } from "coral-server/graph/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentEnteredInput } from "./Subscription/commentEntered";

import GraphContext from "../context";

export const CommentEnteredPayload: GQLCommentEnteredPayloadResolvers<
  GraphContext,
  CommentEnteredInput
> = {
  comment: ({ commentID, storyID }, args, ctx, info) =>
    maybeLoadOnlyID(ctx, info, storyID, commentID),
};
