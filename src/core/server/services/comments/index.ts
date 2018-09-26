import { Db } from "mongodb";

import { Omit } from "talk-common/types";
import { ACTION_ITEM_TYPE, CreateActionInput } from "talk-server/models/action";
import {
  retrieveAsset,
  updateCommentStatusCount,
} from "talk-server/models/asset";
import {
  createComment,
  CreateCommentInput,
  editComment,
  EditCommentInput,
  pushChildCommentIDOntoParent,
  retrieveComment,
} from "talk-server/models/comment";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import { addCommentActions } from "talk-server/services/comments/actions";
import { processForModeration } from "talk-server/services/comments/moderation";
import { Request } from "talk-server/types/express";

export type CreateComment = Omit<
  CreateCommentInput,
  "status" | "action_counts" | "metadata" | "grandparent_ids"
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

  const grandparentIDs: string[] = [];
  if (input.parent_id) {
    // Check to see that the reference parent ID exists.
    const parent = await retrieveComment(mongo, tenant.id, input.parent_id);
    if (!parent) {
      // TODO: (wyattjoh) return better error.
      throw new Error("parent comment referenced does not exist");
    }

    // TODO: (wyattjoh) Check that the parent comment was visible.

    // Push the parent's parent id's into the comment's grandparent id's.
    grandparentIDs.push(...parent.grandparent_ids);
    if (parent.parent_id) {
      // If this parent has a parent, push it down as well.
      grandparentIDs.push(parent.parent_id);
    }
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
    grandparent_ids: grandparentIDs,
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
    // Push the child's ID onto the parent.
    await pushChildCommentIDOntoParent(
      mongo,
      tenant.id,
      input.parent_id,
      comment.id
    );
  }

  // Increment the status count for the particular status on the Asset.
  await updateCommentStatusCount(mongo, tenant.id, asset.id, {
    [status]: 1,
  });

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
  const comment = await retrieveComment(mongo, tenant.id, input.id);
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

  let editedComment = await editComment(mongo, tenant.id, {
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
    editedComment = await addCommentActions(mongo, tenant, comment, inputs);
  }

  if (comment.status !== editedComment.status) {
    // Increment the status count for the particular status on the Asset, and
    // decrement the status on the comment's previous status.
    await updateCommentStatusCount(mongo, tenant.id, asset.id, {
      [comment.status]: -1,
      [editedComment.status]: 1,
    });
  }

  return editedComment;
}
