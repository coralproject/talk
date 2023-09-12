import { SubscriptionToCommentReleasedResolver } from "coral-server/graph/schema/__generated__/types";

import { createIterator } from "./helpers";
import {
  SUBSCRIPTION_CHANNELS,
  SubscriptionPayload,
  SubscriptionType,
} from "./types";

export interface CommentReleasedInput extends SubscriptionPayload {
  storyID: string;
  commentID: string;
}

export type CommentReleasedSubscription = SubscriptionType<
  SUBSCRIPTION_CHANNELS.COMMENT_RELEASED,
  CommentReleasedInput
>;

export const commentReleased: SubscriptionToCommentReleasedResolver<CommentReleasedInput> =
  createIterator(SUBSCRIPTION_CHANNELS.COMMENT_RELEASED, {
    filter: (source, { storyID }) => {
      if (source.storyID !== storyID) {
        return false;
      }

      return true;
    },
  });
