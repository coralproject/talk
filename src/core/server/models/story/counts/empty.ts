import {
  CommentModerationCountsPerQueue,
  CommentModerationQueueCounts,
} from ".";

export function createEmptyCommentModerationCountsPerQueue(): CommentModerationCountsPerQueue {
  return {
    unmoderated: 0,
    reported: 0,
    pending: 0,
  };
}

export function createEmptyCommentModerationQueueCounts(): CommentModerationQueueCounts {
  return {
    total: 0,
    queues: createEmptyCommentModerationCountsPerQueue(),
  };
}
