import {
  GQLResolversTypes,
  GQLSubscription,
  GQLSubscriptionGQLcommentEditedArgs,
  RequireFields,
  SubscriptionResolver,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "coral-server/graph/context";
import { createIterator } from "./helpers";
import {
  SUBSCRIPTION_CHANNELS,
  SubscriptionPayload,
  SubscriptionType,
} from "./types";

export interface CommentEditedInput extends SubscriptionPayload {
  storyID: string;
  commentID: string;
}

export type CommentEditedSubscription = SubscriptionType<
  SUBSCRIPTION_CHANNELS.COMMENT_EDITED,
  CommentEditedInput
>;

type MyType = SubscriptionResolver<
  GQLResolversTypes["CommentEditedPayload"],
  "commentEdited",
  GQLSubscription,
  GraphContext,
  RequireFields<GQLSubscriptionGQLcommentEditedArgs, "storyID">
>;

export const commentEdited = createIterator<
  any,
  "commentEdited",
  GQLResolversTypes["CommentEditedPayload"],
  GraphContext,
  RequireFields<GQLSubscriptionGQLcommentEditedArgs, "storyID">
>(SUBSCRIPTION_CHANNELS.COMMENT_EDITED, {
  filter: (source, { storyID }) => {
    if (source.storyID !== storyID) {
      return false;
    }

    return true;
  },
});
