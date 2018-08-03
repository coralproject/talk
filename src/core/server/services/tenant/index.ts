import { Redis } from "ioredis";
import { Db } from "mongodb";

import {
  Tenant,
  updateTenant,
  UpdateTenantInput,
} from "talk-server/models/tenant";

import TenantCache from "./cache";

export type UpdateTenant = UpdateTenantInput;

export async function update(
  db: Db,
  conn: Redis,
  cache: TenantCache,
  tenant: Tenant,
  input: UpdateTenant
): Promise<Tenant | null> {
  const updatedTenant = await updateTenant(db, tenant.id, input);
  if (!updatedTenant) {
    return null;
  }

  // Update the tenant cache.
  await cache.update(conn, updatedTenant);

  return updatedTenant;
}
