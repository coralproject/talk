import { Db } from "mongodb";

import { Publisher } from "coral-server/graph/tenant/subscriptions/publisher";
import logger from "coral-server/logger";
import { hasTag } from "coral-server/models/comment";
import { Tenant } from "coral-server/models/tenant";
import { removeTag } from "coral-server/services/comments";
import { reject } from "coral-server/services/comments/moderation";
import { AugmentedRedis } from "coral-server/services/redis";

import {
  GQLCOMMENT_STATUS,
  GQLTAG,
} from "coral-server/graph/tenant/schema/__generated__/types";

import updateCounts from "./helpers/updateCounts";

const rejectComment = async (
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
};

export default rejectComment;
