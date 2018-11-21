import { Db } from "mongodb";

import { Omit } from "talk-common/types";
import { GQLCOMMENT_FLAG_REPORTED_REASON } from "talk-server/graph/tenant/schema/__generated__/types";
import {
  ACTION_TYPE,
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
import { updateStoryActionCounts } from "talk-server/models/story";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";

export type CreateAction = Omit<CreateActionInput, "storyID"> &
  Required<Pick<CreateActionInput, "storyID">>;

export async function addCommentActions(
  mongo: Db,
  tenant: Tenant,
  comment: Readonly<Comment>,
  inputs: CreateAction[]
): Promise<Readonly<Comment>> {
  // Create each of the actions, returning each of the action results.
  const results = await createActions(mongo, tenant.id, inputs);

  // Get the actions that were upserted, we only want to increment the action
  // counts of actions that were just created.
  const upsertedActions = results
    .filter(({ wasUpserted }) => wasUpserted)
    .map(({ action }) => action);

  if (upsertedActions.length > 0) {
    // Compute the action counts.
    const actionCounts = encodeActionCounts(...upsertedActions);

    // Grab the last revision (the most recent).
    const revision = getLatestRevision(comment);

    // Update the comment action counts here.
    const updatedComment = await updateCommentActionCounts(
      mongo,
      tenant.id,
      comment.id,
      revision.id,
      actionCounts
    );

    // Update the Story with the updated action counts.
    await updateStoryActionCounts(
      mongo,
      tenant.id,
      comment.storyID,
      actionCounts
    );

    // Check to see if there was an actual comment returned (there should
    // have been, we just created it!).
    if (!updatedComment) {
      // TODO: (wyattjoh) return a better error.
      throw new Error("could not update comment action counts");
    }

    return updatedComment;
  }

  return comment;
}

async function addCommentAction(
  mongo: Db,
  tenant: Tenant,
  input: CreateActionInput
): Promise<Readonly<Comment>> {
  const comment = await retrieveComment(mongo, tenant.id, input.commentID);
  if (!comment) {
    // TODO: replace to match error returned by the models/comments.ts
    throw new Error("comment not found");
  }

  // Store the story ID on the action as a story_id.
  input.storyID = comment.storyID;

  // We have to perform a type assertion here because for some reason, the type
  // coercion is not determining that because we filled in the `storyID`
  // above, that at this point, it satisfies the CreateAction type.
  return addCommentActions(mongo, tenant, comment, [input as CreateAction]);
}

export async function removeCommentAction(
  mongo: Db,
  tenant: Tenant,
  input: Omit<RemoveActionInput, "commentRevisionID">
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

    // Update the Story with the updated action counts.
    await updateStoryActionCounts(
      mongo,
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
  tenant: Tenant,
  author: User,
  input: CreateCommentReaction
) {
  return addCommentAction(mongo, tenant, {
    actionType: ACTION_TYPE.REACTION,
    commentID: input.commentID,
    commentRevisionID: input.commentRevisionID,
    userID: author.id,
  });
}

export type RemoveCommentReaction = Pick<RemoveActionInput, "commentID">;

export async function removeReaction(
  mongo: Db,
  tenant: Tenant,
  author: User,
  input: RemoveCommentReaction
) {
  return removeCommentAction(mongo, tenant, {
    actionType: ACTION_TYPE.REACTION,
    commentID: input.commentID,
    userID: author.id,
  });
}

export type CreateCommentDontAgree = Pick<
  CreateActionInput,
  "commentID" | "commentRevisionID"
>;

export async function createDontAgree(
  mongo: Db,
  tenant: Tenant,
  author: User,
  input: CreateCommentDontAgree
) {
  return addCommentAction(mongo, tenant, {
    actionType: ACTION_TYPE.DONT_AGREE,
    commentID: input.commentID,
    commentRevisionID: input.commentRevisionID,
    userID: author.id,
  });
}

export type RemoveCommentDontAgree = Pick<RemoveActionInput, "commentID">;

export async function removeDontAgree(
  mongo: Db,
  tenant: Tenant,
  author: User,
  input: RemoveCommentDontAgree
) {
  return removeCommentAction(mongo, tenant, {
    actionType: ACTION_TYPE.DONT_AGREE,
    commentID: input.commentID,
    userID: author.id,
  });
}

export type CreateCommentFlag = Pick<
  CreateActionInput,
  "commentID" | "commentRevisionID"
> & {
  reason: GQLCOMMENT_FLAG_REPORTED_REASON;
};

export async function createFlag(
  mongo: Db,
  tenant: Tenant,
  author: User,
  input: CreateCommentFlag
) {
  return addCommentAction(mongo, tenant, {
    actionType: ACTION_TYPE.FLAG,
    reason: input.reason,
    commentID: input.commentID,
    commentRevisionID: input.commentRevisionID,
    userID: author.id,
  });
}

export type RemoveCommentFlag = Pick<RemoveActionInput, "commentID">;

export async function removeFlag(
  mongo: Db,
  tenant: Tenant,
  author: User,
  input: RemoveCommentFlag
) {
  return removeCommentAction(mongo, tenant, {
    actionType: ACTION_TYPE.FLAG,
    commentID: input.commentID,
    userID: author.id,
  });
}
