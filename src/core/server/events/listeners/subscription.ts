import { singleton } from "tsyringe";

import { createSubscriptionChannelName } from "coral-server/graph/resolvers/Subscription/helpers";
import { SUBSCRIPTION_CHANNELS } from "coral-server/graph/resolvers/Subscription/types";
import { PubSubService } from "coral-server/graph/subscriptions/pubsub";

import {
  CommentCreatedCoralEventPayload,
  CommentEnteredModerationQueueCoralEventPayload,
  CommentFeaturedCoralEventPayload,
  CommentLeftModerationQueueCoralEventPayload,
  CommentReleasedCoralEventPayload,
  CommentReplyCreatedCoralEventPayload,
  CommentStatusUpdatedCoralEventPayload,
} from "../events";
import { CoralEventHandler, CoralEventListener } from "../listener";
import { CoralEventType } from "../types";

type SubscriptionCoralEventListenerPayloads =
  | CommentEnteredModerationQueueCoralEventPayload
  | CommentLeftModerationQueueCoralEventPayload
  | CommentStatusUpdatedCoralEventPayload
  | CommentReplyCreatedCoralEventPayload
  | CommentCreatedCoralEventPayload
  | CommentFeaturedCoralEventPayload
  | CommentReleasedCoralEventPayload;

@singleton()
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

  constructor(private readonly pubsub: PubSubService) {}

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

  public handle: CoralEventHandler<
    SubscriptionCoralEventListenerPayloads
  > = async ({ clientID, tenant: { id } }, { type, data }) => {
    await this.pubsub.publish(this.trigger(id, type), {
      ...data,
      clientID,
    });
  };
}
