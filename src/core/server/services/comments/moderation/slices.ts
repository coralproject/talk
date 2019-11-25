import { Db } from "mongodb";

import { StoryNotFoundError } from "coral-server/errors";
import { Publisher } from "coral-server/graph/tenant/subscriptions/publisher";
import logger, { Logger } from "coral-server/logger";
import {
  Comment,
  hasTag,
  UpdateCommentStatus,
} from "coral-server/models/comment";
import {
  CommentModerationQueueCounts,
  updateStoryCounts,
} from "coral-server/models/story";
import { Tenant } from "coral-server/models/tenant";
import {
  publishCommentReleased,
  publishCommentStatusChanges,
  publishModerationQueueChanges,
} from "coral-server/services/events";
import { AugmentedRedis } from "coral-server/services/redis";

import {
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-server/graph/tenant/schema/__generated__/types";

import { removeTag } from "../comments";
import { calculateCountsDiff } from "./counts";
import { approve, reject } from "./moderation";

const updateCounts = async (
  mongo: Db,
  redis: AugmentedRedis,
  publisher: Publisher,
  tenant: Tenant,
  result: UpdateCommentStatus,
  status: GQLCOMMENT_STATUS,
  moderatorID: string | null,
  log: Logger
) => {
  // Compute the queue difference as a result of the old status and the new
  // status.
  const moderationQueue = calculateCountsDiff(
    {
      status: result.oldStatus,
      actionCounts: result.comment.actionCounts,
    },
    {
      status,
      actionCounts: result.comment.actionCounts,
    }
  );

  // Update the story comment counts.
  const story = await updateStoryCounts(
    mongo,
    redis,
    tenant.id,
    result.comment.storyID,
    {
      // Update the comment counts.
      status: {
        [result.oldStatus]: -1,
        [status]: 1,
      },

      moderationQueue,
    }
  );
  if (!story) {
    throw new StoryNotFoundError(result.comment.storyID);
  }

  await publishChanges(
    publisher,
    moderationQueue,
    result.comment,
    result.oldStatus,
    status,
    moderatorID,
    log
  );
};

const publishChanges = async (
  publish: Publisher,
  moderationQueue: CommentModerationQueueCounts,
  comment: Readonly<Comment>,
  oldStatus: GQLCOMMENT_STATUS,
  newStatus: GQLCOMMENT_STATUS,
  moderatorID: string | null,
  log: Logger
) => {
  // Publish changes.
  await publishModerationQueueChanges(publish, moderationQueue, comment);
  await publishCommentStatusChanges(
    publish,
    oldStatus,
    newStatus,
    comment.id,
    moderatorID
  );
  if (
    [GQLCOMMENT_STATUS.PREMOD, GQLCOMMENT_STATUS.SYSTEM_WITHHELD].includes(
      oldStatus
    ) &&
    newStatus === "APPROVED"
  ) {
    await publishCommentReleased(publish, comment);
  }

  log.trace({ oldStatus }, "adjusted story comment counts");
};

const slices = {
  approve: async (
    mongo: Db,
    redis: AugmentedRedis,
    publisher: Publisher,
    tenant: Tenant,
    commentID: string,
    commentRevisionID: string,
    moderatorID: string | null,
    now: Date
  ) => {
    const log = logger.child(
      {
        commentID,
        commentRevisionID,
        moderatorID,
        tenantID: tenant.id,
        newStatus: GQLCOMMENT_STATUS.APPROVED,
      },
      true
    );

    const result = await approve(
      mongo,
      tenant,
      {
        commentID,
        commentRevisionID,
        moderatorID,
      },
      now,
      log
    );
    await updateCounts(
      mongo,
      redis,
      publisher,
      tenant,
      result,
      GQLCOMMENT_STATUS.APPROVED,
      moderatorID,
      log
    );

    return result.comment;
  },

  reject: async (
    mongo: Db,
    redis: AugmentedRedis,
    publisher: Publisher,
    tenant: Tenant,
    commentID: string,
    commentRevisionID: string,
    moderatorID: string | null,
    now: Date
  ) => {
    const log = logger.child(
      {
        commentID,
        commentRevisionID,
        moderatorID,
        tenantID: tenant.id,
        newStatus: GQLCOMMENT_STATUS.REJECTED,
      },
      true
    );

    const result = await reject(
      mongo,
      tenant,
      {
        commentID,
        commentRevisionID,
        moderatorID,
      },
      now,
      log
    );
    await updateCounts(
      mongo,
      redis,
      publisher,
      tenant,
      result,
      GQLCOMMENT_STATUS.REJECTED,
      moderatorID,
      log
    );

    const comment = hasTag(result.comment, GQLTAG.FEATURED)
      ? await removeTag(mongo, tenant, commentID, GQLTAG.FEATURED)
      : result.comment;

    return comment;
  },
};

export default slices;
