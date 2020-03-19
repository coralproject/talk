import { Redis } from "ioredis";
import { isUndefined, lowerCase, uniqBy } from "lodash";
import { DateTime } from "luxon";
import { Db } from "mongodb";
import { URL } from "url";

import { discover } from "coral-server/app/middleware/passport/strategies/oidc/discover";
import { Config } from "coral-server/config";
import { TenantInstalledAlreadyError } from "coral-server/errors";
import logger from "coral-server/logger";
import {
  CreateAnnouncementInput,
  createTenant,
  createTenantAnnouncement,
  CreateTenantInput,
  createTenantWebhookEndpoint,
  CreateTenantWebhookEndpointInput,
  deleteTenantAnnouncement,
  deleteTenantWebhookEndpoint,
  disableTenantFeatureFlag,
  enableTenantFeatureFlag,
  getWebhookEndpoint,
  rollTenantWebhookEndpointSecret,
  Tenant,
  updateTenant,
  updateTenantWebhookEndpoint,
  UpdateTenantWebhookEndpointInput,
} from "coral-server/models/tenant";
import { I18n } from "coral-server/services/i18n";

import {
  GQLFEATURE_FLAG,
  GQLSettingsInput,
  GQLSettingsWordListInput,
  GQLWEBHOOK_EVENT_NAME,
} from "coral-server/graph/schema/__generated__/types";

import TenantCache from "./cache";

export type UpdateTenant = GQLSettingsInput;

