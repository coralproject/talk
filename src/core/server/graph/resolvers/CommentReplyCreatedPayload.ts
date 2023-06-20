import { GQLCommentReplyCreatedPayloadResolvers } from "coral-server/graph/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentReplyCreatedInput } from "./Subscription/commentReplyCreated";

import GraphContext from "../context";

export const CommentReplyCreatedPayload: GQLCommentReplyCreatedPayloadResolvers<
  GraphContext,
  CommentReplyCreatedInput
> = {
  comment: ({ commentID, storyID }, args, ctx, info) =>
    maybeLoadOnlyID(ctx, info, storyID, commentID),
};
