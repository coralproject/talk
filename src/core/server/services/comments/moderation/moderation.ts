import { Db } from "mongodb";

import { Omit } from "coral-common/types";
import { CommentNotFoundError } from "coral-server/errors";
import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";
import { Logger } from "coral-server/logger";
import {
  createCommentModerationAction,
  CreateCommentModerationActionInput,
} from "coral-server/models/action/moderation/comment";
import { updateCommentStatus } from "coral-server/models/comment";
import { Tenant } from "coral-server/models/tenant";

export type Moderate = Omit<CreateCommentModerationActionInput, "status">;

const moderate = (
  status: GQLCOMMENT_STATUS.APPROVED | GQLCOMMENT_STATUS.REJECTED
) => async (
  mongo: Db,
  tenant: Tenant,
  input: Moderate,
  now: Date,
  log: Logger
) => {
  // TODO: wrap these operations in a transaction?

  // Create the moderation action in the audit log.
  const action = await createCommentModerationAction(
    mongo,
    tenant.id,
    {
      ...input,
      status,
    },
    now
  );
  if (!action) {
    // TODO: wrap in better error?
    throw new Error("could not create moderation action");
  }

  log.trace(
    { commentModerationActionID: action.id },
    "created the moderation action"
  );

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

  return result;
};

export const approve = moderate(GQLCOMMENT_STATUS.APPROVED);

export const reject = moderate(GQLCOMMENT_STATUS.REJECTED);
