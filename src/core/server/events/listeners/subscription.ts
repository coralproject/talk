import { createSubscriptionChannelName } from "coral-server/graph/resolvers/Subscription/helpers";
import { SUBSCRIPTION_CHANNELS } from "coral-server/graph/resolvers/Subscription/types";

import {
  CommentCreatedCoralEventPayload,
  CommentEnteredModerationQueueCoralEventPayload,
  CommentFeaturedCoralEventPayload,
  CommentLeftModerationQueueCoralEventPayload,
  CommentReleasedCoralEventPayload,
  CommentReplyCreatedCoralEventPayload,
  CommentStatusUpdatedCoralEventPayload,
  CoralEventType,
} from "../events";
import { CoralEventListener, CoralEventPublisherFactory } from "../publisher";

type SubscriptionCoralEventListenerPayloads =
  | CommentEnteredModerationQueueCoralEventPayload
  | CommentLeftModerationQueueCoralEventPayload
  | CommentStatusUpdatedCoralEventPayload
  | CommentReplyCreatedCoralEventPayload
  | CommentCreatedCoralEventPayload
  | CommentFeaturedCoralEventPayload
  | CommentReleasedCoralEventPayload;

export class SubscriptionCoralEventListener
  implements CoralEventListener<SubscriptionCoralEventListenerPayloads> {
  public readonly name = "subscription";
  public readonly events = [
    CoralEventType.COMMENT_ENTERED_MODERATION_QUEUE,
    CoralEventType.COMMENT_LEFT_MODERATION_QUEUE,
    CoralEventType.COMMENT_STATUS_UPDATED,
    CoralEventType.COMMENT_REPLY_CREATED,
    CoralEventType.COMMENT_CREATED,
    CoralEventType.COMMENT_FEATURED,
    CoralEventType.COMMENT_RELEASED,
  ];

  private translate(
    type: SubscriptionCoralEventListenerPayloads["type"]
  ): SUBSCRIPTION_CHANNELS {
    switch (type) {
      case CoralEventType.COMMENT_ENTERED_MODERATION_QUEUE:
        return SUBSCRIPTION_CHANNELS.COMMENT_ENTERED_MODERATION_QUEUE;
      case CoralEventType.COMMENT_LEFT_MODERATION_QUEUE:
        return SUBSCRIPTION_CHANNELS.COMMENT_LEFT_MODERATION_QUEUE;
      case CoralEventType.COMMENT_STATUS_UPDATED:
        return SUBSCRIPTION_CHANNELS.COMMENT_STATUS_UPDATED;
      case CoralEventType.COMMENT_REPLY_CREATED:
        return SUBSCRIPTION_CHANNELS.COMMENT_REPLY_CREATED;
      case CoralEventType.COMMENT_CREATED:
        return SUBSCRIPTION_CHANNELS.COMMENT_CREATED;
      case CoralEventType.COMMENT_FEATURED:
        return SUBSCRIPTION_CHANNELS.COMMENT_FEATURED;
      case CoralEventType.COMMENT_RELEASED:
        return SUBSCRIPTION_CHANNELS.COMMENT_RELEASED;
    }
  }

  private trigger(
    tenantID: string,
    type: SubscriptionCoralEventListenerPayloads["type"]
  ) {
    return createSubscriptionChannelName(tenantID, this.translate(type));
  }

  public initialize: CoralEventPublisherFactory<
    SubscriptionCoralEventListenerPayloads
  > = ({ clientID, pubsub, tenant: { id } }) => async ({ type, data }) => {
    await pubsub.publish(this.trigger(id, type), {
      ...data,
      clientID,
    });
  };
}
