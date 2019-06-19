import {
  GQLCOMMENT_STATUS,
  SubscriptionToCommentStatusUpdatedResolver,
} from "coral-server/graph/tenant/schema/__generated__/types";

import { createIterator } from "./helpers";
import { SUBSCRIPTION_CHANNELS } from "./types";

export interface CommentStatusUpdatedInput {
  status: GQLCOMMENT_STATUS;
  commentID: string;
}

export const commentStatusUpdated: SubscriptionToCommentStatusUpdatedResolver<
  CommentStatusUpdatedInput
> = createIterator(SUBSCRIPTION_CHANNELS.COMMENT_STATUS_UPDATED, {
  filter: (source, {}) => {
    return true;
  },
  resolve: ({ status, commentID }, args, ctx) => ({
    status: () => status,
    comment: () => ctx.loaders.Comments.comment.load(commentID),
  }),
});
