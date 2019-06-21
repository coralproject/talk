import { CommentCreatedInput } from "./commentCreated";
import { CommentEnteredModerationQueueInput } from "./commentEnteredModerationQueue";
import { CommentLeftModerationQueueInput } from "./commentLeftModerationQueue";
import { CommentReplyCreatedInput } from "./commentReplyCreated";
import { CommentStatusUpdatedInput } from "./commentStatusUpdated";

export enum SUBSCRIPTION_CHANNELS {
  COMMENT_ENTERED_MODERATION_QUEUE = "COMMENT_ENTERED_MODERATION_QUEUE",
  COMMENT_LEFT_MODERATION_QUEUE = "COMMENT_LEFT_MODERATION_QUEUE",
  COMMENT_STATUS_UPDATED = "COMMENT_STATUS_UPDATED",
  COMMENT_REPLY_CREATED = "COMMENT_REPLY_CREATED",
  COMMENT_CREATED = "COMMENT_CREATED",
}

export interface SubscriptionPayload {
  clientID?: string;
}

export interface SubscriptionType<
  TChannel extends SUBSCRIPTION_CHANNELS,
  TPayload extends SubscriptionPayload
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
    >
  | SubscriptionType<
      SUBSCRIPTION_CHANNELS.COMMENT_REPLY_CREATED,
      CommentReplyCreatedInput
    >
  | SubscriptionType<
      SUBSCRIPTION_CHANNELS.COMMENT_CREATED,
      CommentCreatedInput
    >;
