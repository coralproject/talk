import { Redis } from "ioredis";
import { Db } from "mongodb";

import { GQLSettingsInput } from "talk-server/graph/tenant/schema/__generated__/types";
import {
  createTenant,
  CreateTenantInput,
  Tenant,
  updateTenant,
} from "talk-server/models/tenant";

import logger from "talk-server/logger";
import TenantCache from "./cache";

export type UpdateTenant = GQLSettingsInput;

export async function update(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  input: UpdateTenant
): Promise<Tenant | null> {
  const updatedTenant = await updateTenant(mongo, tenant.id, input);
  if (!updatedTenant) {
    return null;
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  return updatedTenant;
}

export type InstallTenant = CreateTenantInput;

export async function install(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  input: InstallTenant
) {
  // Count how many Tenant's there are, if there is at least one, we can't use
  // install!
  const tenantCount = await cache.count();
  if (tenantCount >= 1) {
    // TODO: (wyattjoh) return better error
    throw new Error(
      "tenant already setup, setup multi-tenant mode if you want to install more than one tenant"
    );
  }

  // Create the Tenant.
  const tenant = await createTenant(mongo, input);

  // Update the tenant cache.
  await cache.update(redis, tenant);

  logger.info(
    { tenant_id: tenant.id, tenant_domain: tenant.domain },
    "a tenant has been installed"
  );

  return tenant;
}
