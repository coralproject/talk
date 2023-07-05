import { decodeActionCounts } from "coral-server/models/action/comment";
import {
  Comment,
  CommentModerationQueueCounts,
} from "coral-server/models/comment";

import { GQLCOMMENT_STATUS } from "coral-server/graph/schema/__generated__/types";

export const UNMODERATED_STATUSES = [
  GQLCOMMENT_STATUS.NONE,
  GQLCOMMENT_STATUS.PREMOD,
  GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
];

export const isUnmoderated = (comment: Pick<Comment, "status">) =>
  UNMODERATED_STATUSES.includes(comment.status);

export const PENDING_STATUS = [
  GQLCOMMENT_STATUS.PREMOD,
  GQLCOMMENT_STATUS.SYSTEM_WITHHELD,
];

export const isPending = (comment: Pick<Comment, "status">) =>
  PENDING_STATUS.includes(comment.status);

export const REPORTED_STATUS = [GQLCOMMENT_STATUS.NONE];

export const isReported = (comment: Pick<Comment, "status" | "actionCounts">) =>
  decodeActionCounts(comment.actionCounts).flag.total > 0 &&
  REPORTED_STATUS.includes(comment.status);

export const isQueued = (comment: Pick<Comment, "status" | "actionCounts">) =>
  isUnmoderated(comment) || isPending(comment) || isReported(comment);

export const calculateCounts = (
  comment: Pick<Comment, "status" | "actionCounts">
): CommentModerationQueueCounts => ({
  total: isQueued(comment) ? 1 : 0,
  queues: {
    reported: isReported(comment) ? 1 : 0,
    pending: isPending(comment) ? 1 : 0,
    unmoderated: isUnmoderated(comment) ? 1 : 0,
  },
});

export const calculateCountsDiff = (
  oldComment: Pick<Comment, "status" | "actionCounts">,
  newComment: Pick<Comment, "status" | "actionCounts">
): CommentModerationQueueCounts => {
  const oldCounts = calculateCounts(oldComment);
  const newCounts = calculateCounts(newComment);

  return {
    total: newCounts.total - oldCounts.total,
    queues: {
      reported: newCounts.queues.reported - oldCounts.queues.reported,
      pending: newCounts.queues.pending - oldCounts.queues.pending,
      unmoderated: newCounts.queues.unmoderated - oldCounts.queues.unmoderated,
    },
  };
};
