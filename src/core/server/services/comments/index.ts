import { DateTime } from "luxon";
import { Db } from "mongodb";

import { ERROR_TYPES } from "coral-common/errors";
import { Omit } from "coral-common/types";
import {
  CommentNotFoundError,
  CoralError,
  StoryNotFoundError,
} from "coral-server/errors";
import { GQLTAG } from "coral-server/graph/tenant/schema/__generated__/types";
import { Publisher } from "coral-server/graph/tenant/subscriptions/publisher";
import logger from "coral-server/logger";
import {
  encodeActionCounts,
  filterDuplicateActions,
} from "coral-server/models/action/comment";
import { createCommentModerationAction } from "coral-server/models/action/moderation/comment";
import {
  addCommentTag,
  createComment,
  CreateCommentInput,
  editComment,
  EditCommentInput,
  pushChildCommentIDOntoParent,
  removeCommentTag,
  retrieveComment,
  validateEditable,
} from "coral-server/models/comment";
import {
  getLatestRevision,
  hasAncestors,
  hasVisibleStatus,
} from "coral-server/models/comment/helpers";
import {
  retrieveStory,
  StoryCounts,
  updateStoryCounts,
} from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import {
  publishCommentCreated,
  publishCommentReplyCreated,
  publishCommentStatusChanges,
  publishModerationQueueChanges,
} from "coral-server/services/events";
import { AugmentedRedis } from "coral-server/services/redis";
import { Request } from "coral-server/types/express";

import { addCommentActions, CreateAction } from "./actions";
import { calculateCounts, calculateCountsDiff } from "./moderation/counts";
import { PhaseResult, processForModeration } from "./pipeline";

export type CreateComment = Omit<
  CreateCommentInput,
  "status" | "metadata" | "ancestorIDs" | "actionCounts" | "tags"
>;

export async function create(
  mongo: Db,
  redis: AugmentedRedis,
  publish: Publisher,
  tenant: Tenant,
  author: User,
  input: CreateComment,
  nudge: boolean,
  now = new Date(),
  req?: Request
) {
  let log = logger.child({
    authorID: author.id,
    tenantID: tenant.id,
    storyID: input.storyID,
    parentID: input.parentID,
    nudge,
  });

  // TODO: (wyattjoh) perform rate limiting based on the user?

  log.trace("creating comment on story");

  // Grab the story that we'll use to check moderation pieces with.
  const story = await retrieveStory(mongo, tenant.id, input.storyID);
  if (!story) {
    throw new StoryNotFoundError(input.storyID);
  }

  const ancestorIDs: string[] = [];
  if (input.parentID) {
    // Check to see that the reference parent ID exists.
    const parent = await retrieveComment(mongo, tenant.id, input.parentID);
    if (!parent) {
      throw new CommentNotFoundError(input.parentID);
    }

    // Check that the parent comment was visible.
    if (!hasVisibleStatus(parent)) {
      throw new CommentNotFoundError(parent.id);
    }

    ancestorIDs.push(input.parentID);
    if (hasAncestors(parent)) {
      // Push the parent's ancestors id's into the comment's ancestor id's.
      ancestorIDs.push(...parent.ancestorIDs);
    }

    log.trace(
      { ancestorIDs: ancestorIDs.length },
      "pushed parent ancestorIDs into comment"
    );
  }

  let result: PhaseResult;

  try {
    // Run the comment through the moderation phases.
    result = await processForModeration({
      mongo,
      nudge,
      story,
      tenant,
      comment: input,
      author,
      req,
      now,
    });
  } catch (err) {
    if (
      err instanceof CoralError &&
      err.type === ERROR_TYPES.MODERATION_NUDGE_ERROR
    ) {
      log.info({ err }, "detected pipeline nudge");
    }

    throw err;
  }

  const { actions, body, status, metadata, tags } = result;

  // This is the first time this comment is being published.. So we need to
  // ensure we don't run into any race conditions when we create the comment.
  // One of the situations where we could encounter a race is when the comment
  // is created, and does not have it's flag data associated with it. This would
  // cause the comment to not be added to the flagged queue. If a flag is
  // pending, and a user flags this comment before the next step can proceed,
  // then we would end up double adding the comment to the flagged queue.
  // Instead, we need to add the action metadata to the comment before we add it
  // for the first time to ensure that the data is there for when the next flag
  // is added, that it can already know that the comment is already in the
  // queue.
  let actionCounts = {};
  if (actions.length > 0) {
    // Determine the unique actions, we will use this to compute the comment
    // action counts. This should match what is added below.
    const deDuplicatedActions = filterDuplicateActions(actions);

    // Encode the action counts.
    actionCounts = encodeActionCounts(...deDuplicatedActions);
  }

  // Create the comment!
  const comment = await createComment(
    mongo,
    tenant.id,
    {
      ...input,
      tags,
      body,
      status,
      ancestorIDs,
      metadata,
      actionCounts,
    },
    now
  );

  // Pull the revision out.
  const revision = getLatestRevision(comment);

  log = log.child({ commentID: comment.id, status, revisionID: revision.id });

  log.trace("comment created");

  if (input.parentID) {
    // Push the child's ID onto the parent.
    await pushChildCommentIDOntoParent(
      mongo,
      tenant.id,
      input.parentID,
      comment.id
    );

    log.trace("pushed child comment id onto parent");
  }

  if (actions.length > 0) {
    // Actually add the actions to the database. This will not interact with the
    // counts at all.
    const upsertedActions = await addCommentActions(
      mongo,
      tenant,
      actions.map(
        (action): CreateAction => ({
          ...action,
          commentID: comment.id,
          commentRevisionID: revision.id,

          // Store the Story ID on the action.
          storyID: story.id,
        })
      ),
      now
    );

    log.trace({ actions: upsertedActions.length }, "added actions to comment");
  }
  const moderationQueue = calculateCounts(comment);

  // Publish changes.
  publishModerationQueueChanges(publish, moderationQueue, comment);

  // If this is a reply, publish it.
  if (input.parentID) {
    publishCommentReplyCreated(publish, comment);
  }

  // If this comment is visible (and not a reply), publish it.
  if (!input.parentID && hasVisibleStatus(comment)) {
    publishCommentCreated(publish, comment);
  }

  // Compile the changes we want to apply to the story counts.
  const storyCounts: Required<Omit<StoryCounts, "action">> = {
    // This is a new comment, so we need to increment for this status.
    status: { [status]: 1 },
    // This comment is being created, so we can compute it raw from the comment
    // that we created.
    moderationQueue,
  };

  log.trace({ storyCounts }, "updating story status counts");

  // Increment the status count for the particular status on the Story.
  await updateStoryCounts(mongo, redis, tenant.id, story.id, storyCounts);

  return comment;
}

