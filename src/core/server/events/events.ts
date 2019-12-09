import {
  CommentCreatedInput,
  CommentEnteredModerationQueueInput,
  CommentFeaturedInput,
  CommentLeftModerationQueueInput,
  CommentReleasedInput,
  CommentReplyCreatedInput,
  CommentStatusUpdatedInput,
} from "coral-server/graph/resolvers/Subscription";

import { CoralEventPayload, createCoralEvent } from "./event";

export enum CoralEventType {
  COMMENT_ENTERED_MODERATION_QUEUE = "COMMENT_ENTERED_MODERATION_QUEUE",
  COMMENT_LEFT_MODERATION_QUEUE = "COMMENT_LEFT_MODERATION_QUEUE",
  COMMENT_STATUS_UPDATED = "COMMENT_STATUS_UPDATED",
  COMMENT_REPLY_CREATED = "COMMENT_REPLY_CREATED",
  COMMENT_CREATED = "COMMENT_CREATED",
  COMMENT_FEATURED = "COMMENT_FEATURED",
  COMMENT_RELEASED = "COMMENT_RELEASED",
  STORY_CREATED = "STORY_CREATED",
}

export type CommentEnteredModerationQueueCoralEventPayload = CoralEventPayload<
  CoralEventType.COMMENT_ENTERED_MODERATION_QUEUE,
  CommentEnteredModerationQueueInput
>;

export const CommentEnteredModerationQueueCoralEvent = createCoralEvent<
  CommentEnteredModerationQueueCoralEventPayload
>(CoralEventType.COMMENT_ENTERED_MODERATION_QUEUE);

export type CommentLeftModerationQueueCoralEventPayload = CoralEventPayload<
  CoralEventType.COMMENT_LEFT_MODERATION_QUEUE,
  CommentLeftModerationQueueInput
>;

export const CommentLeftModerationQueueCoralEvent = createCoralEvent<
  CommentLeftModerationQueueCoralEventPayload
>(CoralEventType.COMMENT_LEFT_MODERATION_QUEUE);

export type CommentStatusUpdatedCoralEventPayload = CoralEventPayload<
  CoralEventType.COMMENT_STATUS_UPDATED,
  CommentStatusUpdatedInput
>;

export const CommentStatusUpdatedCoralEvent = createCoralEvent<
  CommentStatusUpdatedCoralEventPayload
>(CoralEventType.COMMENT_STATUS_UPDATED);

export type CommentReplyCreatedCoralEventPayload = CoralEventPayload<
  CoralEventType.COMMENT_REPLY_CREATED,
  CommentReplyCreatedInput
>;

export const CommentReplyCreatedCoralEvent = createCoralEvent<
  CommentReplyCreatedCoralEventPayload
>(CoralEventType.COMMENT_REPLY_CREATED);

export type CommentCreatedCoralEventPayload = CoralEventPayload<
  CoralEventType.COMMENT_CREATED,
  CommentCreatedInput
>;

export const CommentCreatedCoralEvent = createCoralEvent<
  CommentCreatedCoralEventPayload
>(CoralEventType.COMMENT_CREATED);

export type CommentFeaturedCoralEventPayload = CoralEventPayload<
  CoralEventType.COMMENT_FEATURED,
  CommentFeaturedInput
>;

export const CommentFeaturedCoralEvent = createCoralEvent<
  CommentFeaturedCoralEventPayload
>(CoralEventType.COMMENT_FEATURED);

export type CommentReleasedCoralEventPayload = CoralEventPayload<
  CoralEventType.COMMENT_RELEASED,
  CommentReleasedInput
>;

export const CommentReleasedCoralEvent = createCoralEvent<
  CommentReleasedCoralEventPayload
>(CoralEventType.COMMENT_RELEASED);

export type StoryCreatedCoralEventPayload = CoralEventPayload<
  CoralEventType.STORY_CREATED,
  {
    storyID: string;
    storyURL: string;
  }
>;

export const StoryCreatedCoralEvent = createCoralEvent<
  StoryCreatedCoralEventPayload
>(CoralEventType.STORY_CREATED);
