import { Db } from "mongodb";

import { GQLCOMMENT_FLAG_REPORTED_REASON } from "talk-server/graph/tenant/schema/__generated__/types";
import {
  ACTION_ITEM_TYPE,
  ACTION_TYPE,
  CreateActionInput,
  createActions,
  deleteAction,
  DeleteActionInput,
  encodeActionCounts,
  invertEncodedActionCounts,
} from "talk-server/models/action";
import { updateAssetActionCounts } from "talk-server/models/asset";
import {
  retrieveComment,
  updateCommentActionCounts,
} from "talk-server/models/comment";
import { Comment } from "talk-server/models/comment";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";

export async function addCommentActions(
  mongo: Db,
  tenant: Tenant,
  comment: Readonly<Comment>,
  inputs: CreateActionInput[]
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

    // Update the comment action counts here.
    const updatedComment = await updateCommentActionCounts(
      mongo,
      tenant.id,
      comment.id,
      actionCounts
    );

    // Update the Asset with the updated action counts.
    await updateAssetActionCounts(
      mongo,
      tenant.id,
      comment.asset_id,
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
  const comment = await retrieveComment(mongo, tenant.id, input.item_id);
  if (!comment) {
    // TODO: replace to match error returned by the models/comments.ts
    throw new Error("comment not found");
  }

  return addCommentActions(mongo, tenant, comment, [input]);
}

export async function removeCommentAction(
  mongo: Db,
  tenant: Tenant,
  input: DeleteActionInput
): Promise<Readonly<Comment>> {
  // Get the Comment that we are leaving the Action on.
  const comment = await retrieveComment(mongo, tenant.id, input.item_id);
  if (!comment) {
    // TODO: replace to match error returned by the models/comments.ts
    throw new Error("comment not found");
  }

  // Create each of the actions, returning each of the action results.
  const { wasDeleted, action } = await deleteAction(mongo, tenant.id, input);
  if (wasDeleted) {
    // Compute the action counts, and invert them (because we're deleting an
    // action).
    const actionCounts = invertEncodedActionCounts(encodeActionCounts(action!));

    // Update the comment action counts here.
    const updatedComment = await updateCommentActionCounts(
      mongo,
      tenant.id,
      comment.id,
      actionCounts
    );

    // Update the Asset with the updated action counts.
    await updateAssetActionCounts(
      mongo,
      tenant.id,
      comment.asset_id,
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

export type CreateCommentReaction = Pick<CreateActionInput, "item_id">;

export async function createReaction(
  mongo: Db,
  tenant: Tenant,
  author: User,
  input: CreateCommentReaction
) {
  return addCommentAction(mongo, tenant, {
    action_type: ACTION_TYPE.REACTION,
    item_type: ACTION_ITEM_TYPE.COMMENTS,
    item_id: input.item_id,
    user_id: author.id,
  });
}

export type DeleteCommentReaction = Pick<DeleteActionInput, "item_id">;

export async function deleteReaction(
  mongo: Db,
  tenant: Tenant,
  author: User,
  input: DeleteCommentReaction
) {
  return removeCommentAction(mongo, tenant, {
    action_type: ACTION_TYPE.REACTION,
    item_type: ACTION_ITEM_TYPE.COMMENTS,
    item_id: input.item_id,
    user_id: author.id,
  });
}

export type CreateCommentFlag = Pick<CreateActionInput, "item_id"> & {
  reason: GQLCOMMENT_FLAG_REPORTED_REASON;
};

export async function createFlag(
  mongo: Db,
  tenant: Tenant,
  author: User,
  input: CreateCommentFlag
) {
  return addCommentAction(mongo, tenant, {
    action_type: ACTION_TYPE.FLAG,
    reason: input.reason,
    item_type: ACTION_ITEM_TYPE.COMMENTS,
    item_id: input.item_id,
    user_id: author.id,
  });
}

export type DeleteCommentFlag = Pick<DeleteActionInput, "item_id">;

export async function deleteFlag(
  mongo: Db,
  tenant: Tenant,
  author: User,
  input: DeleteCommentFlag
) {
  return removeCommentAction(mongo, tenant, {
    action_type: ACTION_TYPE.FLAG,
    item_type: ACTION_ITEM_TYPE.COMMENTS,
    item_id: input.item_id,
    user_id: author.id,
  });
}
