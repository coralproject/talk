import { Db } from "mongodb";

import { Omit } from "coral-common/types";
import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";
import logger from "coral-server/logger";
import {
  createCommentModerationAction,
  CreateCommentModerationActionInput,
} from "coral-server/models/action/moderation/comment";
import { updateCommentStatus } from "coral-server/models/comment";
import { updateStoryCounts } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { AugmentedRedis } from "coral-server/services/redis";
import { calculateCountsDiff } from "./counts";

export type Moderate = Omit<CreateCommentModerationActionInput, "status">;

const moderate = (
  status: GQLCOMMENT_STATUS.ACCEPTED | GQLCOMMENT_STATUS.REJECTED
) => async (
  mongo: Db,
  redis: AugmentedRedis,
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
    // TODO: wrap in better error?
    throw new Error("specified comment not found");
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
      // Compute the queue difference as a result of the old status and the new
      // status.
      moderationQueue: calculateCountsDiff(
        {
          status: result.oldStatus,
          actionCounts: result.comment.actionCounts,
        },
        {
          status,
          actionCounts: result.comment.actionCounts,
        }
      ),
    }
  );
  if (!story) {
    // TODO: wrap in better error?
    throw new Error("specified story not found");
  }

  log.trace({ oldStatus: result.oldStatus }, "adjusted story comment counts");

  return result.comment;
};

export const accept = moderate(GQLCOMMENT_STATUS.ACCEPTED);

export const reject = moderate(GQLCOMMENT_STATUS.REJECTED);
