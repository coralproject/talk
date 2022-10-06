import { SubscriptionToCommentReplyCreatedResolver } from "coral-server/graph/schema/__generated__/types";

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

export const commentReplyCreated: SubscriptionToCommentReplyCreatedResolver<CommentReplyCreatedInput> = createIterator(
  SUBSCRIPTION_CHANNELS.COMMENT_REPLY_CREATED,
  {
    filter: (source, { ancestorID }) => {
      if (!source.ancestorIDs.includes(ancestorID)) {
        return false;
      }

      return true;
    },
  }
);
