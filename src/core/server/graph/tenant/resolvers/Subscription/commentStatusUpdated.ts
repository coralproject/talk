import {
  GQLCOMMENT_STATUS,
  SubscriptionToCommentStatusUpdatedResolver,
} from "coral-server/graph/tenant/schema/__generated__/types";

import { createIterator } from "./helpers";
import { SUBSCRIPTION_CHANNELS, SubscriptionPayload } from "./types";

export interface CommentStatusUpdatedInput extends SubscriptionPayload {
  newStatus: GQLCOMMENT_STATUS;
  oldStatus: GQLCOMMENT_STATUS;
  moderatorID: string | null;
  commentID: string;
}

export const commentStatusUpdated: SubscriptionToCommentStatusUpdatedResolver<
  CommentStatusUpdatedInput
> = createIterator(SUBSCRIPTION_CHANNELS.COMMENT_STATUS_UPDATED, {
  filter: (source, { id }) => {
    // If we're filtering by id, then only send back updates for the specified
    // comment.
    if (id && source.commentID !== id) {
      return false;
    }

    return true;
  },
  resolve: ({ newStatus, oldStatus, moderatorID, commentID }, args, ctx) => ({
    newStatus: () => newStatus,
    oldStatus: () => oldStatus,
    moderator: () => {
      if (moderatorID) {
        return ctx.loaders.Users.user.load(moderatorID);
      }

      return null;
    },
    comment: () => ctx.loaders.Comments.comment.load(commentID),
  }),
});
