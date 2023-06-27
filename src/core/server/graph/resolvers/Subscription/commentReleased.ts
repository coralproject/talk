import {
  GQLResolversTypes,
  GQLSubscriptionGQLcommentReleasedArgs,
  RequireFields,
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

export const commentReleased = createIterator<
  any,
  "commentReleased", // TODO (marcushaddon): where does this come from and is it true? do we need to upate our enum?
  GQLResolversTypes["CommentReleasedPayload"],
  GraphContext,
  RequireFields<GQLSubscriptionGQLcommentReleasedArgs, "storyID">
>(SUBSCRIPTION_CHANNELS.COMMENT_RELEASED, {
  filter: (source, { storyID }) => {
    if (source.storyID !== storyID) {
      return false;
    }

    return true;
  },
});
