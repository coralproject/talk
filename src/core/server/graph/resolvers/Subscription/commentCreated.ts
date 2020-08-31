import { SubscriptionToCommentCreatedResolver } from "coral-server/graph/schema/__generated__/types";

import { createIterator } from "./helpers";
import {
  SUBSCRIPTION_CHANNELS,
  SubscriptionPayload,
  SubscriptionType,
} from "./types";

export interface CommentCreatedInput extends SubscriptionPayload {
  storyID: string;
  siteID: string;
  commentID: string;
}

export type CommentCreatedSubscription = SubscriptionType<
  SUBSCRIPTION_CHANNELS.COMMENT_CREATED,
  CommentCreatedInput
>;

export const commentCreated: SubscriptionToCommentCreatedResolver<CommentCreatedInput> = createIterator(
  SUBSCRIPTION_CHANNELS.COMMENT_CREATED,
  {
    filter: (source, { storyID }) => {
      if (source.storyID !== storyID) {
        return false;
      }

      return true;
    },
  }
);
