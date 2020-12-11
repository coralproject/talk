import { Db } from "mongodb";

import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import { getLatestRevision } from "coral-server/models/comment";
import { Tenant } from "coral-server/models/tenant";
import { moderate } from "coral-server/services/comments/moderation";
import { AugmentedRedis } from "coral-server/services/redis";
import { submitCommentAsNotSpam } from "coral-server/services/spam";
import { Request } from "coral-server/types/express";

import { GQLCOMMENT_STATUS } from "coral-server/graph/schema/__generated__/types";

import { publishChanges, updateAllCommentCounts } from "./helpers";

const approveComment = async (
  mongo: Db,
  redis: AugmentedRedis,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  commentID: string,
  commentRevisionID: string,
  moderatorID: string,
  now: Date,
  request?: Request | undefined
) => {
  // Approve the comment.
  const result = await moderate(
    mongo,
    tenant,
    {
      commentID,
      commentRevisionID,
      moderatorID,
      status: GQLCOMMENT_STATUS.APPROVED,
    },
    now
  );

  const revision = getLatestRevision(result.before);
  if (
    revision &&
    tenant.integrations.akismet.enabled &&
    (revision.actionCounts.COMMENT_REPORTED_SPAM > 0 ||
      revision.actionCounts.COMMENT_DETECTED_SPAM > 0)
  ) {
    await submitCommentAsNotSpam(mongo, tenant, result.before, request);
  }

  // If the comment hasn't been updated, skip the rest of the steps.
  if (!result.after) {
    return result.before;
  }

  // Update all the comment counts on stories and users.
  const counts = await updateAllCommentCounts(mongo, redis, {
    ...result,
    tenant,
    // Rejecting a comment does not change the action counts.
    actionCounts: {},
  });

  // Publish changes to the event publisher.
  await publishChanges(broker, {
    ...result,
    ...counts,
    moderatorID,
    commentRevisionID,
  });

  // Return the resulting comment.
  return result.after;
};

export default approveComment;
