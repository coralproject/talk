import { Db } from "mongodb";

import { StoryNotFoundError, UserNotFoundError } from "coral-server/errors";
import { Comment } from "coral-server/models/comment";
import { updateStoryCounts } from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import { calculateCountsDiff } from "coral-server/services/comments/moderation";
import { AugmentedRedis } from "coral-server/services/redis";

import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";

import { updateUserCommentCounts } from "./updateUserCommentCounts";

interface CommentStatusChange {
  tenant: Tenant;
  moderatorID: string | null;
  oldStatus: GQLCOMMENT_STATUS;
  newStatus: GQLCOMMENT_STATUS;
  comment: Readonly<Comment>;
}

const updateAllCounts = async (
  mongo: Db,
  redis: AugmentedRedis,
  change: CommentStatusChange
) => {
  // Compute the queue difference as a result of the old status and the new
  // status.
  const moderationQueue = calculateCountsDiff(
    {
      status: change.oldStatus,
      actionCounts: change.comment.actionCounts,
    },
    {
      status: change.newStatus,
      actionCounts: change.comment.actionCounts,
    }
  );

  // Only update the counts if the status has changed
  if (change.newStatus !== change.oldStatus) {
    // Update the story comment counts.
    const story = await updateStoryCounts(
      mongo,
      redis,
      change.tenant.id,
      change.comment.storyID,
      {
        // Update the comment counts.
        status: {
          [change.oldStatus]: -1,
          [change.newStatus]: 1,
        },

        moderationQueue,
      }
    );
    if (!story) {
      throw new StoryNotFoundError(change.comment.storyID);
    }

    // Update the user comment counts.
    const user = await updateUserCommentCounts(
      mongo,
      change.tenant.id,
      change.comment.authorID,
      {
        status: {
          [change.oldStatus]: -1,
          [change.newStatus]: 1,
        },
      }
    );
    if (!user) {
      throw new UserNotFoundError(change.comment.authorID);
    }
  }

  return {
    tenant: change.tenant,
    moderatorID: change.moderatorID,
    moderationQueue,
    comment: change.comment,
    oldStatus: change.oldStatus,
    newStatus: change.newStatus,
  };
};

export default updateAllCounts;
