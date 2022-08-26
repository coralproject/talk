import {
  GQLCOMMENT_STATUS,
  GQLCommentTagCounts,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

import {
  CommentCountsPerTag,
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
  tags: GQLCommentTagCounts
): boolean {
  if (tags.FEATURED === null || tags.FEATURED === undefined) {
    return true;
  }
  if (tags.UNANSWERED === null || tags.UNANSWERED === undefined) {
    return true;
  }
  if (tags.REVIEW === null || tags.REVIEW === undefined) {
    return true;
  }
  if (tags.QUESTION === null || tags.QUESTION === undefined) {
    return true;
  }

  return false;
}

export function hasInvalidCommentTagCounts(tags: CommentTagCounts): boolean {
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

  if (!tags) {
    return true;
  }

  if (tags.total === undefined || tags.total === null) {
    return true;
  }

  for (const key of keys) {
    const val = tags.tags[key];
    if (val === undefined || val === null) {
      return true;
    }
  }

  return false;
}

export function createEmptyCommentCountsPerTag(): CommentCountsPerTag {
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
    tags: createEmptyCommentCountsPerTag(),
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
