import { Db } from "mongodb";

import { Omit } from "talk-common/types";
import { GQLCOMMENT_FLAG_REPORTED_REASON } from "talk-server/graph/tenant/schema/__generated__/types";
import {
  ACTION_TYPE,
  CommentAction,
  CreateActionInput,
  createActions,
  encodeActionCounts,
  invertEncodedActionCounts,
  removeAction,
  RemoveActionInput,
  retrieveUserAction,
} from "talk-server/models/action/comment";
import {
  getLatestRevision,
  retrieveComment,
  updateCommentActionCounts,
} from "talk-server/models/comment";
import { Comment } from "talk-server/models/comment";
import {
  updateStoryActionCounts,
  updateStoryCounts,
} from "talk-server/models/story";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";

import { AugmentedRedis } from "../redis";
import { calculateCountsDiff } from "./moderation/counts";

export type CreateAction = CreateActionInput;

export async function addCommentActions(
  mongo: Db,
  tenant: Tenant,
  inputs: CreateAction[],
  now = new Date()
) {
  // Create each of the actions, returning each of the action results.
  const results = await createActions(mongo, tenant.id, inputs, now);

  // Get the actions that were upserted, we only want to increment the action
  // counts of actions that were just created.
  return results
    .filter(({ wasUpserted }) => wasUpserted)
    .map(({ action }) => action);
}

export async function addCommentActionCounts(
  mongo: Db,
  tenant: Tenant,
  oldComment: Readonly<Comment>,
  ...actions: CommentAction[]
) {
  // Compute the action counts.
  const action = encodeActionCounts(...actions);

  // Grab the last revision (the most recent).
  const revision = getLatestRevision(oldComment);

  // Update the comment action counts here.
  const updatedComment = await updateCommentActionCounts(
    mongo,
    tenant.id,
    oldComment.id,
    revision.id,
    action
  );
  if (!updatedComment) {
    // TODO: (wyattjoh) return a better error.
    throw new Error("could not update comment action counts");
  }

  return updatedComment;
}

async function addCommentAction(
  mongo: Db,
  redis: AugmentedRedis,
  tenant: Tenant,
  input: Omit<CreateActionInput, "storyID">,
  now = new Date()
): Promise<Readonly<Comment>> {
  const oldComment = await retrieveComment(mongo, tenant.id, input.commentID);
  if (!oldComment) {
    // TODO: replace to match error returned by the models/comments.ts
    throw new Error("comment not found");
  }

  // Create the action creator input.
  const action: CreateAction = {
    ...input,
    storyID: oldComment.storyID,
  };

  // Update the actions for the comment.
  const commentActions = await addCommentActions(mongo, tenant, [action], now);
  if (commentActions.length > 0) {
    // Update the comment action counts.
    const updatedComment = await addCommentActionCounts(
      mongo,
      tenant,
      oldComment,
      ...commentActions
    );

    // Calculate the new story counts.
    await updateStoryCounts(mongo, redis, tenant.id, updatedComment.storyID, {
      action: encodeActionCounts(...commentActions),
      moderationQueue: calculateCountsDiff(oldComment, updatedComment),
    });

    return updatedComment;
  }

  return oldComment;
}

