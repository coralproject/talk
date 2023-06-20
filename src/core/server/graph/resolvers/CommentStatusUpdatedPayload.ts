import { GQLCommentStatusUpdatedPayloadResolvers } from "coral-server/graph/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentStatusUpdatedInput } from "./Subscription/commentStatusUpdated";

import GraphContext from "../context";

export const CommentStatusUpdatedPayload: GQLCommentStatusUpdatedPayloadResolvers<
  GraphContext,
  CommentStatusUpdatedInput
> = {
  moderator: ({ moderatorID }, args, ctx) =>
    moderatorID ? ctx.loaders.Users.user.load(moderatorID) : null,
  comment: ({ commentID, storyID }, args, ctx, info) =>
    maybeLoadOnlyID(ctx, info, storyID, commentID),
};
