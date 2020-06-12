import {
  CommentCreatedInput,
  CommentEnteredModerationQueueInput,
  CommentFeaturedInput,
  CommentLeftModerationQueueInput,
  CommentReleasedInput,
  CommentReplyCreatedInput,
  CommentStatusUpdatedInput,
} from "coral-server/graph/resolvers/Subscription";
import { FLAG_REASON } from "coral-server/models/action/comment";

import { CoralEventPayload, createCoralEvent } from "./event";
import { CoralEventType } from "./types";

export type CommentEnteredModerationQueueCoralEventPayload = CoralEventPayload<
  CoralEventType.COMMENT_ENTERED_MODERATION_QUEUE,
  CommentEnteredModerationQueueInput
>;

export const CommentEnteredModerationQueueCoralEvent = createCoralEvent<
  CommentEnteredModerationQueueCoralEventPayload
>(CoralEventType.COMMENT_ENTERED_MODERATION_QUEUE);

export type CommentReactionCreatedCoralEventPayload = CoralEventPayload<
  CoralEventType.COMMENT_REACTION_CREATED,
  {
    commentID: string;
    commentRevisionID: string;
    commentParentID?: string;
    actionUserID: string;
    storyID: string;
    siteID: string;
  }
>;

export const CommentReactionCreatedCoralEvent = createCoralEvent<
  CommentReactionCreatedCoralEventPayload
>(CoralEventType.COMMENT_REACTION_CREATED);

export type CommentFlagCreatedCoralEventPayload = CoralEventPayload<
  CoralEventType.COMMENT_FLAG_CREATED,
  {
    commentID: string;
    commentRevisionID: string;
    commentParentID?: string;
    flagReason: FLAG_REASON;
    actionUserID: string;
    storyID: string;
    siteID: string;
  }
>;

export const CommentFlagCreatedCoralEvent = createCoralEvent<
  CommentFlagCreatedCoralEventPayload
>(CoralEventType.COMMENT_FLAG_CREATED);

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
    siteID: string;
  }
>;

export const StoryCreatedCoralEvent = createCoralEvent<
  StoryCreatedCoralEventPayload
>(CoralEventType.STORY_CREATED);
