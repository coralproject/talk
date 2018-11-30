import { GQLCOMMENT_STATUS } from "talk-server/graph/tenant/schema/__generated__/types";

import { CommentModerationQueueCounts, CommentStatusCounts } from ".";

export function createEmptyCommentModerationQueueCounts(): CommentModerationQueueCounts {
  return {
    total: 0,
    queues: {
      unmoderated: 0,
      reported: 0,
      pending: 0,
    },
  };
}

export function createEmptyCommentStatusCounts(): CommentStatusCounts {
  return {
    [GQLCOMMENT_STATUS.ACCEPTED]: 0,
    [GQLCOMMENT_STATUS.NONE]: 0,
    [GQLCOMMENT_STATUS.PREMOD]: 0,
    [GQLCOMMENT_STATUS.REJECTED]: 0,
    [GQLCOMMENT_STATUS.SYSTEM_WITHHELD]: 0,
  };
}
