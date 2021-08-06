import { Db } from "mongodb";

import { EncodedCommentActionCounts } from "coral-server/models/action/comment";
import {
  Comment,
  CommentModerationQueueCounts,
  CommentStatusCounts,
  updateSharedCommentCounts,
} from "coral-server/models/comment";
import { updateSiteCounts } from "coral-server/models/site";
import { updateStoryCounts } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { updateUserCommentCounts } from "coral-server/models/user";
import {
  calculateCounts,
  calculateCountsDiff,
} from "coral-server/services/comments/moderation";
import { AugmentedRedis } from "coral-server/services/redis";

interface UpdateAllCommentCountsInput {
  tenant: Readonly<Tenant>;
  after: Readonly<Comment>;

  /**
   * actionCounts when provided will increment the related entries for an
   * operation that creates actions.
   */
  actionCounts: Readonly<EncodedCommentActionCounts>;

  /**
   * before when provided is used when a comment has been changed. A comment
   * that has just been created should not provide before.
   */
  before?: Readonly<Comment>;
}

function calculateModerationQueue(
  input: UpdateAllCommentCountsInput
): CommentModerationQueueCounts {
  if (input.before) {
    return calculateCountsDiff(input.before, input.after);
  }

  return calculateCounts(input.after);
}

function calculateStatus(
  input: UpdateAllCommentCountsInput
): Partial<CommentStatusCounts> {
  if (input.before) {
    if (input.before.status !== input.after.status) {
      return {
        [input.before.status]: -1,
        [input.after.status]: 1,
      };
    }

    return {};
  }

  return {
    [input.after.status]: 1,
  };
}

interface UpdateAllCommentCountsOptions {
  updateStory?: boolean;
  updateSite?: boolean;
  updateUser?: boolean;
  updateShared?: boolean;
}

export default async function updateAllCommentCounts(
  mongo: Db,
  redis: AugmentedRedis,
  input: UpdateAllCommentCountsInput,
  options: UpdateAllCommentCountsOptions = {
    updateStory: true,
    updateSite: true,
    updateUser: true,
    updateShared: true,
  }
) {
  // Compute the queue difference as a result of the old status and the new
  // status and the action counts.
  const moderationQueue = calculateModerationQueue(input);

  // Compute the status changes as a result of the change to the comment status.
  const status = calculateStatus(input);

  // Pull out some params from the input for easier usage.
  const {
    tenant,
    actionCounts: action,
    after: { storyID, authorID, siteID },
  } = input;

  if (options.updateStory) {
    // Update the story, site, and user comment counts.
    await updateStoryCounts(mongo, tenant.id, storyID, {
      action,
      status,
      moderationQueue,
    });
  }

  if (options.updateSite) {
    await updateSiteCounts(mongo, tenant.id, siteID, {
      action,
      status,
      moderationQueue,
    });
  }

  if (options.updateUser && authorID) {
    await updateUserCommentCounts(mongo, tenant.id, authorID, {
      status,
    });
  }

  if (options.updateShared) {
    // Update the shared counts.
    await updateSharedCommentCounts(redis, tenant.id, {
      action,
      status,
      moderationQueue,
    });
  }

  return {
    action,
    status,
    moderationQueue,
  };
}
