import { Db } from "mongodb";

import {
  createCommunity,
  CreateCommunityInput,
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
