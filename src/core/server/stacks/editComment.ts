import { DateTime } from "luxon";
import { Db } from "mongodb";

import { Omit } from "coral-common/types";
import { Config } from "coral-server/config";
import {
  CommentNotFoundError,
  StoryNotFoundError,
  UserNotFoundError,
} from "coral-server/errors";
import { Publisher } from "coral-server/graph/tenant/subscriptions/publisher";
import logger from "coral-server/logger";
import {
  encodeActionCounts,
  filterDuplicateActions,
} from "coral-server/models/action/comment";
import { createCommentModerationAction } from "coral-server/models/action/moderation/comment";
import {
  CreateCommentInput,
  editComment,
  EditCommentInput,
  retrieveComment,
  validateEditable,
} from "coral-server/models/comment";
import {
  retrieveStory,
  StoryCounts,
  updateStoryCounts,
} from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import {
  publishCommentStatusChanges,
  publishModerationQueueChanges,
} from "coral-server/services/events";
import { AugmentedRedis } from "coral-server/services/redis";
import { Request } from "coral-server/types/express";

import {
  addCommentActions,
  CreateAction,
} from "coral-server/services/comments/actions";
import { calculateCountsDiff } from "coral-server/services/comments/moderation/counts";
import { processForModeration } from "coral-server/services/comments/pipeline";

import { updateUserCommentCounts } from "./counts/updateUserCommentCounts";

export type CreateComment = Omit<
  CreateCommentInput,
  "status" | "metadata" | "ancestorIDs" | "actionCounts" | "tags"
>;

export type EditComment = Omit<
  EditCommentInput,
  "status" | "authorID" | "lastEditableCommentCreatedAt" | "metadata"
>;

export default async function edit(
  mongo: Db,
  redis: AugmentedRedis,
  config: Config,
  publish: Publisher,
  tenant: Tenant,
  author: User,
  input: EditComment,
  now = new Date(),
  req?: Request
) {
  let log = logger.child({ commentID: input.id, tenantID: tenant.id }, true);

  // Get the comment that we're editing. This comment is considered stale,
  // because it wasn't involved in the atomic transaction.
  const originalStaleComment = await retrieveComment(
    mongo,
    tenant.id,
    input.id
  );
  if (!originalStaleComment) {
    throw new CommentNotFoundError(input.id);
  }

  // The editable time is based on the current time, and the edit window
  // length. By subtracting the current date from the edit window length, we
  // get the maximum value for the `createdAt` time that would be permitted
  // for the comment edit to succeed.
  const lastEditableCommentCreatedAt = getLastCommentEditableUntilDate(
    tenant,
    now
  );

  // Validate and potentially return with a more useful error.
  validateEditable(originalStaleComment, {
    authorID: author.id,
    lastEditableCommentCreatedAt,
  });

  // Grab the story that we'll use to check moderation pieces with.
  const story = await retrieveStory(
    mongo,
    tenant.id,
    originalStaleComment.storyID
  );
  if (!story) {
    throw new StoryNotFoundError(originalStaleComment.storyID);
  }

  // Run the comment through the moderation phases.
  const { body, status, metadata, actions } = await processForModeration({
    action: "EDIT",
    log,
    mongo,
    redis,
    config,
    story,
    tenant,
    comment: input,
    author,
    req,
    now,
  });

  let actionCounts = {};
  if (actions.length > 0) {
    // Encode the new action counts that are going to be added to the new
    // revision.
    actionCounts = encodeActionCounts(...filterDuplicateActions(actions));
  }

  log.trace(
    { predictedActionCounts: actionCounts },
    "associating action counts with comment"
  );

  // Perform the edit.
  const result = await editComment(
    mongo,
    tenant.id,
    {
      id: input.id,
      authorID: author.id,
      body,
      status,
      metadata,
      actionCounts,
      lastEditableCommentCreatedAt,
    },
    now
  );
  if (!result) {
    throw new CommentNotFoundError(input.id);
  }

  // Pull the old/edited comments out of the edit result.
  const { oldComment, editedComment, newRevision } = result;

  log = log.child({ revisionID: newRevision.id }, true);

  if (actions.length > 0) {
    // Insert and handle creating the actions.
    const upsertedActions = await addCommentActions(
      mongo,
      tenant,
      actions.map(
        (action): CreateAction => ({
          ...action,
          commentID: editedComment.id,
          commentRevisionID: newRevision.id,
          storyID: story.id,
        })
      ),
      now
    );

    log.trace(
      {
        actualActionCounts: encodeActionCounts(...upsertedActions),
        actions: upsertedActions.length,
      },
      "added actions to comment"
    );
  }

  // Compute the changes in queue counts. This looks at the action counts that
  // are encoded, as well as the comment status's. We however may have had the
  // comment status when we grabbed the updated comment after changing the
  // action counts, so we extract the action counts out of the edited comment
  // and use the status from the moderation decision.
  const moderationQueue = calculateCountsDiff(oldComment, {
    status,
    actionCounts: editedComment.actionCounts,
  });

  if (oldComment.status !== editedComment.status) {
    // Compile the changes we want to apply to the story counts.
    const storyCounts: Required<Omit<StoryCounts, "action">> = {
      // Status is updated below if it has been changed.
      status: {},
      moderationQueue,
    };

    // Increment the status count for the particular status on the Story, and
    // decrement the status on the comment's previous status. The old comment
    // status was only there before the atomic mutation. The new status is based
    // on the moderation pipeline.
    storyCounts.status[oldComment.status] = -1;
    storyCounts.status[status] = 1;

    // The comment status changed as a result of a pipeline operation, create a
    // moderation action as a result.
    await createCommentModerationAction(
      mongo,
      tenant.id,
      {
        commentID: editedComment.id,
        commentRevisionID: newRevision.id,
        status: editedComment.status,
        moderatorID: null,
      },
      now
    );

    log.trace({ storyCounts }, "updating story status counts");

    // Update the story counts as a result.
    await updateStoryCounts(mongo, redis, tenant.id, story.id, storyCounts);

    // Increment user comment status counts
    const user = await updateUserCommentCounts(
      mongo,
      tenant.id,
      editedComment.authorID,
      {
        status: {
          [oldComment.status]: -1,
          [editedComment.status]: 1,
        },
      }
    );
    if (!user) {
      throw new UserNotFoundError(editedComment.authorID);
    }
  }

  // Publish changes.
  publishModerationQueueChanges(publish, moderationQueue, editedComment);
  publishCommentStatusChanges(
    publish,
    oldComment.status,
    editedComment.status,
    editedComment.id,
    // This is a comment that was edited, so it should not present a moderator.
    null
  );

  return editedComment;
}

/**
 * getLastCommentEditableUntilDate will return the `createdAt` date that will
 * represent the _oldest_ date that a comment could have been created on in
 * order to still be editable.
 *
 * @param tenant the tenant that contains settings related editing
 * @param now the date that is the base, defaulting to the current time
 */
export function getLastCommentEditableUntilDate(
  tenant: Pick<Tenant, "editCommentWindowLength">,
  now = new Date()
): Date {
  return (
    DateTime.fromJSDate(now)
      // editCommentWindowLength is in seconds, so multiply by 1000 to get
      // milliseconds.
      .minus(tenant.editCommentWindowLength * 1000)
      .toJSDate()
  );
}
