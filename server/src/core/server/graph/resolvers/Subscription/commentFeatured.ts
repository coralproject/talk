import { SubscriptionToCommentFeaturedResolver } from "coral-server/graph/schema/__generated__/types";

import { createIterator } from "./helpers";
import {
  SUBSCRIPTION_CHANNELS,
  SubscriptionPayload,
  SubscriptionType,
} from "./types";

export interface CommentFeaturedInput extends SubscriptionPayload {
  storyID: string;
  commentID: string;
}

export type CommentFeaturedSubscription = SubscriptionType<
  SUBSCRIPTION_CHANNELS.COMMENT_FEATURED,
  CommentFeaturedInput
>;

export const commentFeatured: SubscriptionToCommentFeaturedResolver<CommentFeaturedInput> =
  createIterator(SUBSCRIPTION_CHANNELS.COMMENT_FEATURED, {
    filter: (source, { storyID }) => {
      if (source.storyID !== storyID) {
        return false;
      }

      return true;
    },
  });
