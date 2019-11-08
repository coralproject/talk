import { Db } from "mongodb";

import {
  createCommunity,
  CreateCommunityInput,
  updateCommunitySettings,
  UpdateCommunitySettingsInput,
} from "coral-server/models/community";
import { Tenant } from "coral-server/models/tenant";

export async function create(
  mongo: Db,
  tenant: Tenant,
  community: CreateCommunityInput,
  now = new Date()
) {
  return createCommunity(mongo, tenant.id, community, now);
}

export async function updateSettings(
  mongo: Db,
  tenant: Tenant,
  id: string,
  settings: UpdateCommunitySettingsInput
) {
  return updateCommunitySettings(mongo, tenant.id, id, settings);
}
