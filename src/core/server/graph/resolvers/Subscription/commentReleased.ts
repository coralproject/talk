import {
  GQLCommentReleasedPayload,
  GQLSubscription,
  GQLSubscriptionGQLcommentReleasedArgs,
  Resolver,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "coral-server/graph/context";
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

export const commentReleased: Resolver<
  GQLCommentReleasedPayload,
  GQLSubscription,
  GraphContext,
  GQLSubscriptionGQLcommentReleasedArgs
> = createIterator(SUBSCRIPTION_CHANNELS.COMMENT_RELEASED, {
  filter: (source, { storyID }) => {
    if (source.storyID !== storyID) {
      return false;
    }

    return true;
  },
});