function cleanWordList(
  list: GQLSettingsWordListInput
): GQLSettingsWordListInput {
  if (list.banned) {
    list.banned = uniqBy(list.banned.filter(Boolean), lowerCase) as string[];
  }

  if (list.suspect) {
    list.suspect = uniqBy(list.suspect.filter(Boolean), lowerCase) as string[];
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

interface WebhookEndpointInput {
  url: string;
  all: boolean;
  events: GQLWEBHOOK_EVENT_NAME[];
}

export function validateWebhookEndpointInput(
  config: Config,
  input: WebhookEndpointInput
) {
  // Check to see that this URL is valid and has a https:// scheme if in
  // production mode.
  const url = new URL(input.url);
  if (config.get("env") === "production" && url.protocol !== "https:") {
    throw new Error(`invalid scheme provided in production: ${url.protocol}`);
  }

  // Ensure that either the "all" or "events" is provided but not both.
  if (input.all && input.events.length > 0) {
    throw new Error("both all events and specific events were requested");
  }
}

export async function createWebhookEndpoint(
  mongo: Db,
  redis: Redis,
  config: Config,
  cache: TenantCache,
  tenant: Tenant,
  input: CreateTenantWebhookEndpointInput,
  now: Date
) {
  // Validate the input.
  validateWebhookEndpointInput(config, input);

  // Looks good in create this, send it off to be created.
  const result = await createTenantWebhookEndpoint(
    mongo,
    tenant.id,
    input,
    now
  );
  if (!result.tenant) {
    throw new Error("could not create the tenant endpoint, tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, result.tenant);

  return {
    endpoint: result.endpoint,
    settings: result.tenant,
  };
}

export async function updateWebhookEndpoint(
  mongo: Db,
  redis: Redis,
  config: Config,
  cache: TenantCache,
  tenant: Tenant,
  endpointID: string,
  input: UpdateTenantWebhookEndpointInput
) {
  // Find the endpoint.
  let endpoint = getWebhookEndpoint(tenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  // Extract the input.
  const {
    url = endpoint.url,
    all = endpoint.all,
    events = endpoint.events,
  } = input;

  // Validate the input.
  validateWebhookEndpointInput(config, {
    url,
    all,
    events,
  });

  const updatedTenant = await updateTenantWebhookEndpoint(
    mongo,
    tenant.id,
    endpointID,
    input
  );
  if (!updatedTenant) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  // Find the updated endpoint.
  endpoint = getWebhookEndpoint(updatedTenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  return endpoint;
}

export async function enableWebhookEndpoint(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  endpointID: string
) {
  // Find the endpoint.
  let endpoint = getWebhookEndpoint(tenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  // Endpoint is already enabled.
  if (endpoint.enabled === true) {
    return endpoint;
  }

  const updatedTenant = await updateTenantWebhookEndpoint(
    mongo,
    tenant.id,
    endpointID,
    { enabled: true }
  );
  if (!updatedTenant) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  // Find the updated endpoint.
  endpoint = getWebhookEndpoint(updatedTenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  return endpoint;
}

export async function disableWebhookEndpoint(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  endpointID: string
) {
  // Find the endpoint.
  let endpoint = getWebhookEndpoint(tenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  // Endpoint is already disabled.
  if (endpoint.enabled === false) {
    return endpoint;
  }

  const updatedTenant = await updateTenantWebhookEndpoint(
    mongo,
    tenant.id,
    endpointID,
    { enabled: false }
  );
  if (!updatedTenant) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  // Find the updated endpoint.
  endpoint = getWebhookEndpoint(updatedTenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  return endpoint;
}

export async function deleteWebhookEndpoint(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  endpointID: string
) {
  // Find the endpoint.
  const endpoint = getWebhookEndpoint(tenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  const updatedTenant = await deleteTenantWebhookEndpoint(
    mongo,
    tenant.id,
    endpointID
  );
  if (!updatedTenant) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  return endpoint;
}

export async function rotateWebhookEndpointSecret(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  endpointID: string,
  inactiveIn: number,
  now: Date
) {
  // Compute the inactiveAt dates for the current active secrets.
  const inactiveAt = DateTime.fromJSDate(now)
    .plus({ seconds: inactiveIn })
    .toJSDate();

  // Rotate the secrets.
  const updatedTenant = await rollTenantWebhookEndpointSecret(
    mongo,
    tenant.id,
    endpointID,
    inactiveAt,
    now
  );
  if (!updatedTenant) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updatedTenant);

  // Find the updated endpoint.
  const endpoint = getWebhookEndpoint(updatedTenant, endpointID);
  if (!endpoint) {
    throw new Error("referenced endpoint was not found on tenant");
  }

  return endpoint;
}

export async function enableFeatureFlag(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  flag: GQLFEATURE_FLAG
) {
  // If the Tenant already has this flag, don't bother adding it again.
  if (tenant.featureFlags && tenant.featureFlags.includes(flag)) {
    return tenant.featureFlags;
  }

  // Enable the feature flag.
  const updated = await enableTenantFeatureFlag(mongo, tenant.id, flag);
  if (!updated || !updated.featureFlags) {
    // As we just added the feature flag, we would expect that the Tenant would
    // always have the feature flags set to some array.
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updated);

  // Return the updated feature flags.
  return updated.featureFlags;
}

export async function disableFeatureFlag(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  flag: GQLFEATURE_FLAG
) {
  // If the feature flag doesn't exist on the Tenant (or the Tenant has no
  // feature flags), don't bother trying to remove it again.
  if (!tenant.featureFlags || !tenant.featureFlags.includes(flag)) {
    return tenant.featureFlags || [];
  }

  // Remove the feature flag.
  const updated = await disableTenantFeatureFlag(mongo, tenant.id, flag);
  if (!updated) {
    throw new Error("tenant not found");
  }

  // Update the tenant cache.
  await cache.update(redis, updated);

  // Return the updated feature flags (or [] if there was no feature flags to
  // begin with).
  return updated.featureFlags || [];
}

export async function createAnnouncement(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  input: CreateAnnouncementInput,
  now = new Date()
) {
  const updated = await createTenantAnnouncement(mongo, tenant.id, input, now);
  if (!updated) {
    throw new Error("tenant not found");
  }
  await cache.update(redis, updated);
  return updated;
}

export async function deleteAnnouncement(
  mongo: Db,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant
) {
  const updated = await deleteTenantAnnouncement(mongo, tenant.id);
  if (!updated) {
    throw new Error("tenant not found");
  }
  await cache.update(redis, updated);
  return updated;
}
