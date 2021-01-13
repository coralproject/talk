import { Db } from "mongodb";

import { CommentNotFoundError } from "coral-server/errors";
import { removeComment, retrieveComment } from "coral-server/models/comment";
import { Tenant } from "coral-server/models/tenant";

export async function remove(mongo: Db, tenant: Tenant, commentID: string) {
  const comment = await retrieveComment(mongo, tenant.id, commentID);
  if (!comment) {
    throw new CommentNotFoundError(commentID);
  }

  // TODO (Nick): update comment queue counts

  return removeComment(mongo, tenant.id, commentID);
}
