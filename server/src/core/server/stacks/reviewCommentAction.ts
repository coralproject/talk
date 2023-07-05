import { MongoContext } from "coral-server/data/context";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";

const reviewCommentAction = async (
  mongo: MongoContext,
  tenant: Tenant,
  viewer: User,
  now: Date,
  commentActionID: string
) => {
  const result = await mongo.commentActions().findOneAndUpdate(
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
