import {
  GQLResolversTypes,
  GQLSubscriptionGQLcommentEditedArgs,
  RequireFields,
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

export const commentEdited = createIterator<
  any,
  "commentEdited", // TODO (marcushaddon): where does this come from and is it true? do we need to upate our enum?
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
