import { MongoContext } from "coral-server/data/context";
import {
  CommentNotFoundError,
  CommentRevisionNotFoundError,
} from "coral-server/errors";
import { EncodedCommentActionCounts } from "coral-server/models/action/comment";
import {
  createCommentModerationAction,
  CreateCommentModerationActionInput,
} from "coral-server/models/action/moderation/comment";
import {
  getLatestRevision,
  hasRevision,
  retrieveComment,
  updateCommentStatus,
} from "coral-server/models/comment";
import { Tenant } from "coral-server/models/tenant";
import { AugmentedRedis } from "coral-server/services/redis";
import { updateAllCommentCounts } from "coral-server/stacks/helpers";

export type Moderate = Omit<CreateCommentModerationActionInput, "storyID">;

export default async function moderate(
  mongo: MongoContext,
  redis: AugmentedRedis,
  tenant: Tenant,
  input: Moderate,
  now: Date,
  isArchived = false,
  updateAllCommentCountsArgs: {
    actionCounts: Readonly<EncodedCommentActionCounts>;
    options?: {
      updateShared: boolean;
      updateStory: boolean;
      updateSite: boolean;
      updateUser: boolean;
    };
  }
) {
  // TODO: wrap these operations in a transaction?
  const commentsColl =
    isArchived && mongo.archive ? mongo.archivedComments() : mongo.comments();

  // Get the comment that we're moderating.
  const comment = await retrieveComment(
    commentsColl,
    tenant.id,
    input.commentID
  );
  if (!comment) {
    throw new CommentNotFoundError(input.commentID);
  }

  // Get the latest revision on that comment.
  const revision = getLatestRevision(comment);

  // Ensure that the latest revision is the same revision that we're moderating.
  if (revision.id !== input.commentRevisionID) {
    // The revision has been updated since then! Ensure that this revision ID
    // does exist.
    if (!hasRevision(comment, input.commentRevisionID)) {
      throw new CommentRevisionNotFoundError(
        input.commentID,
        input.commentRevisionID
      );
    }

    // The comment has this revision, it just isn't the latest one. Return the
    // same comment back because we didn't modify anything.
    return { result: { before: comment, after: null } };
  }

  // TODO: (wyattjoh) this is a pretty race condition prone check here, replace
  // with a more concrete query that can prevent the comment being edited in the
  // time it takes to go from the above block to the next block.

  // Update the Comment's status.
  const result = await updateCommentStatus(
    mongo,
    tenant.id,
    input.commentID,
    input.commentRevisionID,
    input.status,
    isArchived
  );
  if (!result) {
    throw new CommentRevisionNotFoundError(
      input.commentID,
      input.commentRevisionID
    );
  }

  // Create the moderation action in the audit log.
  const action = await createCommentModerationAction(
    mongo,
    tenant.id,
    {
      ...input,
      storyID: comment.storyID,
    },
    now,
    isArchived
  );
  if (!action) {
    // TODO: wrap in better error?
    throw new Error("could not create moderation action");
  }

  // update the comment counts
  const counts = await updateAllCommentCounts(
    mongo,
    redis,
    {
      ...result,
      tenant,
      actionCounts: updateAllCommentCountsArgs.actionCounts,
    },
    updateAllCommentCountsArgs.options
  );

  return { result, counts };
}
