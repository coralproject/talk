import { Redis } from "ioredis";
import { isEmpty } from "lodash";
import { DateTime } from "luxon";
import { Db } from "mongodb";
import uuid from "uuid";

import { DEFAULT_SESSION_DURATION } from "coral-common/constants";
import { LanguageCode } from "coral-common/helpers/i18n/locales";
import TIME from "coral-common/time";
import { DeepPartial, Omit, Sub } from "coral-common/types";
import { isBeforeDate } from "coral-common/utils";
import { dotize } from "coral-common/utils/dotize";
import logger from "coral-server/logger";
import { I18n } from "coral-server/services/i18n";
import { tenants as collection } from "coral-server/services/mongodb/collections";

import {
  GQLAnnouncement,
  GQLFEATURE_FLAG,
  GQLMODERATION_MODE,
  GQLSettings,
  GQLWEBHOOK_EVENT_NAME,
} from "coral-server/graph/schema/__generated__/types";

import { Secret, Settings } from "../settings";
import {
  generateSecret,
  getDefaultReactionConfiguration,
  getDefaultStaffConfiguration,
  getWebhookEndpoint,
} from "./helpers";

/**
 * TenantResource references a given resource that should be owned by a specific
 * Tenant.
 */
export interface TenantResource {
  /**
   * tenantID is the reference to the specific Tenant that owns this particular
   * resource.
   */
  readonly tenantID: string;
}

export interface Endpoint {
  /**
   * id is the unique identifier for this specific endpoint.
   */
  id: string;

  /**
   * enabled when true will enable events to be sent to this endpoint.
   */
  enabled: boolean;

  /**
   * url is the URL that we will POST event data to.
   */
  url: string;

  /**
   * signingSecret is the secret used to sign the events sent out.
   */
  signingSecrets: Secret[];

  /**
   * all when true indicates that all events should trigger.
   */
  all: boolean;

  /**
   * events is the array of events that will trigger the delivery of an
   * event.
   */
  events: GQLWEBHOOK_EVENT_NAME[];

  /**
   * createdAt is the date that this endpoint was created.
   */
  createdAt: Date;

  /**
   * modifiedAt is the date that this Endpoint was last modified at.
   */
  modifiedAt?: Date;
}

export interface TenantSettings
  extends Pick<GQLSettings, "domain" | "organization"> {
  readonly id: string;

  /**
   * locale is the specified locale for this Tenant.
   */
  locale: LanguageCode;

  /**
   * featureFlags is the set of flags enabled on this Tenant.
   */
  featureFlags?: GQLFEATURE_FLAG[];

  /**
   * webhooks stores the configurations for this Tenant's webhook rules.
   */
  webhooks: {
    /**
     * endpoints is all the configured endpoints that should receive events.
     */
    endpoints: Endpoint[];
  };
}

/**
 * Tenant describes a given Tenant on Coral that has Stories, Comments, and Users.
 */
export type Tenant = Settings & TenantSettings;

/**
 * CreateTenantInput is the set of properties that can be set when a given
 * Tenant is created. The remainder of the properties are set from defaults and
 * are modifiable via the update method.
 */
export type CreateTenantInput = Pick<
  Tenant,
  "domain" | "locale" | "organization"
>;

export interface TenantComputedProperties {
  multisite: boolean;
}
/**
 * create will create a new Tenant.
 *
 * @param mongo the MongoDB connection used to create the tenant.
 * @param i18n i18n instance
 * @param input the customizable parts of the Tenant available during creation
 */
