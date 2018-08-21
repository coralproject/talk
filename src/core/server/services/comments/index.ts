import { Db } from "mongodb";

import { Omit } from "talk-common/types";
import { retrieveAsset } from "talk-server/models/asset";
import {
  createComment,
  CreateCommentInput,
  editComment,
  EditCommentInput,
  retrieveComment,
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
  const { status, metadata } = await processForModeration({
    asset,
    tenant,
    comment: input,
    author,
    req,
  });

  // TODO: (wyattjoh) use the actions somehow.

  const comment = await createComment(mongo, tenant.id, {
    ...input,
    status,
    action_counts: {},
    metadata,
  });

  if (input.parent_id) {
    // TODO: update reply count of parent.
  }

  return comment;
}

export type EditComment = Omit<
  EditCommentInput,
  "status" | "author_id" | "lastEditableCommentCreatedAt"
> & {
  /**
   * asset_id is the asset that the comment exists on.
   */
  asset_id: string;
};

export async function edit(
  mongo: Db,
  tenant: Tenant,
  author: User,
  input: EditComment,
  req?: Request
) {
  // Grab the asset that we'll use to check moderation pieces with.
  const asset = await retrieveAsset(mongo, tenant.id, input.asset_id);
  if (!asset) {
    // TODO: (wyattjoh) return better error.
    throw new Error("asset referenced does not exist");
  }

  // Run the comment through the moderation phases.
  const { status } = await processForModeration({
    asset,
    tenant,
    comment: input,
    author,
    req,
  });

  // TODO: (wyattjoh) use the actions somehow.

  const comment = await editComment(mongo, tenant.id, {
    id: input.id,
    author_id: author.id,
    body: input.body,
    status,
    // The editable time is based on the current time, and the edit window
    // length. By subtracting the current date from the edit window length, we
    // get the maximum value for the `created_at` time that would be permitted
    // for the comment edit to succeed.
    lastEditableCommentCreatedAt: new Date(
      Date.now() - tenant.editCommentWindowLength
    ),
  });

  return comment;
}
