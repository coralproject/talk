import {
  GQLResolversTypes,
  GQLSubscriptionGQLcommentFeaturedArgs,
  RequireFields,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "coral-server/graph/context";
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

export const commentFeatured = createIterator<
  any,
  "commentFeatured", // TODO (marcushaddon): where does this come from and is it true? do we need to upate our enum?
  GQLResolversTypes["CommentFeaturedPayload"],
  GraphContext,
  RequireFields<GQLSubscriptionGQLcommentFeaturedArgs, "storyID">
>(SUBSCRIPTION_CHANNELS.COMMENT_FEATURED, {
  filter: (source, { storyID }) => {
    if (source.storyID !== storyID) {
      return false;
    }

    return true;
  },
});
