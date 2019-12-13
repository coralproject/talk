import { Redis } from "ioredis";
import { isUndefined } from "lodash";
import { DateTime } from "luxon";
import { Db } from "mongodb";
import { URL } from "url";

import { discover } from "coral-server/app/middleware/passport/strategies/oidc/discover";
import { Config } from "coral-server/config";
import { TenantInstalledAlreadyError } from "coral-server/errors";
import logger from "coral-server/logger";
import {
  createTenant,
  CreateTenantInput,
  createTenantSSOKey,
  rotateTenantSSOKey,
  Tenant,
  updateTenant,
} from "coral-server/models/tenant";
import { I18n } from "coral-server/services/i18n";

import {
  GQLSettingsInput,
  GQLSettingsWordListInput,
} from "coral-server/graph/tenant/schema/__generated__/types";

import TenantCache from "./cache";

export type UpdateTenant = GQLSettingsInput;

function cleanWordList(
  list: GQLSettingsWordListInput
): GQLSettingsWordListInput {
  if (list.banned) {
    list.banned = list.banned.filter(Boolean);
  }

  if (list.suspect) {
    list.suspect = list.suspect.filter(Boolean);
  }

  return list;
}

export async function update(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  config: Config,
  tenant: Tenant,
  input: UpdateTenant
): Promise<Tenant | null> {
  // If the environment variable for disabling live updates is provided, then
  // ensure we don't permit changes to the database model.
  if (
    config.get("disable_live_updates") &&
    input.live &&
    !isUndefined(input.live.enabled)
  ) {
    delete input.live.enabled;
  }

  // If the word list was specified, we should validate it to ensure there isn't
  // any empty spaces.
  if (input.wordList) {
    input.wordList = cleanWordList(input.wordList);
  }

  const updatedTenant = await updateTenant(mongo, tenant.id, input);
  if (!updatedTenant) {
    return null;
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  return updatedTenant;
}

/**
 * isInstalled will return a promise that if true, indicates that a Tenant has
 * been installed.
 */
export async function isInstalled(cache: TenantCache, domain?: string) {
  const count = await cache.count();
  if (count === 0) {
    return false;
  }

  if (domain) {
    const tenant = await cache.retrieveByDomain(domain);
    if (tenant) {
      return true;
    }

    return false;
  }

  return true;
}

export type InstallTenant = CreateTenantInput;

export async function install(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  i18n: I18n,
  input: InstallTenant,
  now = new Date()
) {
  // Ensure that this Tenant isn't being installed onto a domain that already
  // exists.
  if (await isInstalled(cache, input.domain)) {
    throw new TenantInstalledAlreadyError();
  }

  logger.info("installing tenant");

  // Create the Tenant.
  const tenant = await createTenant(mongo, i18n, input, now);

  // Update the tenant cache.
  await cache.update(redis, tenant);

  logger.info({ tenantID: tenant.id }, "a tenant has been installed");

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
  // Deprecate the old Tenant SSO key if it exists.
  if (tenant.auth.integrations.sso.keys.length > 0) {
    // Get the old keys that are not deprecated.
    const keysToDeprecate = tenant.auth.integrations.sso.keys.filter(key => {
      return !key.rotatedAt;
    });

    // Check to see if there are keys to deprecate.
    if (keysToDeprecate.length > 0) {
      // All the keys will be deprecated a month from now.
      // TODO: [CORL-754] (wyattjoh) take input for the deprecation duration later.
      const deprecateAt = DateTime.fromJSDate(now)
        .plus({ month: 1 })
        .toJSDate();

      // Deprecate all the keys that are associated on the tenant that haven't
      // been done.
      for (const key of keysToDeprecate) {
        await rotateTenantSSOKey(mongo, tenant.id, key.kid, deprecateAt, now);
      }
    }
  }

  // Create the new Tenant.
  const updatedTenant = await createTenantSSOKey(mongo, tenant.id, now);
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
