import { GQLCommentCreatedPayloadResolvers } from "coral-server/graph/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentCreatedInput } from "./Subscription/commentCreated";

import GraphContext from "../context";

export const CommentCreatedPayload: GQLCommentCreatedPayloadResolvers<
  GraphContext,
  CommentCreatedInput
> = {
  comment: ({ commentID, storyID }, args, ctx, info) =>
    maybeLoadOnlyID(ctx, info, storyID, commentID),
};