export async function removeCommentAction(
  mongo: Db,
  redis: AugmentedRedis,
  tenant: Tenant,
  input: Omit<RemoveActionInput, "commentRevisionID" | "reason">
): Promise<Readonly<Comment>> {
  // Get the Comment that we are leaving the Action on.
  const comment = await retrieveComment(mongo, tenant.id, input.commentID);
  if (!comment) {
    // TODO: replace to match error returned by the models/comments.ts
    throw new Error("comment not found");
  }

  // Get the revision for the specific action being removed.
  const action = await retrieveUserAction(
    mongo,
    tenant.id,
    input.userID,
    input.commentID,
    input.actionType
  );
  if (!action) {
    // The action that is trying to get removed does not exist!
    return comment;
  }

  // Grab the revision ID out of the action.
  const { commentID, commentRevisionID } = action;

  // Create each of the actions, returning each of the action results.
  const { wasRemoved } = await removeAction(mongo, tenant.id, {
    ...input,
    commentRevisionID,
  });
  if (wasRemoved) {
    // Compute the action counts, and invert them (because we're deleting an
    // action).
    const actionCounts = invertEncodedActionCounts(encodeActionCounts(action!));

    // Update the comment action counts here.
    const updatedComment = await updateCommentActionCounts(
      mongo,
      tenant.id,
      commentID,
      commentRevisionID,
      actionCounts
    );

    // Flags can't be removed, an that is the only type of operation that will
    // affect the moderation queue counts, so we don't have to interact with
    // updating the moderation queue counts.

    // Update the Story with the updated action counts.
    await updateStoryActionCounts(
      mongo,
      redis,
      tenant.id,
      comment.storyID,
      actionCounts
    );

    // Check to see if there was an actual comment returned.
    if (!updatedComment) {
      // TODO: (wyattjoh) return a better error.
      throw new Error("could not update comment action counts");
    }

    return updatedComment;
  }

  return comment;
}

export type CreateCommentReaction = Pick<
  CreateActionInput,
  "commentID" | "commentRevisionID"
>;

export async function createReaction(
  mongo: Db,
  redis: AugmentedRedis,
  tenant: Tenant,
  author: User,
  input: CreateCommentReaction,
  now = new Date()
) {
  return addCommentAction(
    mongo,
    redis,
    tenant,
    {
      actionType: ACTION_TYPE.REACTION,
      commentID: input.commentID,
      commentRevisionID: input.commentRevisionID,
      userID: author.id,
    },
    now
  );
}

export type RemoveCommentReaction = Pick<RemoveActionInput, "commentID">;

export async function removeReaction(
  mongo: Db,
  redis: AugmentedRedis,
  tenant: Tenant,
  author: User,
  input: RemoveCommentReaction
) {
  return removeCommentAction(mongo, redis, tenant, {
    actionType: ACTION_TYPE.REACTION,
    commentID: input.commentID,
    userID: author.id,
  });
}

export type CreateCommentDontAgree = Pick<
  CreateActionInput,
  "commentID" | "commentRevisionID" | "additionalDetails"
>;

export async function createDontAgree(
  mongo: Db,
  redis: AugmentedRedis,
  tenant: Tenant,
  author: User,
  input: CreateCommentDontAgree,
  now = new Date()
) {
  return addCommentAction(
    mongo,
    redis,
    tenant,
    {
      actionType: ACTION_TYPE.DONT_AGREE,
      commentID: input.commentID,
      commentRevisionID: input.commentRevisionID,
      additionalDetails: input.additionalDetails,
      userID: author.id,
    },
    now
  );
}

export type RemoveCommentDontAgree = Pick<RemoveActionInput, "commentID">;

export async function removeDontAgree(
  mongo: Db,
  redis: AugmentedRedis,
  tenant: Tenant,
  author: User,
  input: RemoveCommentDontAgree
) {
  return removeCommentAction(mongo, redis, tenant, {
    actionType: ACTION_TYPE.DONT_AGREE,
    commentID: input.commentID,
    userID: author.id,
  });
}

export type CreateCommentFlag = Pick<
  CreateActionInput,
  "commentID" | "commentRevisionID" | "additionalDetails"
> & {
  reason: GQLCOMMENT_FLAG_REPORTED_REASON;
};

export async function createFlag(
  mongo: Db,
  redis: AugmentedRedis,
  tenant: Tenant,
  author: User,
  input: CreateCommentFlag,
  now = new Date()
) {
  return addCommentAction(
    mongo,
    redis,
    tenant,
    {
      actionType: ACTION_TYPE.FLAG,
      reason: input.reason,
      commentID: input.commentID,
      commentRevisionID: input.commentRevisionID,
      additionalDetails: input.additionalDetails,
      userID: author.id,
    },
    now
  );
}
