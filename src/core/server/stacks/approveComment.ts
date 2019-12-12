import { Db } from "mongodb";

import { Publisher } from "coral-server/graph/tenant/subscriptions/publisher";
import logger from "coral-server/logger";
import { Tenant } from "coral-server/models/tenant";
import { approve } from "coral-server/services/comments/moderation";
import { AugmentedRedis } from "coral-server/services/redis";

import { GQLCOMMENT_STATUS } from "coral-server/graph/tenant/schema/__generated__/types";

import updateAllCounts from "./counts/updateAllCounts";

const approveComment = async (
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
  await updateAllCounts(
    mongo,
    redis,
    publisher,
    {
      tenant,
      moderatorID,
      oldStatus: result.oldStatus,
      newStatus: GQLCOMMENT_STATUS.APPROVED,
      comment: result.comment,
    },
    log
  );

  return result.comment;
};

export default approveComment;
