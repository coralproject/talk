import {
  CommentCreatedCoralEvent,
  CommentEnteredModerationQueueCoralEvent,
  CommentFeaturedCoralEvent,
  CommentFlagCreatedCoralEvent,
  CommentLeftModerationQueueCoralEvent,
  CommentReactionCreatedCoralEvent,
  CommentReleasedCoralEvent,
  CommentReplyCreatedCoralEvent,
  CommentStatusUpdatedCoralEvent,
} from "coral-server/events";
import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import { CommentAction } from "coral-server/models/action/comment";
import {
  Comment,
  CommentModerationQueueCounts,
  getDepth,
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
  commentRevisionID: string,
  storyID: string,
  moderatorID: string | null
) {
  if (oldStatus !== newStatus) {
    await CommentStatusUpdatedCoralEvent.publish(broker, {
      newStatus,
      oldStatus,
      commentID,
      commentRevisionID,
      storyID,
      moderatorID,
    });
  }
}

export async function publishCommentReplyCreated(
  broker: CoralEventPublisherBroker,
  comment: Pick<Comment, "id" | "status" | "storyID" | "ancestorIDs" | "siteID">
) {
  if (getDepth(comment) > 0 && hasPublishedStatus(comment)) {
    await CommentReplyCreatedCoralEvent.publish(broker, {
      ancestorIDs: comment.ancestorIDs,
      commentID: comment.id,
      storyID: comment.storyID,
      siteID: comment.siteID,
    });
  }
}

export async function publishCommentCreated(
  broker: CoralEventPublisherBroker,
  comment: Pick<Comment, "id" | "storyID" | "parentID" | "status" | "siteID">
) {
  if (!comment.parentID && hasPublishedStatus(comment)) {
    await CommentCreatedCoralEvent.publish(broker, {
      commentID: comment.id,
      storyID: comment.storyID,
      siteID: comment.siteID,
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

export async function publishCommentReactionCreated(
  broker: CoralEventPublisherBroker,
  comment: Pick<Comment, "id" | "storyID" | "siteID" | "parentID">,
  commentRevisionID: string,
  { userID }: Pick<CommentAction, "userID">
) {
  // We only publish reaction created events for reactions created by users.
  if (userID) {
    await CommentReactionCreatedCoralEvent.publish(broker, {
      commentID: comment.id,
      commentRevisionID,
      commentParentID: comment.parentID,
      actionUserID: userID,
      storyID: comment.storyID,
      siteID: comment.siteID,
    });
  }
}

export async function publishCommentFlagCreated(
  broker: CoralEventPublisherBroker,
  comment: Pick<Comment, "id" | "storyID" | "siteID" | "parentID">,
  commentRevisionID: string,
  { userID, reason }: Pick<CommentAction, "reason" | "userID">
) {
  // We only publish flag created events for flags created by the system with
  // a reason.
  if (userID && reason) {
    await CommentFlagCreatedCoralEvent.publish(broker, {
      commentID: comment.id,
      commentRevisionID,
      commentParentID: comment.parentID,
      actionUserID: userID,
      flagReason: reason,
      storyID: comment.storyID,
      siteID: comment.siteID,
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
  comment: Pick<Comment, "id" | "storyID" | "siteID" | "section">
) {
  if (moderationQueue.queues.pending === 1) {
    await CommentEnteredModerationQueueCoralEvent.publish(broker, {
      queue: GQLMODERATION_QUEUE.PENDING,
      commentID: comment.id,
      storyID: comment.storyID,
      siteID: comment.siteID,
      section: comment.section,
    });
  } else if (moderationQueue.queues.pending === -1) {
    await CommentLeftModerationQueueCoralEvent.publish(broker, {
      queue: GQLMODERATION_QUEUE.PENDING,
      commentID: comment.id,
      storyID: comment.storyID,
      siteID: comment.siteID,
      section: comment.section,
    });
  }
  if (moderationQueue.queues.reported === 1) {
    await CommentEnteredModerationQueueCoralEvent.publish(broker, {
      queue: GQLMODERATION_QUEUE.REPORTED,
      commentID: comment.id,
      storyID: comment.storyID,
      siteID: comment.siteID,
      section: comment.section,
    });
  } else if (moderationQueue.queues.reported === -1) {
    await CommentLeftModerationQueueCoralEvent.publish(broker, {
      queue: GQLMODERATION_QUEUE.REPORTED,
      commentID: comment.id,
      storyID: comment.storyID,
      siteID: comment.siteID,
      section: comment.section,
    });
  }
  if (moderationQueue.queues.unmoderated === 1) {
    await CommentEnteredModerationQueueCoralEvent.publish(broker, {
      queue: GQLMODERATION_QUEUE.UNMODERATED,
      commentID: comment.id,
      storyID: comment.storyID,
      siteID: comment.siteID,
      section: comment.section,
    });
  } else if (moderationQueue.queues.unmoderated === -1) {
    await CommentLeftModerationQueueCoralEvent.publish(broker, {
      queue: GQLMODERATION_QUEUE.UNMODERATED,
      commentID: comment.id,
      storyID: comment.storyID,
      siteID: comment.siteID,
      section: comment.section,
    });
  }
}
