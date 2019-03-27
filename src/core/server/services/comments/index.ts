import { DateTime } from "luxon";
import { Db } from "mongodb";

import { Omit } from "talk-common/types";
import logger from "talk-server/logger";
import {
  encodeActionCounts,
  filterDuplicateActions,
} from "talk-server/models/action/comment";
import {
  createComment,
  CreateCommentInput,
  editComment,
  EditCommentInput,
  getLatestRevision,
  pushChildCommentIDOntoParent,
  retrieveComment,
  validateEditable,
} from "talk-server/models/comment";
import {
  retrieveStory,
  StoryCounts,
  updateStoryCounts,
} from "talk-server/models/story";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import { Request } from "talk-server/types/express";

import { ERROR_TYPES } from "talk-common/errors";
import {
  CommentNotFoundError,
  StoryNotFoundError,
  TalkError,
} from "talk-server/errors";
import { AugmentedRedis } from "../redis";
import { addCommentActions, CreateAction } from "./actions";
import { calculateCounts, calculateCountsDiff } from "./moderation/counts";
import { PhaseResult, processForModeration } from "./pipeline";

export type CreateComment = Omit<
  CreateCommentInput,
  "status" | "metadata" | "grandparentIDs" | "actionCounts" | "tags"
>;

export async function create(
  mongo: Db,
  redis: AugmentedRedis,
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

  const grandparentIDs: string[] = [];
  if (input.parentID) {
    // Check to see that the reference parent ID exists.
    const parent = await retrieveComment(mongo, tenant.id, input.parentID);
    if (!parent) {
      throw new CommentNotFoundError(input.parentID);
    }

    // FIXME: (wyattjoh) Check that the parent comment was visible!

    // Push the parent's parent id's into the comment's grandparent id's.
    grandparentIDs.push(...parent.grandparentIDs);
    if (parent.parentID) {
      // If this parent has a parent, push it down as well.
      grandparentIDs.push(parent.parentID);
    }

    log.trace(
      { grandparentIDs: grandparentIDs.length },
      "pushed grandparent id's into comment creation"
    );
  }

  let result: PhaseResult;

  try {
    // Run the comment through the moderation phases.
    result = await processForModeration({
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
      err instanceof TalkError &&
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
      grandparentIDs,
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

  // Compile the changes we want to apply to the story counts.
  const storyCounts: Required<Omit<StoryCounts, "action">> = {
    // This is a new comment, so we need to increment for this status.
    status: { [status]: 1 },
    // This comment is being created, so we can compute it raw from the comment
    // that we created.
    moderationQueue: calculateCounts(comment),
  };

  log.trace({ storyCounts }, "updating story status counts");

  // Increment the status count for the particular status on the Story.
  await updateStoryCounts(mongo, redis, tenant.id, story.id, storyCounts);

  return comment;
}

export type EditComment = Omit<
  EditCommentInput,
  "status" | "authorID" | "lastEditableCommentCreatedAt"
>;

export async function edit(
  mongo: Db,
  redis: AugmentedRedis,
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

  // Compile the changes we want to apply to the story counts.
  const storyCounts: Required<Omit<StoryCounts, "action">> = {
    // Status is updated below if it has been changed.
    status: {},
    // Compute the changes in queue counts. This looks at the action counts that
    // are encoded, as well as the comment status's. We however may have had the
    // comment status when we grabbed the updated comment after changing the
    // action counts, so we extract the action counts out of the edited comment
    // and use the status from the moderation decision.
    moderationQueue: calculateCountsDiff(oldComment, {
      status,
      actionCounts: editedComment.actionCounts,
    }),
  };

  if (oldComment.status !== editedComment.status) {
    // Increment the status count for the particular status on the Story, and
    // decrement the status on the comment's previous status. The old comment
    // status was only there before the atomic mutation. The new status is based
    // on the moderation pipeline.
    storyCounts.status[oldComment.status] = -1;
    storyCounts.status[status] = 1;
  }

  log.trace({ storyCounts }, "updating story status counts");

  // Update the story counts as a result.
  await updateStoryCounts(mongo, redis, tenant.id, story.id, storyCounts);

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
