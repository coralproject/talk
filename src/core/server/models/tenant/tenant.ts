import { isEmpty } from "lodash";
import { DateTime } from "luxon";
import { Db } from "mongodb";
import { v4 as uuid } from "uuid";

import { DEFAULT_SESSION_DURATION } from "coral-common/constants";
import { LanguageCode } from "coral-common/helpers/i18n/locales";
import TIME from "coral-common/time";
import { DeepPartial, Sub } from "coral-common/types";
import { isBeforeDate } from "coral-common/utils";
import { dotize } from "coral-common/utils/dotize";
import {
  defaultRTEConfiguration,
  generateSigningSecret,
  Settings,
  SigningSecretResource,
} from "coral-server/models/settings";
import { I18n } from "coral-server/services/i18n";
import { tenants as collection } from "coral-server/services/mongodb/collections";

import {
  GQLAnnouncement,
  GQLFEATURE_FLAG,
  GQLMODERATION_MODE,
  GQLSettings,
  GQLWEBHOOK_EVENT_NAME,
} from "coral-server/graph/schema/__generated__/types";

import {
  getDefaultReactionConfiguration,
  getDefaultStaffConfiguration,
} from "./helpers";

/**
 * LEGACY_FEATURE_FLAGS are feature flags, that are no longer used.
 */
export enum LEGACY_FEATURE_FLAGS {
  ENABLE_AMP = "ENABLE_AMP",
  FLATTEN_REPLIES = "FLATTEN_REPLIES",
}

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

export interface Endpoint extends SigningSecretResource {
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
  featureFlags?: Array<GQLFEATURE_FLAG | LEGACY_FEATURE_FLAGS>;

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
    id: uuid(),

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
          signingSecrets: [generateSigningSecret("ssosec", now)],
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
        ipBased: false,
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
        authentication: false,
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
    premoderateSuspectWords: false,
    createdAt: now,
    slack: {
      channels: [],
    },
    memberBios: false,
    rte: defaultRTEConfiguration,
    amp: false,
    flattenReplies: false,
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

  return ids.map((id) => tenants.find((tenant) => tenant.id === id) || null);
}

export async function retrieveManyTenantsByDomain(
  mongo: Db,
  domains: ReadonlyArray<string>
) {
  const cursor = collection(mongo).find({
    domain: {
      $in: domains,
    },
  });

  const tenants = await cursor.toArray();

  return domains.map(
    (domain) => tenants.find((tenant) => tenant.domain === domain) || null
  );
}

export async function retrieveAllTenants(mongo: Db) {
  return collection(mongo).find({}).toArray();
}

export async function countTenants(mongo: Db) {
  return collection(mongo).find({}).count();
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
  if (!result.value) {
    throw new Error("tenant not found with id");
  }

  return result.value;
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
  if (!result.value) {
    throw new Error("tenant not found with id");
  }

  return result.value;
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
  if (!result.value) {
    throw new Error("tenant not found with id");
  }

  return result.value;
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
    id: uuid(),
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
