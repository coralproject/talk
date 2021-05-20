import { SubscriptionToCommentEditedResolver } from "coral-server/graph/schema/__generated__/types";

import { createIterator } from "./helpers";
import {
  SUBSCRIPTION_CHANNELS,
  SubscriptionPayload,
  SubscriptionType,
} from "./types";

export interface CommentEditedInput extends SubscriptionPayload {
  commentID: string;
  storyID: string;
}

export type CommentEditedSubscription = SubscriptionType<
  SUBSCRIPTION_CHANNELS.COMMENT_EDITED,
  CommentEditedInput
>;

export const commentEdited: SubscriptionToCommentEditedResolver<CommentEditedInput> = createIterator(
  SUBSCRIPTION_CHANNELS.COMMENT_EDITED,
  {
    filter: (source: CommentEditedInput, { storyID }) => {
      if (source.storyID !== storyID) {
        return false;
      }

      return true;
    },
  }
);