export async function createTenant(
  mongo: Db,
  i18n: I18n,
  input: CreateTenantInput,
  now = new Date()
) {
  // Get the tenant's bundle.
  const bundle = i18n.getBundle(input.locale);

  const defaults: Sub<Tenant, CreateTenantInput> = {
    // Create a new ID.
    id: uuid.v4(),

    // Default to post moderation.
    moderation: GQLMODERATION_MODE.POST,

    // Default to enabled.
    live: {
      enabled: true,
    },

    communityGuidelines: {
      enabled: false,
      content: "",
    },
    premodLinksEnable: false,
    closeCommenting: {
      auto: false,
      timeout: 2 * TIME.WEEK,
    },
    disableCommenting: {
      enabled: false,
    },
    editCommentWindowLength: 30 * TIME.SECOND,
    webhooks: {
      endpoints: [],
    },
    charCount: {
      enabled: false,
    },
    wordList: {
      suspect: [],
      banned: [],
    },
    auth: {
      sessionDuration: DEFAULT_SESSION_DURATION,
      integrations: {
        local: {
          enabled: true,
          allowRegistration: true,
          targetFilter: {
            admin: true,
            stream: true,
          },
        },
        sso: {
          enabled: false,
          allowRegistration: false,
          targetFilter: {
            admin: true,
            stream: true,
          },
          // TODO: [CORL-754] (wyattjoh) remove this in favor of generating this when needed
          keys: [generateSecret("ssosec", now)],
        },
        oidc: {
          enabled: false,
          allowRegistration: false,
          targetFilter: {
            admin: true,
            stream: true,
          },
        },
        google: {
          enabled: false,
          allowRegistration: false,
          targetFilter: {
            admin: true,
            stream: true,
          },
        },
        facebook: {
          enabled: false,
          allowRegistration: false,
          targetFilter: {
            admin: true,
            stream: true,
          },
        },
      },
    },
    email: {
      enabled: false,
      smtp: {},
    },
    recentCommentHistory: {
      enabled: false,
      timeFrame: 7 * TIME.DAY,
      // Rejection rate defaulting to 30%, once exceeded, comments will be
      // pre-moderated.
      triggerRejectionRate: 0.3,
    },
    integrations: {
      akismet: {
        enabled: false,
      },
      perspective: {
        enabled: false,
        doNotStore: true,
        sendFeedback: false,
      },
    },
    reaction: getDefaultReactionConfiguration(bundle),
    staff: getDefaultStaffConfiguration(bundle),
    stories: {
      scraping: {
        enabled: true,
      },
      disableLazy: false,
    },
    accountFeatures: {
      changeUsername: false,
      deleteAccount: false,
      downloadComments: false,
    },
    newCommenters: {
      premodEnabled: false,
      approvedCommentsThreshold: 2,
    },
    createdAt: now,
    slack: {
      channels: [],
    },
  };

  // Create the new Tenant by merging it together with the defaults.
  const tenant: Readonly<Tenant> = {
    ...defaults,
    ...input,
  };

  // Insert the Tenant into the database.
  await collection(mongo).insertOne(tenant);

  return tenant;
}

export async function retrieveTenantByDomain(mongo: Db, domain: string) {
  return collection(mongo).findOne({ domain });
}

export async function retrieveTenant(mongo: Db, id: string) {
  return collection(mongo).findOne({ id });
}

export async function retrieveManyTenants(
  mongo: Db,
  ids: ReadonlyArray<string>
) {
  const cursor = collection(mongo).find({
    id: {
      $in: ids,
    },
  });

  const tenants = await cursor.toArray();

  return ids.map(id => tenants.find(tenant => tenant.id === id) || null);
}

export async function retrieveManyTenantsByDomain(
  mongo: Db,
  domains: string[]
) {
  const cursor = collection(mongo).find({
    domain: {
      $in: domains,
    },
  });

  const tenants = await cursor.toArray();

  return domains.map(
    domain => tenants.find(tenant => tenant.domain === domain) || null
  );
}

export async function retrieveAllTenants(mongo: Db) {
  return collection(mongo)
    .find({})
    .toArray();
}

export async function countTenants(mongo: Db) {
  return collection(mongo)
    .find({})
    .count();
}

export type UpdateTenantInput = Omit<DeepPartial<Tenant>, "id" | "domain">;

export async function updateTenant(
  mongo: Db,
  id: string,
  update: UpdateTenantInput
) {
  const $set = dotize(update, { embedArrays: true });

  // Check to see if there is any updates that will be made.
  if (isEmpty($set)) {
    // No updates need to be made, abort here and just return the tenant.
    return retrieveTenant(mongo, id);
  }

  // Get the tenant from the database.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    // Only update fields that have been updated.
    { $set },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );

  return result.value || null;
}

/**
 * regenerateTenantSSOKey will regenerate the SSO key used for Single Sing-On
 * for the specified Tenant. All existing user sessions signed with the old
 * secret will be invalidated.
 */
export async function createTenantSSOKey(mongo: Db, id: string, now: Date) {
  // Construct the new key.
  const key = generateSecret("ssosec", now);

  // Update the Tenant with this new key.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      $push: {
        "auth.integrations.sso.keys": key,
      },
    },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return result.value || null;
}

