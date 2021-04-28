import { SubscriptionToCommentRejectedResolver } from "coral-server/graph/schema/__generated__/types";

import { createIterator } from "./helpers";
import {
  SUBSCRIPTION_CHANNELS,
  SubscriptionPayload,
  SubscriptionType,
} from "./types";

export interface CommentRejectedInput extends SubscriptionPayload {
  commentID: string;
  commentRevisionID: string;
  storyID: string;
}

export type CommentRejectedSubscription = SubscriptionType<
  SUBSCRIPTION_CHANNELS.COMMENT_REJECTED,
  CommentRejectedInput
>;

export const commentRejected: SubscriptionToCommentRejectedResolver<CommentRejectedInput> = createIterator(
  SUBSCRIPTION_CHANNELS.COMMENT_REJECTED,
  {
    filter: (source, { storyID }) => {
      if (storyID && source.storyID !== storyID) {
        return false;
      }

      return true;
    },
  }
);
