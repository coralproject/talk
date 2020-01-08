import { Db } from "mongodb";

import { Publisher } from "coral-server/graph/subscriptions/publisher";
import { Tenant } from "coral-server/models/tenant";
import { moderate } from "coral-server/services/comments/moderation";
import { AugmentedRedis } from "coral-server/services/redis";

import { GQLCOMMENT_STATUS } from "coral-server/graph/schema/__generated__/types";

import { publishChanges, updateAllCounts } from "./helpers";

const approveComment = async (
  mongo: Db,
  redis: AugmentedRedis,
  publisher: Publisher,
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

  // Return the resulting comment.
  return result.after;
};

export default approveComment;
