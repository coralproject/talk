import { hasFeatureFlag } from "coral-server/models/tenant";

import {
  GQLCommentLeftModerationQueuePayload,
  GQLFEATURE_FLAG,
  GQLMODERATION_QUEUE,
  GQLSubscription,
  GQLSubscriptionGQLcommentLeftModerationQueueArgs,
  Resolver,
} from "coral-server/graph/schema/__generated__/types";

import GraphContext from "coral-server/graph/context";
import { createIterator } from "./helpers";
import {
  SUBSCRIPTION_CHANNELS,
  SubscriptionPayload,
  SubscriptionType,
} from "./types";

export interface CommentLeftModerationQueueInput extends SubscriptionPayload {
  queue: GQLMODERATION_QUEUE;
  commentID: string;
  storyID: string;
  siteID: string;
  section?: string;
}

export type CommentLeftModerationQueueSubscription = SubscriptionType<
  SUBSCRIPTION_CHANNELS.COMMENT_LEFT_MODERATION_QUEUE,
  CommentLeftModerationQueueInput
>;

export const commentLeftModerationQueue: Resolver<
  GQLCommentLeftModerationQueuePayload,
  GQLSubscription,
  GraphContext,
  GQLSubscriptionGQLcommentLeftModerationQueueArgs
> = createIterator(SUBSCRIPTION_CHANNELS.COMMENT_LEFT_MODERATION_QUEUE, {
  filter: (source, { storyID, siteID, section, queue }, ctx) => {
    // If we're filtering by storyID, then only send back comments with the
    // specific storyID.
    if (storyID && source.storyID !== storyID) {
      return false;
    }

    // If we're filtering by queue, then only send back comments from the
    // specific queue.
    if (queue && source.queue !== queue) {
      return false;
    }

    // If we're filtering by siteID, then only send back comments from the
    // specific site.
    if (siteID && source.siteID !== siteID) {
      return false;
    }

    // If we're filtering by section, then only send back comments from the
    // specific section. If the source has a section, if it's not equal to the
    // filter then return false. If the source does not have a section, then
    // the filter must also be null/undefined, otherwise return false.
    if (
      section &&
      ((source.section && section.name !== source.section) ||
        (!source.section && section.name)) &&
      hasFeatureFlag(ctx.tenant, GQLFEATURE_FLAG.SECTIONS)
    ) {
      return false;
    }

    return true;
  },
});