export type EditComment = Omit<
  EditCommentInput,
  "status" | "authorID" | "lastEditableCommentCreatedAt" | "metadata"
>;

export async function edit(
  mongo: Db,
  redis: AugmentedRedis,
  publish: Publisher,
  tenant: Tenant,
  author: User,
  input: EditComment,
  now = new Date(),
  req?: Request
) {
  let log = logger.child({ commentID: input.id, tenantID: tenant.id });

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
    mongo,
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

  log = log.child({ revisionID: newRevision.id });

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

  // Compile the changes we want to apply to the story counts.
  const storyCounts: Required<Omit<StoryCounts, "action">> = {
    // Status is updated below if it has been changed.
    status: {},
    moderationQueue,
  };

  if (oldComment.status !== editedComment.status) {
    // Increment the status count for the particular status on the Story, and
    // decrement the status on the comment's previous status. The old comment
    // status was only there before the atomic mutation. The new status is based
    // on the moderation pipeline.
    storyCounts.status[oldComment.status] = -1;
    storyCounts.status[status] = 1;

    // The comment status changed as a result of a pipeline operation, create a
    // moderation action as a result.
    await createCommentModerationAction(mongo, tenant.id, {
      commentID: editedComment.id,
      commentRevisionID: newRevision.id,
      status: editedComment.status,
      moderatorID: null,
    });
  }

  log.trace({ storyCounts }, "updating story status counts");

  // Update the story counts as a result.
  await updateStoryCounts(mongo, redis, tenant.id, story.id, storyCounts);

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

/**
 * getCommentEditableUntilDate will return the date that the given comment is
 * still editable until.
 *
 * @param tenant the tenant that contains settings related editing
 * @param createdAt the date that is the base, defaulting to the current time
 */
export function getCommentEditableUntilDate(
  tenant: Pick<Tenant, "editCommentWindowLength">,
  createdAt: Date
): Date {
  return (
    DateTime.fromJSDate(createdAt)
      // editCommentWindowLength is in seconds, so multiply by 1000 to get
      // milliseconds.
      .plus(tenant.editCommentWindowLength * 1000)
      .toJSDate()
  );
}

export async function addTag(
  mongo: Db,
  tenant: Tenant,
  commentID: string,
  commentRevisionID: string,
  user: User,
  tagType: GQLTAG,
  now = new Date()
) {
  const comment = await retrieveComment(mongo, tenant.id, commentID);
  if (!comment) {
    throw new CommentNotFoundError(commentID);
  }

  // Check to see if the selected comment revision is the latest one.
  const revision = getLatestRevision(comment);
  if (revision.id !== commentRevisionID) {
    throw new Error("revision id does not match latest revision");
  }

  // Check to see if this tag is already on this comment.
  if (comment.tags.some(({ type }) => type === tagType)) {
    return comment;
  }

  return addCommentTag(mongo, tenant.id, commentID, {
    type: tagType,
    createdBy: user.id,
    createdAt: now,
  });
}

export async function removeTag(
  mongo: Db,
  tenant: Tenant,
  commentID: string,
  tagType: GQLTAG
) {
  const comment = await retrieveComment(mongo, tenant.id, commentID);
  if (!comment) {
    throw new CommentNotFoundError(commentID);
  }

  // Check to see if this tag is even on this comment.
  if (comment.tags.every(({ type }) => type !== tagType)) {
    return comment;
  }

  return removeCommentTag(mongo, tenant.id, commentID, tagType);
}
