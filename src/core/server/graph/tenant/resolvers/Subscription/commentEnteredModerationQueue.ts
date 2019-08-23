import {
  GQLMODERATION_QUEUE,
  SubscriptionToCommentEnteredModerationQueueResolver,
} from "coral-server/graph/tenant/schema/__generated__/types";

import { createIterator } from "./helpers";
import {
  SUBSCRIPTION_CHANNELS,
  SubscriptionPayload,
  SubscriptionType,
} from "./types";

export interface CommentEnteredModerationQueueInput
  extends SubscriptionPayload {
  queue: GQLMODERATION_QUEUE;
  commentID: string;
  storyID: string;
}

export type CommentEnteredModerationQueueSubscription = SubscriptionType<
  SUBSCRIPTION_CHANNELS.COMMENT_ENTERED_MODERATION_QUEUE,
  CommentEnteredModerationQueueInput
>;

export const commentEnteredModerationQueue: SubscriptionToCommentEnteredModerationQueueResolver<
  CommentEnteredModerationQueueInput
> = createIterator(SUBSCRIPTION_CHANNELS.COMMENT_ENTERED_MODERATION_QUEUE, {
  filter: (source, { storyID, queue }) => {
    // If we're filtering by storyID, then only send back comments with the
    // specific storyID.
    if (storyID && source.storyID !== storyID) {
      return false;
    }

    // If we're filtering by queue, then only send back comments from the
    // specific queue.
    if (queue && source.queue !== queue) {
      return false;
    }

    return true;
  },
});
