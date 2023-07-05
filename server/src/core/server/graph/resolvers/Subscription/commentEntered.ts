import { SubscriptionToCommentEnteredResolver } from "coral-server/graph/schema/__generated__/types";

import { createIterator } from "./helpers";
import {
  SUBSCRIPTION_CHANNELS,
  SubscriptionPayload,
  SubscriptionType,
} from "./types";

export interface CommentEnteredInput extends SubscriptionPayload {
  commentID: string;
  storyID: string;
  ancestorIDs?: string[];
}

export type CommentEnteredSubscription = SubscriptionType<
  SUBSCRIPTION_CHANNELS.COMMENT_ENTERED,
  CommentEnteredInput
>;

export const commentEntered: SubscriptionToCommentEnteredResolver<CommentEnteredInput> =
  createIterator(SUBSCRIPTION_CHANNELS.COMMENT_ENTERED, {
    filter: (source: CommentEnteredInput, { storyID, ancestorID }) => {
      if (source.storyID !== storyID) {
        return false;
      }
      if (
        ancestorID &&
        (!source.ancestorIDs || !source.ancestorIDs.includes(ancestorID))
      ) {
        return false;
      }
      return true;
    },
  });
