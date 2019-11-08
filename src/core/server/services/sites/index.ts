import { Db } from "mongodb";

import {
  createSite,
  CreateSiteInput,
  updateSiteSettings,
  UpdateSiteSettingsInput,
} from "coral-server/models/site";
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

export async function updateSettings(
  mongo: Db,
  tenant: Tenant,
  id: string,
  settings: UpdateSiteSettingsInput
) {
  return updateSiteSettings(mongo, tenant.id, id, settings);
}
