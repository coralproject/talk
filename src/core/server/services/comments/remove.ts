import { Db } from "mongodb";

import { CommentNotFoundError } from "coral-server/errors";
import { removeComment, retrieveComment } from "coral-server/models/comment";
import { Tenant } from "coral-server/models/tenant";
import { AugmentedRedis } from "coral-server/services/redis";
import { updateAllCounts } from "coral-server/stacks/helpers/updateAllCommentCounts";

export async function remove(
  mongo: Db,
  redis: AugmentedRedis,
  tenant: Tenant,
  commentID: string
) {
  const comment = await retrieveComment(mongo, tenant.id, commentID);
  if (!comment) {
    throw new CommentNotFoundError(commentID);
  }

  const removedComment = removeComment(mongo, tenant.id, commentID);
  if (!removedComment) {
    throw new Error("unable to remove comment");
  }

  // Subtract from any statuses currently assigned to this
  // comment as we have deleted it.
  await updateAllCounts(
    mongo,
    redis,
    tenant.id,
    comment.storyID,
    comment.siteID,
    {
      action: {},
      status: {
        [comment.status]: -1,
      },
      moderationQueue: {
        [comment.status]: -1,
      },
    },
    comment.authorID
  );

  return removeComment(mongo, tenant.id, commentID);
}
