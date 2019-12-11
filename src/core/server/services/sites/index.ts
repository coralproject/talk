import { Db } from "mongodb";

import { Omit } from "coral-common/types";
import { retrieveTenantCommunities } from "coral-server/models/community";
import { createSite, CreateSiteInput } from "coral-server/models/site";
import { Tenant } from "coral-server/models/tenant";

type CreateSite = Omit<CreateSiteInput, "communityID" | "tenantID"> & {
  communityID?: string;
};

export async function create(
  mongo: Db,
  tenant: Tenant,
  input: CreateSite,
  now = new Date()
) {
  let { communityID } = input;
  if (!communityID) {
    const communities = await retrieveTenantCommunities(mongo, tenant.id);
    if (communities.length > 1) {
      throw new Error("must specify community ID");
    }
    communityID = communities[0].id;
  }
  return createSite(
    mongo,
    {
      ...input,
      communityID,
      tenantID: tenant.id,
    },
    now
  );
}
