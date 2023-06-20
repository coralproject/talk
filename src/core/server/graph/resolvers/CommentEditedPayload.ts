import { GQLCommentEditedPayloadResolvers } from "coral-server/graph/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentEditedInput } from "./Subscription/commentEdited";

import GraphContext from "../context";

export const CommentEditedPayload: GQLCommentEditedPayloadResolvers<
  GraphContext,
  CommentEditedInput
> = {
  comment: ({ commentID, storyID }, args, ctx, info) =>
    maybeLoadOnlyID(ctx, info, storyID, commentID),
};
