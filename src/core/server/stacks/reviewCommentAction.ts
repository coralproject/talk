import { Db } from "mongodb";

import { Tenant } from "coral-server/models/tenant";
import { commentActions } from "coral-server/services/mongodb/collections";

const reviewCommentAction = async (
  mongo: Db,
  tenant: Tenant,
  commentActionID: string,
  reviewed: boolean
) => {
  const result = await commentActions(mongo).findOneAndUpdate(
    {
      tenantID: tenant.id,
      id: commentActionID,
    },
    {
      $set: { reviewed },
    },
    {
      returnOriginal: false,
    }
  );

  return result.value;
};

export default reviewCommentAction;
