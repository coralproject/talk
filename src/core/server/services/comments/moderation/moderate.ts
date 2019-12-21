import { Db } from "mongodb";

import { CommentNotFoundError } from "coral-server/errors";
import {
  createCommentModerationAction,
  CreateCommentModerationActionInput,
} from "coral-server/models/action/moderation/comment";
import { updateCommentStatus } from "coral-server/models/comment";
import { Tenant } from "coral-server/models/tenant";

export type Moderate = CreateCommentModerationActionInput;

export default async function moderate(
  mongo: Db,
  tenant: Tenant,
  input: Moderate,
  now: Date
) {
  // TODO: wrap these operations in a transaction?

  // Create the moderation action in the audit log.
  const action = await createCommentModerationAction(
    mongo,
    tenant.id,
    input,
    now
  );
  if (!action) {
    // TODO: wrap in better error?
    throw new Error("could not create moderation action");
  }

  // Update the Comment's status.
  const result = await updateCommentStatus(
    mongo,
    tenant.id,
    input.commentID,
    input.commentRevisionID,
    input.status
  );
  if (!result) {
    throw new CommentNotFoundError(input.commentID, input.commentRevisionID);
  }

  return result;
}
