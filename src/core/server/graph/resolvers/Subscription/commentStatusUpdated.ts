import {
  GQLCOMMENT_STATUS,
  GQLCommentStatusUpdatedPayload,
  GQLSubscription,
  GQLSubscriptionGQLcommentStatusUpdatedArgs,
  Resolver,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "coral-server/graph/context";
import { createIterator } from "./helpers";
import {
  SUBSCRIPTION_CHANNELS,
  SubscriptionPayload,
  SubscriptionType,
} from "./types";

export interface CommentStatusUpdatedInput extends SubscriptionPayload {
  newStatus: GQLCOMMENT_STATUS;
  oldStatus: GQLCOMMENT_STATUS;
  moderatorID: string | null;
  commentID: string;
  commentRevisionID: string;
  storyID: string;
}

export type CommentStatusUpdatedSubscription = SubscriptionType<
  SUBSCRIPTION_CHANNELS.COMMENT_STATUS_UPDATED,
  CommentStatusUpdatedInput
>;

export const commentStatusUpdated: Resolver<
  GQLCommentStatusUpdatedPayload,
  GQLSubscription,
  GraphContext,
  GQLSubscriptionGQLcommentStatusUpdatedArgs
> = createIterator(SUBSCRIPTION_CHANNELS.COMMENT_STATUS_UPDATED, {
  filter: (source, { id }) => {
    // If we're filtering by id, then only send back updates for the specified
    // comment.
    if (id && source.commentID !== id) {
      return false;
    }

    return true;
  },
});
