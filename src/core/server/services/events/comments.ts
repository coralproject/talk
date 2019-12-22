import {
  CommentCreatedCoralEvent,
  CommentEnteredModerationQueueCoralEvent,
  CommentFeaturedCoralEvent,
  CommentLeftModerationQueueCoralEvent,
  CommentReleasedCoralEvent,
  CommentReplyCreatedCoralEvent,
  CommentStatusUpdatedCoralEvent,
} from "coral-server/events";
import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import {
  Comment,
  CommentModerationQueueCounts,
  hasPublishedStatus,
} from "coral-server/models/comment";

import {
  GQLCOMMENT_STATUS,
  GQLMODERATION_QUEUE,
} from "coral-server/graph/schema/__generated__/types";

export async function publishCommentStatusChanges(
  broker: CoralEventPublisherBroker,
  oldStatus: GQLCOMMENT_STATUS,
  newStatus: GQLCOMMENT_STATUS,
  commentID: string,
  moderatorID: string | null
) {
  if (oldStatus !== newStatus) {
    await CommentStatusUpdatedCoralEvent.publish(broker, {
      newStatus,
      oldStatus,
      commentID,
      moderatorID,
    });
  }
}

export async function publishCommentReplyCreated(
  broker: CoralEventPublisherBroker,
  comment: Pick<Comment, "id" | "status" | "ancestorIDs">
) {
  if (comment.ancestorIDs.length > 0 && hasPublishedStatus(comment)) {
    await CommentReplyCreatedCoralEvent.publish(broker, {
      ancestorIDs: comment.ancestorIDs,
      commentID: comment.id,
    });
  }
}

export async function publishCommentCreated(
  broker: CoralEventPublisherBroker,
  comment: Pick<Comment, "id" | "storyID" | "parentID" | "status">
) {
  if (!comment.parentID && hasPublishedStatus(comment)) {
    await CommentCreatedCoralEvent.publish(broker, {
      commentID: comment.id,
      storyID: comment.storyID,
    });
  }
}

export async function publishCommentReleased(
  broker: CoralEventPublisherBroker,
  comment: Pick<Comment, "id" | "storyID" | "parentID" | "status">
) {
  if (!comment.parentID && hasPublishedStatus(comment)) {
    await CommentReleasedCoralEvent.publish(broker, {
      commentID: comment.id,
      storyID: comment.storyID,
    });
  }
}

export async function publishCommentFeatured(
  broker: CoralEventPublisherBroker,
  comment: Pick<Comment, "id" | "status" | "storyID">
) {
  if (hasPublishedStatus(comment)) {
    await CommentFeaturedCoralEvent.publish(broker, {
      commentID: comment.id,
      storyID: comment.storyID,
    });
  }
}

export async function publishModerationQueueChanges(
  broker: CoralEventPublisherBroker,
  moderationQueue: Pick<CommentModerationQueueCounts, "queues">,
  comment: Pick<Comment, "id" | "storyID">
) {
  if (moderationQueue.queues.pending === 1) {
    await CommentEnteredModerationQueueCoralEvent.publish(broker, {
      queue: GQLMODERATION_QUEUE.PENDING,
      commentID: comment.id,
      storyID: comment.storyID,
    });
  } else if (moderationQueue.queues.pending === -1) {
    await CommentLeftModerationQueueCoralEvent.publish(broker, {
      queue: GQLMODERATION_QUEUE.PENDING,
      commentID: comment.id,
      storyID: comment.storyID,
    });
  }
  if (moderationQueue.queues.reported === 1) {
    await CommentEnteredModerationQueueCoralEvent.publish(broker, {
      queue: GQLMODERATION_QUEUE.REPORTED,
      commentID: comment.id,
      storyID: comment.storyID,
    });
  } else if (moderationQueue.queues.reported === -1) {
    await CommentLeftModerationQueueCoralEvent.publish(broker, {
      queue: GQLMODERATION_QUEUE.REPORTED,
      commentID: comment.id,
      storyID: comment.storyID,
    });
  }
  if (moderationQueue.queues.unmoderated === 1) {
    await CommentEnteredModerationQueueCoralEvent.publish(broker, {
      queue: GQLMODERATION_QUEUE.UNMODERATED,
      commentID: comment.id,
      storyID: comment.storyID,
    });
  } else if (moderationQueue.queues.unmoderated === -1) {
    await CommentLeftModerationQueueCoralEvent.publish(broker, {
      queue: GQLMODERATION_QUEUE.UNMODERATED,
      commentID: comment.id,
      storyID: comment.storyID,
    });
  }
}
