import { CommentEnteredModerationQueueInput } from "./commentEnteredModerationQueue";
import { CommentLeftModerationQueueInput } from "./commentLeftModerationQueue";
import { CommentStatusUpdatedInput } from "./commentStatusUpdated";

export enum SUBSCRIPTION_CHANNELS {
  COMMENT_ENTERED_MODERATION_QUEUE = "COMMENT_ENTERED_MODERATION_QUEUE",
  COMMENT_LEFT_MODERATION_QUEUE = "COMMENT_LEFT_MODERATION_QUEUE",
  COMMENT_STATUS_UPDATED = "COMMENT_STATUS_UPDATED",
}

export interface SubscriptionType<
  TChannel extends SUBSCRIPTION_CHANNELS,
  TPayload extends {}
> {
  channel: TChannel;
  payload: TPayload;
}

export type SUBSCRIPTION_INPUT =
  | SubscriptionType<
      SUBSCRIPTION_CHANNELS.COMMENT_ENTERED_MODERATION_QUEUE,
      CommentEnteredModerationQueueInput
    >
  | SubscriptionType<
      SUBSCRIPTION_CHANNELS.COMMENT_LEFT_MODERATION_QUEUE,
      CommentLeftModerationQueueInput
    >
  | SubscriptionType<
      SUBSCRIPTION_CHANNELS.COMMENT_STATUS_UPDATED,
      CommentStatusUpdatedInput
    >;
