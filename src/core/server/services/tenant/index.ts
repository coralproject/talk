import { Redis } from "ioredis";
import { Db } from "mongodb";
import { URL } from "url";

import {
  GQLCreateOIDCAuthIntegrationConfigurationInput,
  GQLSettingsInput,
  GQLUpdateOIDCAuthIntegrationConfigurationInput,
} from "talk-server/graph/tenant/schema/__generated__/types";
import {
  createTenant,
  CreateTenantInput,
  createTenantOIDCAuthIntegration,
  regenerateTenantSSOKey,
  removeTenantOIDCAuthIntegration,
  Tenant,
  updateTenant,
  updateTenantOIDCAuthIntegration,
} from "talk-server/models/tenant";

import { discover } from "talk-server/app/middleware/passport/strategies/oidc/discover";
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
  if (await isInstalled(cache)) {
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
    { tenantID: tenant.id, tenantDomain: tenant.domain },
    "a tenant has been installed"
  );

  return tenant;
}

/**
 * canInstall will return a promise that determines if a given install can
 * proceed.
 */
export async function canInstall(cache: TenantCache) {
  return (await cache.count()) === 0;
}

/**
 * isInstalled will return a promise that if true, indicates that a Tenant has
 * been installed.
 */
export async function isInstalled(cache: TenantCache) {
  return (await cache.count()) > 0;
}

/**
 * regenerateSSOKey will regenerate the Single Sign-On key for the specified
 * Tenant and notify all other Tenant's connected that the Tenant was updated.
 */
export async function regenerateSSOKey(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant
) {
  const updatedTenant = await regenerateTenantSSOKey(mongo, tenant.id);
  if (!updatedTenant) {
    return null;
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  return updatedTenant;
}

/**
 * discoverOIDCConfiguration will discover the OpenID Connect configuration as
 * is required by any OpenID Connect compatible service:
 *
 * https://openid.net/specs/openid-connect-discovery-1_0.html#ProviderConfig
 *
 * @param issuerString the issuer that should be used as the discovery root.
 */
export async function discoverOIDCConfiguration(issuerString: string) {
  // Parse the issuer.
  const issuer = new URL(issuerString);

  // Discover the configuration.
  return discover(issuer);
}

export type CreateOIDCAuthIntegration = GQLCreateOIDCAuthIntegrationConfigurationInput;

export async function createOIDCAuthIntegration(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  input: CreateOIDCAuthIntegration
) {
  // Create the integration. By default, the integration is disabled.
  const result = await createTenantOIDCAuthIntegration(mongo, tenant.id, {
    enabled: false,
    allowRegistration: false,
    targetFilter: {
      admin: true,
      stream: true,
    },
    ...input,
  });
  if (!result.wasCreated || !result.tenant) {
    return null;
  }

  // Update the tenant cache.
  await cache.update(redis, result.tenant);

  return result;
}

export type UpdateOIDCAuthIntegration = GQLUpdateOIDCAuthIntegrationConfigurationInput;

export async function updateOIDCAuthIntegration(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  oidcID: string,
  input: UpdateOIDCAuthIntegration
) {
  // Update the integration. By default, the integration is disabled.
  const result = await updateTenantOIDCAuthIntegration(
    mongo,
    tenant.id,
    oidcID,
    input
  );
  if (!result.wasUpdated || !result.tenant) {
    return null;
  }

  // Update the tenant cache.
  await cache.update(redis, result.tenant);

  return result;
}

export async function removeOIDCAuthIntegration(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  oidcID: string
) {
  // Delete the integration. By default, the integration is disabled.
  const result = await removeTenantOIDCAuthIntegration(
    mongo,
    tenant.id,
    oidcID
  );
  if (!result.wasRemoved || !result.tenant) {
    return null;
  }

  // Update the tenant cache.
  await cache.update(redis, result.tenant);

  return result;
}
