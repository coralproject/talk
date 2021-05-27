import { Db } from "mongodb";

import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { commentActions } from "coral-server/services/mongodb/collections";

const reviewCommentAction = async (
  mongo: Db,
  tenant: Tenant,
  viewer: User,
  now: Date,
  commentActionID: string
) => {
  const result = await commentActions(mongo).findOneAndUpdate(
    {
      tenantID: tenant.id,
      id: commentActionID,
    },
    {
      $set: {
        reviewed: true,
        reviewedBy: viewer ? viewer.id : "",
        reviewedAt: now,
      },
    },
    {
      returnOriginal: false,
    }
  );

  return result.value;
};

export default reviewCommentAction;
