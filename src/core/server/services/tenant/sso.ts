import { Redis } from "ioredis";
import { DateTime } from "luxon";
import { Db } from "mongodb";

import {
  deactivateTenantSSOKey,
  deleteLastUsedAtTenantSSOKey,
  deleteTenantSSOKey,
  rollTenantSSOSecret,
  Tenant
} from "coral-server/models/tenant";

import { TenantCache } from "./cache";

/**
 * regenerateSSOKey will regenerate the Single Sign-On key for the specified
 * Tenant and notify all other Tenant's connected that the Tenant was updated.
 */
export async function regenerateSSOKey(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  now: Date
) {
  // Regeneration is the same as rotating but with a specific 30 day window.
  return rotateSSOKey(mongo, redis, cache, tenant, 30 * 24 * 60 * 60, now);
}

export async function rotateSSOKey(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  inactiveIn: number,
  now: Date
) {
  const inactiveAt = DateTime.fromJSDate(now)
    .plus({ seconds: inactiveIn })
    .toJSDate();

  const updatedTenant = await rollTenantSSOSecret(
    mongo,
    tenant.id,
    inactiveAt,
    now
  );
  if (!updatedTenant) {
    return null;
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  return updatedTenant;
}

export async function deactivateSSOKey(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  kid: string,
  now: Date
) {
  const key = tenant.auth.integrations.sso.signingSecrets.find(
    k => k.kid === kid
  );
  if (!key) {
    throw new Error("specified kid not found on tenant");
  }

  // Deactivate the sso key now.
  const updatedTenant = await deactivateTenantSSOKey(
    mongo,
    tenant.id,
    kid,
    now,
    now
  );
  if (!updatedTenant) {
    return null;
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  return updatedTenant;
}

export async function deleteSSOKey(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  kid: string
) {
  const key = tenant.auth.integrations.sso.signingSecrets.find(
    k => k.kid === kid
  );
  if (!key) {
    throw new Error("specified kid not found on tenant");
  }

  // Deactivate the sso key now.
  const updatedTenant = await deleteTenantSSOKey(mongo, tenant.id, kid);
  if (!updatedTenant) {
    return null;
  }

  // Remove the last used date entry from the Redis hash.
  await deleteLastUsedAtTenantSSOKey(redis, tenant.id, kid);

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  return updatedTenant;
}
