import { DateTime } from "luxon";
import { Db } from "mongodb";

import { CommentNotFoundError } from "coral-server/errors";
import { GQLTAG } from "coral-server/graph/tenant/schema/__generated__/types";
import {
  addCommentTag,
  removeCommentTag,
  retrieveComment,
} from "coral-server/models/comment";
import { getLatestRevision } from "coral-server/models/comment/helpers";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";

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
