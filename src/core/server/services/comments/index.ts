import { Db } from "mongodb";

import { Omit } from "talk-common/types";
import { retrieveAsset } from "talk-server/models/asset";
import {
  createComment,
  CreateCommentInput,
  retrieveComment,
} from "talk-server/models/comment";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import { processForModeration } from "talk-server/services/comments/moderation";
import { Request } from "talk-server/types/express";

export type CreateComment = Omit<
  CreateCommentInput,
  "status" | "action_counts"
>;

export async function create(
  mongo: Db,
  tenant: Tenant,
  author: User,
  input: CreateComment,
  req?: Request
) {
  const asset = await retrieveAsset(mongo, tenant.id, input.asset_id);
  if (!asset) {
    // TODO: (wyattjoh) return better error.
    throw new Error("asset referenced does not exist");
  }

  // TODO: (wyattjoh) Check that the asset was visable.

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
  const { status } = await processForModeration({
    asset,
    tenant,
    comment: input,
    author,
    req,
  });

  // TODO: (wyattjoh) use the actions somehow.

  const comment = await createComment(mongo, tenant.id, {
    status,
    action_counts: {},
    ...input,
  });

  if (input.parent_id) {
    // TODO: update reply count of parent.
  }

  return comment;
}
