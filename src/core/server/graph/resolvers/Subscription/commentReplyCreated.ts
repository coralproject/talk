import {
  GQLResolversTypes,
  GQLSubscriptionGQLcommentReplyCreatedArgs,
  RequireFields,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "coral-server/graph/context";
import { createIterator } from "./helpers";
import {
  SUBSCRIPTION_CHANNELS,
  SubscriptionPayload,
  SubscriptionType,
} from "./types";

export interface CommentReplyCreatedInput extends SubscriptionPayload {
  ancestorIDs: string[];
  commentID: string;
  storyID: string;
  siteID: string;
}

export type CommentReplyCreatedSubscription = SubscriptionType<
  SUBSCRIPTION_CHANNELS.COMMENT_REPLY_CREATED,
  CommentReplyCreatedInput
>;

export const commentReplyCreated = createIterator<
  any,
  "commentReplyCreated", // TODO (marcushaddon): where does this come from and is it true? do we need to upate our enum?
  GQLResolversTypes["CommentReplyCreatedPayload"],
  GraphContext,
  RequireFields<GQLSubscriptionGQLcommentReplyCreatedArgs, "ancestorID">
>(SUBSCRIPTION_CHANNELS.COMMENT_REPLY_CREATED, {
  filter: (source, { ancestorID }) => {
    if (!source.ancestorIDs.includes(ancestorID)) {
      return false;
    }

    return true;
  },
});
