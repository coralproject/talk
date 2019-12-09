import { Db } from "mongodb";

import { Config } from "coral-server/config";
import { CoralEventPublisherBroker } from "coral-server/events/publisher";
import { Tenant } from "coral-server/models/tenant";
import { moderate } from "coral-server/services/comments/moderation";
import { notifyPerspectiveModerationDecision } from "coral-server/services/perspective";
import { AugmentedRedis } from "coral-server/services/redis";

import { GQLCOMMENT_STATUS } from "coral-server/graph/schema/__generated__/types";

import { publishChanges, updateAllCommentCounts } from "./helpers";

const approveComment = async (
  mongo: Db,
  redis: AugmentedRedis,
  config: Config,
  broker: CoralEventPublisherBroker,
  tenant: Tenant,
  commentID: string,
  commentRevisionID: string,
  moderatorID: string,
  now: Date
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
  });

  // We don't want to await on this so that
  // we don't hold up the moderation flow and response
  notifyPerspectiveModerationDecision(
    mongo,
    tenant,
    config,
    tenant.integrations.perspective,
    result.after,
    commentRevisionID,
    GQLCOMMENT_STATUS.APPROVED
  );

  // Return the resulting comment.
  return result.after;
};

export default approveComment;
