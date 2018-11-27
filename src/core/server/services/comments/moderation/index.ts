import { Db } from "mongodb";

import { Omit } from "talk-common/types";
import { GQLCOMMENT_STATUS } from "talk-server/graph/tenant/schema/__generated__/types";
import logger from "talk-server/logger";
import {
  createCommentModerationAction,
  CreateCommentModerationActionInput,
} from "talk-server/models/action/moderation/comment";
import { updateCommentStatus } from "talk-server/models/comment";
import { updateStoryCounts } from "talk-server/models/story";
import { Tenant } from "talk-server/models/tenant";
import { calculateCountsDiff } from "./counts";

export type Moderate = Omit<CreateCommentModerationActionInput, "status">;

const moderate = (
  status: GQLCOMMENT_STATUS.ACCEPTED | GQLCOMMENT_STATUS.REJECTED
) => async (mongo: Db, tenant: Tenant, input: Moderate) => {
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
