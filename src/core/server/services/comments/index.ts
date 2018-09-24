import { Db } from "mongodb";

import { Omit } from "talk-common/types";
import {
  ACTION_ITEM_TYPE,
  CreateActionInput,
  createActions,
  encodeActionCounts,
} from "talk-server/models/action";
import {
  retrieveAsset,
  updateAssetActionCounts,
} from "talk-server/models/asset";
import {
  Comment,
  createComment,
  CreateCommentInput,
  editComment,
  EditCommentInput,
  retrieveComment,
  updateCommentActionCounts,
} from "talk-server/models/comment";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import { processForModeration } from "talk-server/services/comments/moderation";
import { Request } from "talk-server/types/express";

export type CreateComment = Omit<
  CreateCommentInput,
  "status" | "action_counts" | "metadata"
>;

export async function create(
  mongo: Db,
  tenant: Tenant,
  author: User,
  input: CreateComment,
  req?: Request
) {
  // Grab the asset that we'll use to check moderation pieces with.
  const asset = await retrieveAsset(mongo, tenant.id, input.asset_id);
  if (!asset) {
    // TODO: (wyattjoh) return better error.
    throw new Error("asset referenced does not exist");
  }

  // TODO: (wyattjoh) Check that the asset was visible.

  if (input.parent_id) {
    // Check to see that the reference parent ID exists.
    const parent = await retrieveComment(mongo, tenant.id, input.parent_id);
    if (!parent) {
      // TODO: (wyattjoh) return better error.
      throw new Error("parent comment referenced does not exist");
    }

    // TODO: (wyattjoh) Check that the parent comment was visible.
  }

  // Run the comment through the moderation phases.
  const { actions, status, metadata } = await processForModeration({
    asset,
    tenant,
    comment: input,
    author,
    req,
  });

  // Create the comment!
  let comment = await createComment(mongo, tenant.id, {
    ...input,
    status,
    action_counts: {},
    metadata,
  });

  if (actions.length > 0) {
    // The actions coming from the moderation phases didn't know the item_id
    // at the time, and we didn't want the repetitive nature of adding the
    // item_type each time, so this mapping function adds them!
    const inputs = actions.map(
      (action): CreateActionInput => ({
        ...action,
        item_id: comment.id,
        item_type: ACTION_ITEM_TYPE.COMMENTS,
      })
    );

    // Insert and handle creating the actions.
    comment = await addCommentActions(mongo, tenant, comment, inputs);
    // asse
  }

  if (input.parent_id) {
    // TODO: (wyattjoh) update reply count of parent.
  }

  return comment;
}

export type EditComment = Omit<
  EditCommentInput,
  "status" | "author_id" | "lastEditableCommentCreatedAt"
>;

export async function edit(
  mongo: Db,
  tenant: Tenant,
  author: User,
  input: EditComment,
  req?: Request
) {
  // Get the comment that we're editing.
  let comment = await retrieveComment(mongo, tenant.id, input.id);
  if (!comment) {
    // TODO: replace to match error returned by the models/comments.ts
    throw new Error("comment not found");
  }

  // Grab the asset that we'll use to check moderation pieces with.
  const asset = await retrieveAsset(mongo, tenant.id, comment.asset_id);
  if (!asset) {
    // TODO: (wyattjoh) return better error.
    throw new Error("asset referenced does not exist");
  }

  // Run the comment through the moderation phases.
  const { status, metadata, actions } = await processForModeration({
    asset,
    tenant,
    comment: input,
    author,
    req,
  });

  comment = await editComment(mongo, tenant.id, {
    id: input.id,
    author_id: author.id,
    body: input.body,
    status,
    metadata,
    // The editable time is based on the current time, and the edit window
    // length. By subtracting the current date from the edit window length, we
    // get the maximum value for the `created_at` time that would be permitted
    // for the comment edit to succeed.
    lastEditableCommentCreatedAt: new Date(
      Date.now() - tenant.editCommentWindowLength
    ),
  });
  if (!comment) {
    // TODO: replace to match error returned by the models/comments.ts
    throw new Error("comment not found");
  }

  if (actions.length > 0) {
    // The actions coming from the moderation phases didn't know the item_id
    // at the time, and we didn't want the repetitive nature of adding the
    // item_type each time, so this mapping function adds them!
    const inputs = actions.map(
      (action): CreateActionInput => ({
        ...action,
        // Strict null check seems to have failed here... Null checking was done
        // above where we errored if the comment was falsely.
        item_id: comment!.id,
        item_type: ACTION_ITEM_TYPE.COMMENTS,
      })
    );

    // Insert and handle creating the actions.
    comment = await addCommentActions(mongo, tenant, comment, inputs);
  }

  return comment;
}

async function addCommentActions(
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
