import { Db } from "mongodb";

import { createSite, CreateSiteInput } from "coral-server/models/site";
import { Tenant } from "coral-server/models/tenant";

export async function create(
  mongo: Db,
  tenant: Tenant,
  communityID: string,
  site: CreateSiteInput,
  now = new Date()
) {
  return createSite(mongo, tenant.id, communityID, site, now);
}
