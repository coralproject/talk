import { Redis } from "ioredis";
import { DateTime } from "luxon";
import { Db } from "mongodb";

import {
  deactivateTenantSSOSigningSecret,
  deleteLastUsedAtTenantSSOSigningSecret,
  deleteTenantSSOSigningSecret,
  rotateTenantSSOSigningSecret,
  Tenant,
} from "coral-server/models/tenant";

import { TenantCache } from "./cache";

/**
 * regenerateSSOKey will regenerate the Single Sign-On key for the specified
 * Tenant and notify all other Tenant's connected that the Tenant was updated.
 *
 * DEPRECATED: deprecated in favour of `rotateSSOSigningSecret`, remove in 6.2.0.
 */
export async function regenerateSSOKey(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  now: Date
) {
  // Regeneration is the same as rotating but with a specific 30 day window.
  return rotateSSOSigningSecret(
    mongo,
    redis,
    cache,
    tenant,
    30 * 24 * 60 * 60,
    now
  );
}

export async function rotateSSOSigningSecret(
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

  const updatedTenant = await rotateTenantSSOSigningSecret(
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

export async function deactivateSSOSigningSecret(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  kid: string,
  now: Date
) {
  const key = tenant.auth.integrations.sso.signingSecrets.find(
    (k) => k.kid === kid
  );
  if (!key) {
    throw new Error("specified kid not found on tenant");
  }

  // Deactivate the sso key now.
  const updatedTenant = await deactivateTenantSSOSigningSecret(
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

export async function deleteSSOSigningSecret(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  kid: string
) {
  const key = tenant.auth.integrations.sso.signingSecrets.find(
    (k) => k.kid === kid
  );
  if (!key) {
    throw new Error("specified kid not found on tenant");
  }

  // Deactivate the sso key now.
  const updatedTenant = await deleteTenantSSOSigningSecret(
    mongo,
    tenant.id,
    kid
  );
  if (!updatedTenant) {
    return null;
  }

  // Remove the last used date entry from the Redis hash.
  await deleteLastUsedAtTenantSSOSigningSecret(redis, tenant.id, kid);

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  return updatedTenant;
}
