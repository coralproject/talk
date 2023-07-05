import { identity, isEmpty, pickBy } from "lodash";
import { Collection } from "mongodb";

import { DeepPartial } from "coral-common/types";
import { dotize } from "coral-common/utils/dotize";
import logger from "coral-server/logger";
import { EncodedCommentActionCounts } from "coral-server/models/action/comment";
import { PUBLISHED_STATUSES } from "coral-server/models/comment/constants";

import {
  GQLCOMMENT_STATUS,
  GQLCommentTagCounts,
} from "coral-server/graph/schema/__generated__/types";

import {
  createEmptyCommentModerationQueueCounts,
  createEmptyCommentStatusCounts,
  createEmptyCommentTagCounts,
  createEmptyRelatedCommentCounts,
} from "./empty";

/**
 * CommentModerationCountsPerQueue stores the number of Comments that exist in
 * each of the Moderation Queues.
 */
export interface CommentModerationCountsPerQueue {
  /**
   * unmoderated is the number of Comment's that have not been moderated. This
   * includes all Comment's that are NONE, PREMOD, SYSTEM_WITHHELD.
   */
  unmoderated: number;

  /**
   * pending is the number of Comment's that are not published and are pending
   * moderation.
   */
  pending: number;

  /**
   * reported is the number of Comment's that have not been moderated but have
   * been flagged.
   */
  reported: number;
}

/**
 * CommentModerationQueueCounts stores the number of Comments that exist in each
 * of the ModerationQueue's on this Story.
 */
export interface CommentModerationQueueCounts {
  /**
   * total is the number of Comment's that exist in the below moderation queues.
   */
  total: number;

  /**
   * queues contains all the queue specific counts.
   */
  queues: CommentModerationCountsPerQueue;
}

// TODO: (wyattjoh) write a test to verify that this set of counts is always in sync with GQLCOMMENT_STATUS.

/**
 * CommentStatusCounts stores the count of Comments that have the particular
 * statuses.
 */
export interface CommentStatusCounts {
  [GQLCOMMENT_STATUS.APPROVED]: number;
  [GQLCOMMENT_STATUS.NONE]: number;
  [GQLCOMMENT_STATUS.PREMOD]: number;
  [GQLCOMMENT_STATUS.REJECTED]: number;
  [GQLCOMMENT_STATUS.SYSTEM_WITHHELD]: number;
}

export interface CommentTagCounts {
  total: number;

  tags: GQLCommentTagCounts;
}

/**
 * RelatedCommentCounts stores all the Comment Counts that will be stored on
 * each related document (like a Story, or a Site).
 */
export interface RelatedCommentCounts {
  /**
   * actionCounts stores all the action counts for all Comment's on this related
   * document.
   */
  action: EncodedCommentActionCounts;

  /**
   * commentCounts stores the different counts for each comment on the related
   * document according to their statuses.
   */
  status: CommentStatusCounts;

  /**
   * moderationQueue stores the number of Comments that exist in each of the
   * ModerationQueue's on this related document.
   */
  moderationQueue: CommentModerationQueueCounts;

  tags: CommentTagCounts;
}

/**
 * mergeCommentStatusCount will merge an array of commentStatusCount's into one.
 */
export function mergeCommentStatusCount(
  ...statusCounts: CommentStatusCounts[]
): CommentStatusCounts {
  const mergedStatusCounts = createEmptyCommentStatusCounts();
  for (const commentCounts of statusCounts) {
    for (const status in commentCounts) {
      if (!Object.prototype.hasOwnProperty.call(commentCounts, status)) {
        continue;
      }

      // Because the CommentStatusCounts are not indexable, it should be accessed
      // by walking the structure.
      switch (status) {
        case GQLCOMMENT_STATUS.APPROVED:
        case GQLCOMMENT_STATUS.NONE:
        case GQLCOMMENT_STATUS.PREMOD:
        case GQLCOMMENT_STATUS.REJECTED:
        case GQLCOMMENT_STATUS.SYSTEM_WITHHELD:
          mergedStatusCounts[status] += commentCounts[status];
          break;
        default:
          throw new Error("unrecognized status");
      }
    }
  }
  return mergedStatusCounts;
}

export function mergeCommentModerationQueueCount(
  ...moderationQueues: CommentModerationQueueCounts[]
): CommentModerationQueueCounts {
  const merged = createEmptyCommentModerationQueueCounts();

  for (const moderationQueue of moderationQueues) {
    merged.total += moderationQueue.total;
    merged.queues.unmoderated += moderationQueue.queues.unmoderated;
    merged.queues.pending += moderationQueue.queues.pending;
    merged.queues.reported += moderationQueue.queues.reported;
  }

  return merged;
}

