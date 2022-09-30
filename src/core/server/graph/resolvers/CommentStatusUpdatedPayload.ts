import { GQLCommentStatusUpdatedPayloadTypeResolver } from "coral-server/graph/schema/__generated__/types";

import { maybeLoadOnlyID } from "./Comment";
import { CommentStatusUpdatedInput } from "./Subscription/commentStatusUpdated";

export const CommentStatusUpdatedPayload: GQLCommentStatusUpdatedPayloadTypeResolver<CommentStatusUpdatedInput> =
  {
    moderator: ({ moderatorID }, args, ctx) =>
      moderatorID ? ctx.loaders.Users.user.load(moderatorID) : null,
    comment: ({ commentID }, args, ctx, info) =>
      maybeLoadOnlyID(ctx, info, commentID),
  };
