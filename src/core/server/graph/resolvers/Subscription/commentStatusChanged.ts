import {
  GQLCOMMENT_STATUS,
  SubscriptionToCommentStatusChangedResolver,
} from "coral-server/graph/schema/__generated__/types";

import { createIterator } from "./helpers";
import {
  SUBSCRIPTION_CHANNELS,
  SubscriptionPayload,
  SubscriptionType,
} from "./types";

export interface CommentStatusChangedInput extends SubscriptionPayload {
  commentID: string;
  commentRevisionID: string;
  storyID: string;
  oldStatus: GQLCOMMENT_STATUS;
  newStatus: GQLCOMMENT_STATUS;
}

export type CommentStatusChangedSubscription = SubscriptionType<
  SUBSCRIPTION_CHANNELS.COMMENT_STATUS_CHANGED,
  CommentStatusChangedInput
>;

export const commentStatusChanged: SubscriptionToCommentStatusChangedResolver<CommentStatusChangedInput> = createIterator(
  SUBSCRIPTION_CHANNELS.COMMENT_STATUS_CHANGED,
  {
    filter: (source, { storyID }) => {
      if (storyID && source.storyID !== storyID) {
        return false;
      }

      return true;
    },
  }
);
