import { Db } from "mongodb";

import { Config } from "coral-server/config";
import { Publisher } from "coral-server/graph/subscriptions/publisher";
import { hasTag } from "coral-server/models/comment";
import { Tenant } from "coral-server/models/tenant";
import { removeTag } from "coral-server/services/comments";
import { moderate } from "coral-server/services/comments/moderation";
import { notifyPerspectiveModerationDecision } from "coral-server/services/perspective";
import { AugmentedRedis } from "coral-server/services/redis";

import {
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-server/graph/schema/__generated__/types";

import { publishChanges, updateAllCounts } from "./helpers";

const rejectComment = async (
  mongo: Db,
  redis: AugmentedRedis,
  config: Config,
  publisher: Publisher,
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

  // Update all the comment counts on stories and users.
  const counts = await updateAllCounts(mongo, redis, {
    tenant,
    ...result,
  });

  // Publish changes to the event publisher.
  await publishChanges(publisher, {
    ...result,
    ...counts,
    moderatorID,
  });

  // If there was a featured tag on this comment, remove it.
  if (hasTag(result.after, GQLTAG.FEATURED)) {
    return removeTag(mongo, tenant, result.after.id, GQLTAG.FEATURED);
  }

  // We don't want to await on this so that
  // we don't hold up the moderation flow and response
  notifyPerspectiveModerationDecision(
    mongo,
    tenant,
    config,
    tenant.integrations.perspective,
    result.after,
    commentRevisionID,
    GQLCOMMENT_STATUS.REJECTED
  );

  // Return the resulting comment.
  return result.after;
};

export default rejectComment;