export function mergeCommentTagCounts(
  ...tags: CommentTagCounts[]
): CommentTagCounts {
  const merged = createEmptyCommentTagCounts();

  for (const tagSet of tags) {
    merged.total += tagSet.total;

    merged.tags.ADMIN += tagSet.tags.ADMIN;
    merged.tags.EXPERT += tagSet.tags.EXPERT;
    merged.tags.FEATURED += tagSet.tags.FEATURED;
    merged.tags.MEMBER += tagSet.tags.MEMBER;
    merged.tags.MODERATOR += tagSet.tags.MODERATOR;
    merged.tags.QUESTION += tagSet.tags.QUESTION;
    merged.tags.REVIEW += tagSet.tags.REVIEW;
    merged.tags.STAFF += tagSet.tags.STAFF;
    merged.tags.UNANSWERED += tagSet.tags.UNANSWERED;
  }

  return merged;
}

/**
 * calculateTotalCommentCount will compute the total amount of comments left on
 * an Asset by parsing the `CommentStatusCounts`.
 */
export function calculateTotalCommentCount(
  commentCounts: CommentStatusCounts
): number {
  let count = 0;
  for (const status in commentCounts) {
    if (!Object.prototype.hasOwnProperty.call(commentCounts, status)) {
      continue;
    }

    // Because the CommentStatusCounts are not indexable, it should be accessed
    // by walking the structure.
    switch (status) {
      case GQLCOMMENT_STATUS.APPROVED:
      case GQLCOMMENT_STATUS.NONE:
      case GQLCOMMENT_STATUS.PREMOD:
      case GQLCOMMENT_STATUS.REJECTED:
      case GQLCOMMENT_STATUS.SYSTEM_WITHHELD:
        count += commentCounts[status];
        break;
      default:
        throw new Error("unrecognized status");
    }
  }
  return count;
}

/**
 * calculateTotalPublishedCommentCount will compute the total amount of
 * published comments in a story by parsing the `CommentStatusCounts`.
 */
export function calculateTotalPublishedCommentCount(
  commentCounts: CommentStatusCounts
) {
  return PUBLISHED_STATUSES.reduce(
    (total, status) => total + commentCounts[status],
    0
  );
}

interface RelatedCommentCountsDocument {
  id: string;
  tenantID: string;
  commentCounts: Partial<RelatedCommentCounts>;
}

export async function updateRelatedCommentCounts<
  T extends RelatedCommentCountsDocument
>(
  collection: Collection<T>,
  tenantID: string,
  id: string,
  commentCounts: DeepPartial<RelatedCommentCounts>
) {
  // Update all the specific comment moderation queue counts.
  const update: DeepPartial<RelatedCommentCountsDocument> = { commentCounts };

  // For each of the paths that we can update, we want to reduce it to a flat
  // object that's dotted (via dotize). We then use the `pickBy` with `identity`
  // to remove all the increment operations that are zero. This should leave
  // only increments that are positive or negative numbers.
  const $inc = pickBy(dotize(update), identity);

  // If th object is empty, then we don't actually have anything to increment,
  // lets return the object directly to stay consistent with the return API.
  if (isEmpty($inc)) {
    // Nothing needs to be incremented, just return the story.
    return collection.findOne({ id, tenantID });
  }

  logger.trace(
    { collection: collection.collectionName, tenantID, id, update: { $inc } },
    "updating related comment counts"
  );

  const result = await collection.findOneAndUpdate(
    { id, tenantID },
    { $inc },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return result.value || null;
}

export const negateCommentCounts = (options: {
  commentCounts: Readonly<RelatedCommentCounts>;
  negate: boolean;
}) => {
  const { commentCounts, negate } = options;
  const multiplier = negate ? -1 : 1;

  const result: RelatedCommentCounts = createEmptyRelatedCommentCounts();

  if (commentCounts.action) {
    for (const key in commentCounts.action) {
      if (Object.prototype.hasOwnProperty.call(commentCounts.action, key)) {
        const value = commentCounts.action[key];
        result.action[key] = value * multiplier;
      }
    }
  }

  if (commentCounts.moderationQueue) {
    result.moderationQueue.total =
      commentCounts.moderationQueue.total * multiplier;

    let key: keyof typeof commentCounts.moderationQueue.queues;
    for (key in commentCounts.moderationQueue.queues) {
      if (
        Object.prototype.hasOwnProperty.call(
          commentCounts.moderationQueue.queues,
          key
        )
      ) {
        const value = commentCounts.moderationQueue.queues[key];
        result.moderationQueue.queues[key] = value * multiplier;
      }
    }
  }

  if (commentCounts.status) {
    let key: keyof typeof commentCounts.status;
    for (key in commentCounts.status) {
      if (Object.prototype.hasOwnProperty.call(commentCounts.status, key)) {
        const value = commentCounts.status[key];
        result.status[key] = value * multiplier;
      }
    }
  }

  return result;
};
