export * from "./empty";
export * from "./shared";

import { identity, isEmpty, pickBy } from "lodash";
import { Db } from "mongodb";

import { DeepPartial } from "coral-common/types";
import { dotize } from "coral-common/utils/dotize";
import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";
import logger from "coral-server/logger";
import { EncodedCommentActionCounts } from "coral-server/models/action/comment";
import { PUBLISHED_STATUSES } from "coral-server/models/comment/constants";
import {
  CommentStatusCounts,
  createEmptyCommentStatusCounts,
} from "coral-server/models/comment/helpers";
import { retrieveStory, Story } from "coral-server/models/story";
import { stories as collection } from "coral-server/services/mongodb/collections";
import { AugmentedRedis } from "coral-server/services/redis";

import { updateSharedCommentCounts } from "./shared";

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

/**
 * StoryCommentCounts stores all the Comment Counts that will be stored on each
 * Story.
 */
export interface StoryCommentCounts {
  /**
   * actionCounts stores all the action counts for all Comment's on this Story.
   */
  action: EncodedCommentActionCounts;

  /**
   * commentCounts stores the different counts for each comment on the Story
   * according to their statuses.
   */
  status: CommentStatusCounts;

  /**
   * moderationQueue stores the number of Comments that exist in
   * each of the ModerationQueue's on this Story.
   */
  moderationQueue: CommentModerationQueueCounts;
}

/**
 * updateStoryCommentStatusCount will update a given Story's status counts.
 *
 * @param mongo database handle
 * @param redis redis database handle
 * @param tenantID ID of the Tenant where this Story is
 * @param id ID of the Story where we're updating the counts
 * @param status the set of counts that we will update
 */
export const updateStoryCommentStatusCount = (
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  id: string,
  status: Partial<CommentStatusCounts>
) => updateStoryCounts(mongo, redis, tenantID, id, { status });

/**
 * updateStoryCommentModerationQueueCounts will update the moderation queue
 * counts on a Story.
 *
 * @param mongo mongo database handle
 * @param redis redis database handle
 * @param tenantID ID of the Tenant where this Story is
 * @param id ID of the Story where we're updating the counts
 * @param moderationQueue the set of counts that we will update
 */
export const updateStoryCommentModerationQueueCounts = (
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  id: string,
  moderationQueue: DeepPartial<CommentModerationQueueCounts>
) => updateStoryCounts(mongo, redis, tenantID, id, { moderationQueue });

export const updateStoryActionCounts = (
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  id: string,
  action: EncodedCommentActionCounts
) => updateStoryCounts(mongo, redis, tenantID, id, { action });

/**
 * updateStoryCounts will update the comment counts for the story indicated.
 *
 * @param mongo mongodb database handle
 * @param redis redis database handle
 * @param tenantID ID of the Tenant where the Story is on
 * @param id the ID of the Story that we are updating counts on
 * @param commentCounts the counts that we are updating
 */
export async function updateStoryCounts(
  mongo: Db,
  redis: AugmentedRedis,
  tenantID: string,
  id: string,
  commentCounts: DeepPartial<StoryCommentCounts>
) {
  // Update all the specific comment moderation queue counts.
  const update: DeepPartial<Story> = { commentCounts };
  const $inc = pickBy(dotize(update), identity);
  if (isEmpty($inc)) {
    // Nothing needs to be incremented, just return the story.
    return retrieveStory(mongo, tenantID, id);
  }

  logger.trace({ update: { $inc } }, "incrementing story counts");

  const result = await collection(mongo).findOneAndUpdate(
    { id, tenantID },
    { $inc },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  // Update the shared counts.
  await updateSharedCommentCounts(redis, tenantID, commentCounts);

  return result.value || null;
}

/**
 * mergeCommentStatusCount will merge an array of commentStatusCount's into one.
 */
export function mergeCommentStatusCount(
  statusCounts: CommentStatusCounts[]
): CommentStatusCounts {
  const mergedStatusCounts = createEmptyCommentStatusCounts();
  for (const commentCounts of statusCounts) {
    for (const status in commentCounts) {
      if (!commentCounts.hasOwnProperty(status)) {
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

/**
 * calculateTotalCommentCount will compute the total amount of comments left on
 * an Asset by parsing the `CommentStatusCounts`.
 */
export function calculateTotalCommentCount(
  commentCounts: CommentStatusCounts
): number {
  let count = 0;
  for (const status in commentCounts) {
    if (!commentCounts.hasOwnProperty(status)) {
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
