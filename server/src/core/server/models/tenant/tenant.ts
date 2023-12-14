import { isEmpty } from "lodash";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";

import { DEFAULT_SESSION_DURATION } from "coral-common/common/lib/constants";
import { LanguageCode } from "coral-common/common/lib/helpers/i18n/locales";
import TIME from "coral-common/common/lib/time";
import { DeepPartial, Sub } from "coral-common/common/lib/types";
import { isBeforeDate } from "coral-common/common/lib/utils";
import { MongoContext } from "coral-server/data/context";
import {
  DuplicateEmailDomainError,
  DuplicateFlairBadgeError,
} from "coral-server/errors";
import {
  defaultRTEConfiguration,
  generateSigningSecret,
  Settings,
  SigningSecretResource,
} from "coral-server/models/settings";
import { I18n } from "coral-server/services/i18n";
import { dotize } from "coral-server/utils/dotize";

import {
  GQLAnnouncement,
  GQLDSA_METHOD_OF_REDRESS,
  GQLFEATURE_FLAG,
  GQLMODERATION_MODE,
  GQLSettings,
  GQLWEBHOOK_EVENT_NAME,
} from "coral-server/graph/schema/__generated__/types";

import {
  getDefaultBadgeConfiguration,
  getDefaultReactionConfiguration,
} from "./helpers";

/**
 * LEGACY_FEATURE_FLAGS are feature flags, that are no longer used.
 */
export enum LEGACY_FEATURE_FLAGS {
  ENABLE_AMP = "ENABLE_AMP",
  FLATTEN_REPLIES = "FLATTEN_REPLIES",
  FOR_REVIEW = "FOR_REVIEW",
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
  mongo: MongoContext,
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

    premoderateAllCommentsSites: [],

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
    badges: getDefaultBadgeConfiguration(bundle),
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
      moderation: {
        mode: GQLMODERATION_MODE.POST,
        premodSites: [],
      },
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
    disableDefaultFonts: false,
    emailDomainModeration: [],
    embeddedComments: {
      allowReplies: true,
      oEmbedAllowedOrigins: [],
    },
    flairBadges: {
      flairBadgesEnabled: false,
      badges: [],
    },
    dsa: {
      enabled: false,
      methodOfRedress: {
        method: GQLDSA_METHOD_OF_REDRESS.NONE,
      },
    },
    topCommenter: {
      enabled: false,
    },
  };

  // Create the new Tenant by merging it together with the defaults.
  const tenant: Readonly<Tenant> = {
    ...defaults,
    ...input,
  };

  // Insert the Tenant into the database.
  await mongo.tenants().insertOne(tenant);

  return tenant;
}

export async function retrieveTenantByDomain(
  mongo: MongoContext,
  domain: string
) {
  return mongo.tenants().findOne({ domain });
}

export async function retrieveTenant(mongo: MongoContext, id: string) {
  return mongo.tenants().findOne({ id });
}

export async function retrieveManyTenants(
  mongo: MongoContext,
  ids: ReadonlyArray<string>
) {
  const cursor = mongo.tenants().find({
    id: {
      $in: ids,
    },
  });

  const tenants = await cursor.toArray();

  return ids.map((id) => tenants.find((tenant) => tenant.id === id) || null);
}

export async function retrieveManyTenantsByDomain(
  mongo: MongoContext,
  domains: ReadonlyArray<string>
) {
  const cursor = mongo.tenants().find({
    domain: {
      $in: domains,
    },
  });

  const tenants = await cursor.toArray();

  return domains.map(
    (domain) => tenants.find((tenant) => tenant.domain === domain) || null
  );
}

export async function retrieveAllTenants(mongo: MongoContext) {
  return mongo.tenants().find({}).toArray();
}

export async function countTenants(mongo: MongoContext) {
  return mongo.tenants().find({}).count();
}

export type UpdateTenantInput = Omit<DeepPartial<Tenant>, "id" | "domain">;

