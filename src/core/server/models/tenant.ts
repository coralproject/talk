import crypto from "crypto";
import { Db } from "mongodb";
import uuid from "uuid";

import { LanguageCode } from "talk-common/helpers/i18n/locales";
import { DeepPartial, Omit, Sub } from "talk-common/types";
import { dotize } from "talk-common/utils/dotize";
import {
  GQLMODERATION_MODE,
  GQLSettings,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { createIndexFactory } from "talk-server/models/helpers/indexing";
import { Settings } from "talk-server/models/settings";

function collection(mongo: Db) {
  return mongo.collection<Readonly<Tenant>>("tenants");
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

export interface TenantSettings
  extends Pick<GQLSettings, "domain" | "domains" | "organization"> {
  readonly id: string;

  /**
   * locale is the specified locale for this Tenant.
   */
  locale: LanguageCode;
}

/**
 * Tenant describes a given Tenant on Talk that has Stories, Comments, and Users.
 */
export type Tenant = Settings & TenantSettings;

export async function createTenantIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collection(mongo));

  // UNIQUE { id }
  await createIndex({ id: 1 }, { unique: true });

  // UNIQUE { domain }
  await createIndex({ domain: 1 }, { unique: true });
}

/**
 * CreateTenantInput is the set of properties that can be set when a given
 * Tenant is created. The remainder of the properties are set from defaults and
 * are modifiable via the update method.
 */
export type CreateTenantInput = Pick<
  Tenant,
  "domain" | "domains" | "locale" | "organization"
>;

/**
 * create will create a new Tenant.
 *
 * @param mongo the MongoDB connection used to create the tenant.
 * @param input the customizable parts of the Tenant available during creation
 */
export async function createTenant(
  mongo: Db,
  input: CreateTenantInput,
  now = new Date()
) {
  const defaults: Sub<Tenant, CreateTenantInput> = {
    // Create a new ID.
    id: uuid.v4(),

    // Default to post moderation.
    moderation: GQLMODERATION_MODE.POST,

    communityGuidelines: {
      enabled: false,
      content: "",
    },
    premodLinksEnable: false,
    closeCommenting: {
      auto: false,
      // 2 weeks timeout.
      timeout: 60 * 60 * 24 * 7 * 2,
    },
    disableCommenting: {
      enabled: false,
    },

    // 30 seconds edit window length.
    editCommentWindowLength: 30,

    charCount: {
      enabled: false,
    },
    wordList: {
      suspect: [],
      banned: [],
    },
    auth: {
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
          key: generateSSOKey(),
          keyGeneratedAt: now,
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
    },
    karma: {
      enabled: true,
      thresholds: {
        // By default, flaggers are reliable after one correct flag, and
        // unreliable if there is an incorrect flag.
        flag: { reliable: 1, unreliable: -1 },
        comment: { reliable: 1, unreliable: -1 },
      },
    },
    integrations: {
      akismet: {
        enabled: false,
      },
      perspective: {
        enabled: false,
        doNotStore: true,
      },
    },
    reaction: {
      // By default, the standard reaction style will use the Respect with the
      // handshake.
      label: "Respect",
      labelActive: "Respected",
      icon: "thumb_up",
    },
    createdAt: now,
  };

  // Create the new Tenant by merging it together with the defaults.
  const tenant: Readonly<Tenant> = {
    ...defaults,
    ...input,
  };

  // Insert the Tenant into the database.
  await collection(mongo).insert(tenant);

  return tenant;
}

export async function retrieveTenantByDomain(mongo: Db, domain: string) {
  return collection(mongo).findOne({ domain });
}

export async function retrieveTenant(mongo: Db, id: string) {
  return collection(mongo).findOne({ id });
}

export async function retrieveManyTenants(mongo: Db, ids: string[]) {
  const cursor = await collection(mongo).find({
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
  const cursor = await collection(mongo).find({
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
  // Get the tenant from the database.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    // Only update fields that have been updated.
    { $set: dotize(update, { embedArrays: true }) },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return result.value || null;
}

function generateSSOKey() {
  // Generate a new key. We generate a key of minimum length 32 up to 37 bytes,
  // as 16 was the minimum length recommended.
  //
  // Reference: https://security.stackexchange.com/a/96176
  return crypto.randomBytes(32 + Math.floor(Math.random() * 5)).toString("hex");
}

/**
 * regenerateTenantSSOKey will regenerate the SSO key used for Single Sing-On
 * for the specified Tenant. All existing user sessions signed with the old
 * secret will be invalidated.
 */
export async function regenerateTenantSSOKey(mongo: Db, id: string) {
  // Construct the update.
  const update: DeepPartial<Tenant> = {
    auth: {
      integrations: {
        sso: {
          key: generateSSOKey(),
          keyGeneratedAt: new Date(),
        },
      },
    },
  };

  // Update the Tenant with this new key.
  const result = await collection(mongo).findOneAndUpdate(
    { id },
    // Serialize the deep update into the Tenant.
    {
      $set: dotize(update),
    },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return result.value || null;
}
