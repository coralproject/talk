import {
  GQLCOMMENT_STATUS,
  GQLCommentTagCounts,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

import {
  CommentModerationCountsPerQueue,
  CommentModerationQueueCounts,
  CommentStatusCounts,
  CommentTagCounts,
  RelatedCommentCounts,
} from "./counts";

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

export function createEmptyCommentStatusCounts(): CommentStatusCounts {
  return {
    [GQLCOMMENT_STATUS.APPROVED]: 0,
    [GQLCOMMENT_STATUS.NONE]: 0,
    [GQLCOMMENT_STATUS.PREMOD]: 0,
    [GQLCOMMENT_STATUS.REJECTED]: 0,
    [GQLCOMMENT_STATUS.SYSTEM_WITHHELD]: 0,
  };
}

export function hasInvalidGQLCommentTagCounts(
  counts: GQLCommentTagCounts
): boolean {
  const keys = [
    GQLTAG.ADMIN,
    GQLTAG.EXPERT,
    GQLTAG.FEATURED,
    GQLTAG.MEMBER,
    GQLTAG.MODERATOR,
    GQLTAG.QUESTION,
    GQLTAG.REVIEW,
    GQLTAG.STAFF,
    GQLTAG.UNANSWERED,
  ];

  for (const key of keys) {
    const val = counts[key];
    if (val === undefined || val === null) {
      return true;
    }
  }

  return false;
}

export function hasInvalidCommentTagCounts(tags: CommentTagCounts): boolean {
  if (!tags) {
    return true;
  }

  if (tags.total === undefined || tags.total === null) {
    return true;
  }

  return hasInvalidGQLCommentTagCounts(tags.tags);
}

export function createEmptyGQLCommentTagCounts(): GQLCommentTagCounts {
  return {
    [GQLTAG.ADMIN]: 0,
    [GQLTAG.EXPERT]: 0,
    [GQLTAG.FEATURED]: 0,
    [GQLTAG.MEMBER]: 0,
    [GQLTAG.MODERATOR]: 0,
    [GQLTAG.QUESTION]: 0,
    [GQLTAG.REVIEW]: 0,
    [GQLTAG.STAFF]: 0,
    [GQLTAG.UNANSWERED]: 0,
  };
}

export function createEmptyCommentTagCounts(): CommentTagCounts {
  return {
    total: 0,
    tags: createEmptyGQLCommentTagCounts(),
  };
}

export function createEmptyRelatedCommentCounts(): RelatedCommentCounts {
  return {
    action: {},
    status: createEmptyCommentStatusCounts(),
    moderationQueue: createEmptyCommentModerationQueueCounts(),
    tags: createEmptyCommentTagCounts(),
  };
}