export async function updateTenant(
  mongo: MongoContext,
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
  const result = await mongo.tenants().findOneAndUpdate(
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
  mongo: MongoContext,
  id: string,
  flag: GQLFEATURE_FLAG
) {
  // Update the Tenant.
  const result = await mongo.tenants().findOneAndUpdate(
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
  mongo: MongoContext,
  id: string,
  flag: GQLFEATURE_FLAG
) {
  // Update the Tenant.
  const result = await mongo.tenants().findOneAndUpdate(
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
  mongo: MongoContext,
  id: string,
  input: CreateAnnouncementInput,
  now = new Date()
) {
  const announcement = {
    id: uuid(),
    ...input,
    createdAt: now,
  };

  const result = await mongo.tenants().findOneAndUpdate(
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

export interface CreateFlairBadgeInput {
  name: string;
  url: string;
}

export async function createTenantFlairBadge(
  mongo: MongoContext,
  id: string,
  input: CreateFlairBadgeInput
) {
  // Search to see if this flair badge has already been configured.
  const duplicateFlairBadge = await mongo.tenants().findOne({
    id,
    "flairBadges.badges.name": input.name,
  });
  if (duplicateFlairBadge) {
    throw new DuplicateFlairBadgeError(input.name);
  }

  const result = await mongo.tenants().findOneAndUpdate(
    { id },
    {
      $push: { "flairBadges.badges": { name: input.name, url: input.url } },
    },
    {
      returnOriginal: false,
    }
  );
  return result.value;
}

export interface DeleteFlairBadgeInput {
  name: string;
}

export async function deleteTenantFlairBadge(
  mongo: MongoContext,
  id: string,
  input: DeleteFlairBadgeInput
) {
  const result = await mongo.tenants().findOneAndUpdate(
    { id },
    {
      $pull: {
        "flairBadges.badges": { name: input.name },
      },
    },
    {
      returnOriginal: false,
    }
  );
  return result.value;
}

export interface CreateEmailDomainInput {
  domain: string;
  newUserModeration: "BAN" | "PREMOD";
}

export async function createTenantEmailDomain(
  mongo: MongoContext,
  id: string,
  input: CreateEmailDomainInput
) {
  // Search to see if this email domain has already been configured.
  const duplicateDomain = await mongo.tenants().findOne({
    id,
    emailDomainModeration: {
      $elemMatch: { domain: input.domain },
    },
  });
  if (duplicateDomain) {
    throw new DuplicateEmailDomainError(input.domain);
  }

  const emailDomain = {
    id: uuid(),
    domain: input.domain,
    newUserModeration: input.newUserModeration,
  };

  const result = await mongo.tenants().findOneAndUpdate(
    { id },
    {
      $push: { emailDomainModeration: emailDomain },
    },
    {
      returnOriginal: false,
    }
  );
  return result.value;
}

export interface UpdateEmailDomainInput {
  id: string;
  domain: string;
  newUserModeration: "BAN" | "PREMOD";
}

export async function updateTenantEmailDomain(
  mongo: MongoContext,
  id: string,
  input: UpdateEmailDomainInput
) {
  // Search to see if this email domain has already been configured
  // for an email domain with a different id.
  const duplicateDomain = await mongo.tenants().findOne({
    id,
    emailDomainModeration: {
      $elemMatch: { domain: input.domain, id: { $ne: input.id } },
    },
  });
  if (duplicateDomain) {
    throw new DuplicateEmailDomainError(input.domain);
  }

  const result = await mongo.tenants().findOneAndUpdate(
    {
      id,
      emailDomainModeration: {
        $elemMatch: { id: input.id },
      },
    },
    {
      $set: {
        "emailDomainModeration.$.domain": input.domain,
        "emailDomainModeration.$.newUserModeration": input.newUserModeration,
      },
    },
    {
      returnOriginal: false,
    }
  );
  return result.value;
}

export interface DeleteEmailDomainInput {
  id: string;
}

export async function deleteTenantEmailDomain(
  mongo: MongoContext,
  id: string,
  input: DeleteEmailDomainInput
) {
  const result = await mongo.tenants().findOneAndUpdate(
    { id },
    {
      $pull: {
        emailDomainModeration: { id: input.id },
      },
    },
    {
      returnOriginal: false,
    }
  );
  return result.value;
}

export async function deleteTenantAnnouncement(
  mongo: MongoContext,
  id: string
) {
  const result = await mongo.tenants().findOneAndUpdate(
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
