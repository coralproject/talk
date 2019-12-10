import { Db } from "mongodb";

import { StoryNotFoundError, UserNotFoundError } from "coral-server/errors";
import { Publisher } from "coral-server/graph/tenant/subscriptions/publisher";
import { Logger } from "coral-server/logger";
import { UpdateCommentStatus } from "coral-server/models/comment";
import { updateStoryCounts } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { calculateCountsDiff } from "coral-server/services/comments/moderation";
import { AugmentedRedis } from "coral-server/services/redis";

import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";

import { updateUserCommentCounts } from "../counts/updateUserCommentCounts";
import publishChanges from "./publishChanges";

const updateCounts = async (
  mongo: Db,
  redis: AugmentedRedis,
  publisher: Publisher,
  tenant: Tenant,
  result: UpdateCommentStatus,
  status: GQLCOMMENT_STATUS,
  moderatorID: string | null,
  log: Logger
) => {
  // Compute the queue difference as a result of the old status and the new
  // status.
  const moderationQueue = calculateCountsDiff(
    {
      status: result.oldStatus,
      actionCounts: result.comment.actionCounts,
    },
    {
      status,
      actionCounts: result.comment.actionCounts,
    }
  );

  // Update the story comment counts.
  const story = await updateStoryCounts(
    mongo,
    redis,
    tenant.id,
    result.comment.storyID,
    {
      // Update the comment counts.
      status: {
        [result.oldStatus]: -1,
        [status]: 1,
      },

      moderationQueue,
    }
  );
  if (!story) {
    throw new StoryNotFoundError(result.comment.storyID);
  }

  const user = await updateUserCommentCounts(
    mongo,
    tenant.id,
    result.comment.authorID,
    {
      status: {
        [result.oldStatus]: -1,
        [status]: 1,
      },
    }
  );
  if (!user) {
    throw new UserNotFoundError(result.comment.authorID);
  }

  await publishChanges(
    publisher,
    moderationQueue,
    result.comment,
    result.oldStatus,
    status,
    moderatorID,
    log
  );
};

export default updateCounts;
