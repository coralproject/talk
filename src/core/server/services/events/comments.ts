import { SUBSCRIPTION_CHANNELS } from "coral-server/graph/tenant/resolvers/Subscription/types";
import {
  GQLCOMMENT_STATUS,
  GQLMODERATION_QUEUE,
} from "coral-server/graph/tenant/schema/__generated__/types";
import { Publisher } from "coral-server/graph/tenant/subscriptions/publisher";
import { Comment, hasPublishedStatus } from "coral-server/models/comment";
import { CommentModerationQueueCounts } from "coral-server/models/story/counts";

export function publishCommentStatusChanges(
  publish: Publisher,
  oldStatus: GQLCOMMENT_STATUS,
  newStatus: GQLCOMMENT_STATUS,
  commentID: string,
  moderatorID: string | null
) {
  if (oldStatus !== newStatus) {
    publish({
      channel: SUBSCRIPTION_CHANNELS.COMMENT_STATUS_UPDATED,
      payload: {
        newStatus,
        oldStatus,
        commentID,
        moderatorID,
      },
    });
  }
}

export function publishCommentReplyCreated(
  publish: Publisher,
  comment: Pick<Comment, "id" | "status" | "ancestorIDs">
) {
  if (comment.ancestorIDs.length > 0 && hasPublishedStatus(comment)) {
    publish({
      channel: SUBSCRIPTION_CHANNELS.COMMENT_REPLY_CREATED,
      payload: {
        ancestorIDs: comment.ancestorIDs,
        commentID: comment.id,
      },
    });
  }
}

export function publishCommentCreated(
  publish: Publisher,
  comment: Pick<Comment, "id" | "storyID" | "parentID" | "status">
) {
  if (!comment.parentID && hasPublishedStatus(comment)) {
    publish({
      channel: SUBSCRIPTION_CHANNELS.COMMENT_CREATED,
      payload: {
        commentID: comment.id,
        storyID: comment.storyID,
      },
    });
  }
}

export function publishCommentFeatured(
  publish: Publisher,
  comment: Pick<Comment, "id" | "status" | "storyID">
) {
  if (hasPublishedStatus(comment)) {
    publish({
      channel: SUBSCRIPTION_CHANNELS.COMMENT_FEATURED,
      payload: {
        commentID: comment.id,
        storyID: comment.storyID,
      },
    });
  }
}

export function publishModerationQueueChanges(
  publish: Publisher,
  moderationQueue: Pick<CommentModerationQueueCounts, "queues">,
  comment: Pick<Comment, "id" | "storyID">
) {
  if (moderationQueue.queues.pending === 1) {
    publish({
      channel: SUBSCRIPTION_CHANNELS.COMMENT_ENTERED_MODERATION_QUEUE,
      payload: {
        queue: GQLMODERATION_QUEUE.PENDING,
        commentID: comment.id,
        storyID: comment.storyID,
      },
    });
  } else if (moderationQueue.queues.pending === -1) {
    publish({
      channel: SUBSCRIPTION_CHANNELS.COMMENT_LEFT_MODERATION_QUEUE,
      payload: {
        queue: GQLMODERATION_QUEUE.PENDING,
        commentID: comment.id,
        storyID: comment.storyID,
      },
    });
  }
  if (moderationQueue.queues.reported === 1) {
    publish({
      channel: SUBSCRIPTION_CHANNELS.COMMENT_ENTERED_MODERATION_QUEUE,
      payload: {
        queue: GQLMODERATION_QUEUE.REPORTED,
        commentID: comment.id,
        storyID: comment.storyID,
      },
    });
  } else if (moderationQueue.queues.reported === -1) {
    publish({
      channel: SUBSCRIPTION_CHANNELS.COMMENT_LEFT_MODERATION_QUEUE,
      payload: {
        queue: GQLMODERATION_QUEUE.REPORTED,
        commentID: comment.id,
        storyID: comment.storyID,
      },
    });
  }
  if (moderationQueue.queues.unmoderated === 1) {
    publish({
      channel: SUBSCRIPTION_CHANNELS.COMMENT_ENTERED_MODERATION_QUEUE,
      payload: {
        queue: GQLMODERATION_QUEUE.UNMODERATED,
        commentID: comment.id,
        storyID: comment.storyID,
      },
    });
  } else if (moderationQueue.queues.unmoderated === -1) {
    publish({
      channel: SUBSCRIPTION_CHANNELS.COMMENT_LEFT_MODERATION_QUEUE,
      payload: {
        queue: GQLMODERATION_QUEUE.UNMODERATED,
        commentID: comment.id,
        storyID: comment.storyID,
      },
    });
  }
}
