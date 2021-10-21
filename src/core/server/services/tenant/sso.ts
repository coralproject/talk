import { Redis } from "ioredis";
import { DateTime } from "luxon";

import { MongoContext } from "coral-server/data/context";
import {
  deactivateTenantSSOSigningSecret,
  deleteLastUsedAtTenantSSOSigningSecret,
  deleteTenantSSOSigningSecret,
  rotateTenantSSOSigningSecret,
  Tenant,
} from "coral-server/models/tenant";

import { TenantCache } from "./cache";

export async function rotateSSOSigningSecret(
  mongo: MongoContext,
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
  mongo: MongoContext,
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
  mongo: MongoContext,
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