export async function deactivateTenantSSOKey(
  mongo: Db,
  id: string,
  kid: string,
  inactiveAt: Date,
  now: Date
) {
  // Update the tenant.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      $set: {
        "auth.integrations.sso.keys.$[keys].inactiveAt": inactiveAt,
        "auth.integrations.sso.keys.$[keys].rotatedAt": now,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
      // Add an ArrayFilter to only update one of the keys.
      arrayFilters: [{ "keys.kid": kid }],
    }
  );

  return result.value || null;
}

export async function enableTenantFeatureFlag(
  mongo: Db,
  id: string,
  flag: GQLFEATURE_FLAG
) {
  // Update the Tenant.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      // Add the flag to the set of enabled flags.
      $addToSet: {
        featureFlags: flag,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );

  return result.value || null;
}

export async function disableTenantFeatureFlag(
  mongo: Db,
  id: string,
  flag: GQLFEATURE_FLAG
) {
  // Update the Tenant.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      // Pull the flag from the set of enabled flags.
      $pull: {
        featureFlags: flag,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );

  return result.value || null;
}
export async function deleteTenantSSOKey(mongo: Db, id: string, kid: string) {
  // Update the tenant.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      $pull: {
        "auth.integrations.sso.keys": { kid },
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );

  return result.value || null;
}

export interface CreateAnnouncementInput {
  content: string;
  duration: number;
}

export async function createTenantAnnouncement(
  mongo: Db,
  id: string,
  input: CreateAnnouncementInput,
  now = new Date()
) {
  const announcement = {
    id: uuid.v4(),
    ...input,
    createdAt: now,
  };

  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      $set: {
        announcement,
      },
    },
    {
      returnOriginal: false,
    }
  );
  return result.value;
}

export async function deleteTenantAnnouncement(mongo: Db, id: string) {
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      $unset: {
        announcement: "",
      },
    },
    {
      returnOriginal: false,
    }
  );
  return result.value;
}

export function retrieveAnnouncementIfEnabled(
  announcement?: GQLAnnouncement | null
) {
  if (!announcement) {
    return null;
  }
  const disableAt = DateTime.fromJSDate(announcement.createdAt)
    .plus({ seconds: announcement.duration })
    .toJSDate();
  if (isBeforeDate(disableAt)) {
    return {
      ...announcement,
      disableAt,
    };
  }
  return null;
}

export async function rollTenantWebhookEndpointSecret(
  mongo: Db,
  id: string,
  endpointID: string,
  inactiveAt: Date,
  now: Date
) {
  // Create the new secret.
  const secret = generateSecret("whsec", now);

  // Update the Tenant with this new secret.
  let result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      $push: { "webhooks.endpoints.$[endpoint].signingSecrets": secret },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
      arrayFilters: [
        // Select the endpoint we're updating.
        { "endpoint.id": endpointID },
      ],
    }
  );
  if (!result.value) {
    return null;
  }

  // Grab the endpoint we just modified.
  const endpoint = getWebhookEndpoint(result.value, endpointID);
  if (!endpoint) {
    return null;
  }

  // Get the secrets we need to deactivate...
  const secretKIDsToDeprecate = endpoint.signingSecrets
    // By excluding the last one (the one we just pushed)...
    .splice(0, endpoint.signingSecrets.length - 1)
    // And only finding keys that have not been rotated yet.
    .filter(s => !s.rotatedAt)
    // And get their kid's.
    .map(s => s.kid);
  if (secretKIDsToDeprecate.length > 0) {
    logger.trace(
      { kids: secretKIDsToDeprecate },
      "deprecating old signingSecrets"
    );

    // Deactivate the old keys.
    result = await collection(mongo).findOneAndUpdate(
      { id },
      {
        $set: {
          "webhooks.endpoints.$[endpoint].signingSecrets.$[signingSecret].inactiveAt": inactiveAt,
          "webhooks.endpoints.$[endpoint].signingSecrets.$[signingSecret].rotatedAt": now,
        },
      },
      {
        arrayFilters: [
          // Select the endpoint we're updating.
          { "endpoint.id": endpointID },
          // Select any signing secrets with the given ids.
          { "signingSecret.kid": { $in: secretKIDsToDeprecate } },
        ],
      }
    );
  }

  return result.value;
}

export interface CreateTenantWebhookEndpointInput {
  url: string;
  all: boolean;
  events: GQLWEBHOOK_EVENT_NAME[];
}

