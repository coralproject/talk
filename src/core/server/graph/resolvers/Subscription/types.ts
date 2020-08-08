import { CommentCreatedSubscription } from "./commentCreated";
import { CommentEnteredModerationQueueSubscription } from "./commentEnteredModerationQueue";
import { CommentFeaturedSubscription } from "./commentFeatured";
import { CommentLeftModerationQueueSubscription } from "./commentLeftModerationQueue";
import { CommentReleasedSubscription } from "./commentReleased";
import { CommentReplyCreatedSubscription } from "./commentReplyCreated";
import { CommentStatusUpdatedSubscription } from "./commentStatusUpdated";

export enum SUBSCRIPTION_CHANNELS {
  COMMENT_ENTERED_MODERATION_QUEUE = "COMMENT_ENTERED_MODERATION_QUEUE",
  COMMENT_LEFT_MODERATION_QUEUE = "COMMENT_LEFT_MODERATION_QUEUE",
  COMMENT_STATUS_UPDATED = "COMMENT_STATUS_UPDATED",
  COMMENT_REPLY_CREATED = "COMMENT_REPLY_CREATED",
  COMMENT_CREATED = "COMMENT_CREATED",
  COMMENT_FEATURED = "COMMENT_FEATURED",
  COMMENT_RELEASED = "COMMENT_RELEASED",
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
  | CommentEnteredModerationQueueSubscription
  | CommentLeftModerationQueueSubscription
  | CommentStatusUpdatedSubscription
  | CommentReplyCreatedSubscription
  | CommentCreatedSubscription
  | CommentFeaturedSubscription
  | CommentReleasedSubscription;
