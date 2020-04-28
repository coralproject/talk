import { Db } from "mongodb";

import { CommentNotFoundError } from "coral-server/errors";
import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import { hasTag, retrieveComment } from "coral-server/models/comment";
import { Tenant } from "coral-server/models/tenant";
import {
  incrementRejectionsToday,
  removeTag,
} from "coral-server/services/comments";
import { moderate } from "coral-server/services/comments/moderation";
import { AugmentedRedis } from "coral-server/services/redis";

import {
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

import { publishChanges, updateAllCommentCounts } from "./helpers";

const rejectComment = async (
  mongo: Db,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker | null,
  tenant: Tenant,
  commentID: string,
  commentRevisionID: string,
  moderatorID: string,
  now: Date
) => {
  // Reject the comment.
  const result = await moderate(
    mongo,
    tenant,
    {
      commentID,
      commentRevisionID,
      moderatorID,
      status: GQLCOMMENT_STATUS.REJECTED,
    },
    now
  );

  const comment = await retrieveComment(mongo, tenant.id, commentID);

  if (!comment) {
    throw new CommentNotFoundError(commentID);
  }

  // Update all the comment counts on stories and users.
  const counts = await updateAllCommentCounts(mongo, redis, {
    ...result,
    tenant,
    // Rejecting a comment does not change the action counts.
    actionCounts: {},
  });

  await incrementRejectionsToday(redis, tenant.id, comment.siteID, now);

  // TODO: (wyattjoh) (tessalt) broker cannot easily be passed to stack from tasks,
  // see CORL-935 in jira
  if (broker) {
    // Publish changes to the event publisher.
    await publishChanges(broker, {
      ...result,
      ...counts,
      moderatorID,
      commentRevisionID,
    });
  }

  // If there was a featured tag on this comment, remove it.
  if (hasTag(result.after, GQLTAG.FEATURED)) {
    return removeTag(mongo, tenant, result.after.id, GQLTAG.FEATURED);
  }

  // Return the resulting comment.
  return result.after;
};

export default rejectComment;
