import { DateTime } from "luxon";
import { Db } from "mongodb";

import { CommentNotFoundError } from "coral-server/errors";
import {
  addCommentTag,
  removeCommentTag,
  retrieveComment,
} from "coral-server/models/comment";
import { getLatestRevision } from "coral-server/models/comment/helpers";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";

import { GQLTAG } from "coral-server/graph/schema/__generated__/types";

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
  return DateTime.fromJSDate(createdAt)
    .plus({ seconds: tenant.editCommentWindowLength })
    .toJSDate();
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
  const comment = await retrieveComment(mongo, mongo, tenant.id, commentID);
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
  const comment = await retrieveComment(mongo, mongo, tenant.id, commentID);
  if (!comment) {
    throw new CommentNotFoundError(commentID);
  }

  // Check to see if this tag is even on this comment.
  if (comment.tags.every(({ type }) => type !== tagType)) {
    return comment;
  }

  return removeCommentTag(mongo, tenant.id, commentID, tagType);
}
