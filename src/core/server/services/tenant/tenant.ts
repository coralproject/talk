import { Redis } from "ioredis";
import { isUndefined, toLower, uniqBy } from "lodash";
import { URL } from "url";

import { isModerator, isOrgModerator } from "coral-common/permissions/types";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import {
  TenantInstalledAlreadyError,
  UserForbiddenError,
  UserNotFoundError,
} from "coral-server/errors";
import logger from "coral-server/logger";
import { retrieveTenantSites } from "coral-server/models/site";
import {
  CreateAnnouncementInput,
  CreateEmailDomainInput,
  createTenant,
  createTenantAnnouncement,
  createTenantEmailDomain,
  CreateTenantInput,
  DeleteEmailDomainInput,
  deleteTenantAnnouncement,
  deleteTenantEmailDomain,
  disableTenantFeatureFlag,
  enableTenantFeatureFlag,
  Tenant,
  UpdateEmailDomainInput,
  updateTenant,
  updateTenantEmailDomain,
} from "coral-server/models/tenant";
import { retrieveUser, User } from "coral-server/models/user";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { I18n } from "coral-server/services/i18n";
import { discover } from "coral-server/services/oidc/discover";

import {
  GQLFEATURE_FLAG,
  GQLSettingsInput,
  GQLSettingsWordListInput,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";

import TenantCache from "./cache/cache";

export type UpdateTenant = GQLSettingsInput;

function cleanWordlist(list: string[]): string[] {
  return uniqBy<string>(
    list
      // For each phrase, trim any whitespace.
      .map((phrase) => phrase.trim())
      // Only allow truthy phrases (no empty strings)!
      .filter((phrase) => !!phrase),
    // Only allow unique phrases. This ensures we don't discriminate based on
    // case.
    toLower
  );
}

function cleanWordLists(
  list: GQLSettingsWordListInput
): GQLSettingsWordListInput {
  if (list.banned) {
    list.banned = cleanWordlist(list.banned);
  }

  if (list.suspect) {
    list.suspect = cleanWordlist(list.suspect);
  }

  return list;
}

export async function update(
  mongo: MongoContext,
  redis: Redis,
  cache: TenantCache,
  config: Config,
  tenant: Tenant,
  user: User,
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
    input.wordList = cleanWordLists(input.wordList);
  }

  // Whenever the settings are updated, log who performed the update and what
  // keys they updated.
  logger.info(
    { update: Object.keys(input), userID: user.id, tenantID: tenant.id },
    "settings update audit"
  );

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
  mongo: MongoContext,
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

export async function enableFeatureFlag(
  mongo: MongoContext,
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
  mongo: MongoContext,
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
  mongo: MongoContext,
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
  mongo: MongoContext,
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

export async function sendSMTPTest(
  tenant: Tenant,
  user: User,
  mailer: MailerQueue
) {
  if (user.email) {
    if (!tenant.email.enabled) {
      throw new Error("Email not enabled");
    }
    await mailer.add({
      tenantID: tenant.id,
      message: {
        to: user.email,
      },
      template: {
        name: "test/smtp-test",
        context: {
          email: user.email,
        },
      },
    });
  }
  return tenant;
}

export async function createEmailDomain(
  mongo: MongoContext,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  viewer: Pick<User, "id"> | undefined,
  input: CreateEmailDomainInput
) {
  // TODO: This is tech debt, to be removed when
  // MODERATOR is split into ORG_MODERATOR + SITE_MODERATOR
  if (!viewer) {
    throw new UserForbiddenError(
      "Must be authenticated to create email domain ban",
      "emailDomain",
      "create"
    );
  }

  const fullViewer = await retrieveUser(mongo, tenant.id, viewer.id);
  if (!fullViewer) {
    throw new UserNotFoundError("Viewer not found");
  }

  const tenantSites = await retrieveTenantSites(mongo, tenant.id);
  const isAdmin = fullViewer.role === GQLUSER_ROLE.ADMIN;
  const multiSiteEnabled = tenantSites.length > 1;
  const modOnSingleSite = isModerator(fullViewer) && !multiSiteEnabled;
  const orgModOnMultiSite = isOrgModerator(fullViewer) && multiSiteEnabled;

  const allowed =
    fullViewer.tenantID === tenant.id &&
    (isAdmin || modOnSingleSite || orgModOnMultiSite);

  if (!allowed) {
    throw new UserForbiddenError(
      "Insufficient priviledges to create email domain",
      "emailDomain",
      "create",
      viewer.id
    );
  }
  const updated = await createTenantEmailDomain(mongo, tenant.id, input);
  if (!updated) {
    throw new Error("tenant not found");
  }
  await cache.update(redis, updated);

  return updated;
}

export async function updateEmailDomain(
  mongo: MongoContext,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  input: UpdateEmailDomainInput
) {
  const updated = await updateTenantEmailDomain(mongo, tenant.id, input);
  if (!updated) {
    throw new Error("tenant not found");
  }
  await cache.update(redis, updated);

  return updated;
}

export async function deleteEmailDomain(
  mongo: MongoContext,
  redis: Redis,
  cache: TenantCache,
  tenant: Tenant,
  input: DeleteEmailDomainInput
) {
  const updated = await deleteTenantEmailDomain(mongo, tenant.id, input);
  if (!updated) {
    throw new Error("tenant not found");
  }
  await cache.update(redis, updated);

  return updated;
}