export async function createTenantWebhookEndpoint(
  mongo: Db,
  id: string,
  input: CreateTenantWebhookEndpointInput,
  now: Date
) {
  // Create the new endpoint.
  const endpoint: Endpoint = {
    ...input,
    id: uuid(),
    enabled: true,
    signingSecrets: [generateSecret("whsec", now)],
    createdAt: now,
  };

  // Update the Tenant with this new endpoint.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    { $push: { "webhooks.endpoints": endpoint } },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    const tenant = await retrieveTenant(mongo, id);
    if (!tenant) {
      return {
        endpoint: null,
        tenant: null,
      };
    }

    throw new Error("update failed for an unexpected reason");
  }

  return {
    endpoint,
    tenant: result.value,
  };
}

export interface UpdateTenantWebhookEndpointInput {
  enabled?: boolean;
  url?: string;
  all?: boolean;
  events?: GQLWEBHOOK_EVENT_NAME[];
}

export async function updateTenantWebhookEndpoint(
  mongo: Db,
  id: string,
  endpointID: string,
  update: UpdateTenantWebhookEndpointInput
) {
  const $set = dotize(
    { "webhooks.endpoints.$[endpoint]": update },
    { embedArrays: true }
  );

  // Check to see if there is any updates that will be made.
  if (isEmpty($set)) {
    // No updates need to be made, abort here and just return the tenant.
    return retrieveTenant(mongo, id);
  }

  // Perform the actual update operation.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    { $set },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
      arrayFilters: [{ "endpoint.id": endpointID }],
    }
  );
  if (!result.value) {
    const tenant = await retrieveTenant(mongo, id);
    if (!tenant) {
      return null;
    }

    const endpoint = getWebhookEndpoint(tenant, endpointID);
    if (!endpoint) {
      throw new Error(
        `endpoint not found with id: ${endpointID} on tenant: ${id}`
      );
    }

    throw new Error("update failed for an unexpected reason");
  }

  return result.value;
}

export async function deleteEndpointSecrets(
  mongo: Db,
  id: string,
  endpointID: string,
  kids: string[]
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      $pull: {
        "webhooks.endpoints.$[endpoint].signingSecrets": { kid: { $in: kids } },
      },
    },
    { returnOriginal: false, arrayFilters: [{ "endpoint.id": endpointID }] }
  );
  if (!result.value) {
    const tenant = await retrieveTenant(mongo, id);
    if (!tenant) {
      return null;
    }

    const endpoint = getWebhookEndpoint(tenant, endpointID);
    if (!endpoint) {
      throw new Error(
        `endpoint not found with id: ${endpointID} on tenant: ${id}`
      );
    }

    throw new Error("update failed for an unexpected reason");
  }

  return result.value;
}

export async function deleteTenantWebhookEndpoint(
  mongo: Db,
  id: string,
  endpointID: string
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    {
      $pull: {
        "webhooks.endpoints": { id: endpointID },
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    const tenant = await retrieveTenant(mongo, id);
    if (!tenant) {
      return null;
    }

    throw new Error("update failed for an unexpected reason");
  }

  return result.value;
}

function lastUsedAtTenantSSOKey(id: string): string {
  return `${id}:lastUsedSSOKey`;
}

/**
 * updateLastUsedAtTenantSSOKey will update the time stamp that the SSO key was
 * last used at.
 *
 * @param redis the Redis connection to use to update the timestamp on
 * @param id the ID of the Tenant
 * @param kid the kid of the token that was used
 * @param when the date that the token was last used at
 */
export async function updateLastUsedAtTenantSSOKey(
  redis: Redis,
  id: string,
  kid: string,
  when: Date
) {
  await redis.hset(lastUsedAtTenantSSOKey(id), kid, when.toISOString());
}

/**
 *
 * @param redis the Redis connection to use to remove the last used on.
 * @param id the ID of the Tenant
 * @param kid the kid of the token that is being deleted
 */
export async function deleteLastUsedAtTenantSSOKey(
  redis: Redis,
  id: string,
  kid: string
) {
  await redis.hdel(lastUsedAtTenantSSOKey(id), kid);
}

/**
 * retrieveLastUsedAtTenantSSOKeys will get the dates that the requested sso
 * keys were last used on.
 *
 * @param redis the Redis connection to use to update the timestamp on
 * @param id the ID of the Tenant
 * @param kids the kids of the tokens that we want to know when they were last used
 */
export async function retrieveLastUsedAtTenantSSOKeys(
  redis: Redis,
  id: string,
  kids: string[]
) {
  const results: Array<string | null> = await redis.hmget(
    lastUsedAtTenantSSOKey(id),
    ...kids
  );

  return results.map(lastUsedAt => {
    if (!lastUsedAt) {
      return null;
    }

    return new Date(lastUsedAt);
  });
}
