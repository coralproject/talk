import { Db } from "mongodb";

import { Comment, CommentStatusCounts } from "coral-server/models/comment";
import {
  CommentModerationQueueCounts,
  updateStoryCounts,
} from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { updateUserCommentCounts } from "coral-server/models/user";
import {
  calculateCounts,
  calculateCountsDiff,
} from "coral-server/services/comments/moderation";
import { AugmentedRedis } from "coral-server/services/redis";

interface UpdateAllCountsInput {
  tenant: Readonly<Tenant>;
  before?: Readonly<Comment>;
  after: Readonly<Comment>;
}

function calculateModerationQueue(
  input: UpdateAllCountsInput
): CommentModerationQueueCounts {
  if (input.before) {
    return calculateCountsDiff(input.before, input.after);
  }

  return calculateCounts(input.after);
}

function calculateStatus(
  input: UpdateAllCountsInput
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

export default async function updateAllCounts(
  mongo: Db,
  redis: AugmentedRedis,
  input: UpdateAllCountsInput
) {
  // Compute the queue difference as a result of the old status and the new
  // status and the action counts.
  const moderationQueue = calculateModerationQueue(input);

  // Compute the status changes as a result of the change to the comment status.
  const status = calculateStatus(input);

  // Pull out some params from the input for easier usage.
  const {
    tenant,
    after: { storyID, authorID },
  } = input;

  // Update the story comment counts.
  await updateStoryCounts(mongo, redis, tenant.id, storyID, {
    status,
    moderationQueue,
  });

  if (authorID) {
    // Update the user comment counts.
    await updateUserCommentCounts(mongo, tenant.id, authorID, {
      status,
    });
  }

  return {
    status,
    moderationQueue,
  };
}
