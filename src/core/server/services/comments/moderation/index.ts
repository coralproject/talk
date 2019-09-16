import { Db } from "mongodb";

import { Omit } from "coral-common/types";
import { CommentNotFoundError, StoryNotFoundError } from "coral-server/errors";
import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";
import { Publisher } from "coral-server/graph/tenant/subscriptions/publisher";
import logger from "coral-server/logger";
import {
  createCommentModerationAction,
  CreateCommentModerationActionInput,
} from "coral-server/models/action/moderation/comment";
import { updateCommentStatus } from "coral-server/models/comment";
import { updateStoryCounts } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import {
  publishCommentReleased,
  publishCommentStatusChanges,
  publishModerationQueueChanges,
} from "coral-server/services/events";
import { AugmentedRedis } from "coral-server/services/redis";

import { calculateCountsDiff } from "./counts";

export type Moderate = Omit<CreateCommentModerationActionInput, "status">;

const moderate = (
  status: GQLCOMMENT_STATUS.APPROVED | GQLCOMMENT_STATUS.REJECTED
) => async (
  mongo: Db,
  redis: AugmentedRedis,
  publish: Publisher,
  tenant: Tenant,
  input: Moderate
) => {
  // TODO: wrap these operations in a transaction?

  // Create the logger.
  const log = logger.child({
    ...input,
    tenantID: tenant.id,
    newStatus: status,
  });

  // Update the Comment's status.
  const result = await updateCommentStatus(
    mongo,
    tenant.id,
    input.commentID,
    input.commentRevisionID,
    status
  );
  if (!result) {
    throw new CommentNotFoundError(input.commentID, input.commentRevisionID);
  }

  log.trace("updated comment status");

  // Create the moderation action in the audit log.
  const action = await createCommentModerationAction(mongo, tenant.id, {
    ...input,
    status,
  });
  if (!action) {
    // TODO: wrap in better error?
    throw new Error("could not create moderation action");
  }

  log.trace(
    { commentModerationActionID: action.id },
    "created the moderation action"
  );

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

  // Publish changes.
  publishModerationQueueChanges(publish, moderationQueue, result.comment);
  publishCommentStatusChanges(
    publish,
    result.oldStatus,
    status,
    result.comment.id,
    input.moderatorID
  );
  if (result.oldStatus === "PREMOD" && status === "APPROVED") {
    publishCommentReleased(publish, result.comment);
  }

  log.trace({ oldStatus: result.oldStatus }, "adjusted story comment counts");

  return result.comment;
};

export const approve = moderate(GQLCOMMENT_STATUS.APPROVED);

export const reject = moderate(GQLCOMMENT_STATUS.REJECTED);
