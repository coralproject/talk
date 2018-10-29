import { Db } from "mongodb";
import uuid from "uuid";

import { DeepPartial, Omit, Sub } from "talk-common/types";
import { dotize } from "talk-common/utils/dotize";
import { GQLMODERATION_MODE } from "talk-server/graph/tenant/schema/__generated__/types";
import { Settings } from "talk-server/models/settings";

function collection(db: Db) {
  return db.collection<Readonly<Tenant>>("tenants");
}

export interface TenantResource {
  readonly tenant_id: string;
}

/**
 * Tenant describes a given Tenant on Talk that has Stories, Comments, and Users.
 */
export interface Tenant extends Settings {
  readonly id: string;

  // Domain is set when the tenant is created, and is used to retrieve the
  // specific tenant that the API request pertains to.
  domain: string;

  // domains is the list of domains that are allowed to have the iframe load on.
  domains: string[];

  organizationName: string;
  organizationURL: string;
  organizationContactEmail: string;
}

/**
 * CreateTenantInput is the set of properties that can be set when a given
 * Tenant is created. The remainder of the properties are set from defaults and
 * are modifiable via the update method.
 */
export type CreateTenantInput = Pick<
  Tenant,
  | "domain"
  | "organizationName"
  | "organizationURL"
  | "organizationContactEmail"
  | "domains"
>;

/**
 * create will create a new Tenant.
 *
 * @param mongo the MongoDB connection used to create the tenant.
 * @param input the customizable parts of the Tenant available during creation
 */
export async function createTenant(mongo: Db, input: CreateTenantInput) {
  const defaults: Sub<Tenant, CreateTenantInput> = {
    // Create a new ID.
    id: uuid.v4(),

    // Default to post moderation.
    moderation: GQLMODERATION_MODE.POST,

    // Email confirmation is default off.
    requireEmailConfirmation: false,
    infoBoxEnable: false,
    questionBoxEnable: false,
    premodLinksEnable: false,
    autoCloseStream: false,

    // Two weeks timeout.
    closedTimeout: 60 * 60 * 24 * 7 * 2,
    disableCommenting: false,
    editCommentWindowLength: 30 * 1000,
    charCount: {
      enabled: false,
    },
    wordlist: {
      suspect: [],
      banned: [],
    },
    auth: {
      integrations: {
        local: {
          enabled: true,
        },
        sso: {
          enabled: false,
        },
        oidc: {
          enabled: false,
        },
        google: {
          enabled: false,
        },
        facebook: {
          enabled: false,
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
      },
    },
    reaction: {
      // By default, the standard reaction style will use the Respect with the
      // handshake.
      label: "Respect",
      labelActive: "Respected",
      icon: "thumb_up",
    },
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

export async function retrieveTenantByDomain(db: Db, domain: string) {
  return collection(db).findOne({ domain });
}

export async function retrieveTenant(db: Db, id: string) {
  return collection(db).findOne({ id });
}

export async function retrieveManyTenants(db: Db, ids: string[]) {
  const cursor = await collection(db).find({
    id: {
      $in: ids,
    },
  });

  const tenants = await cursor.toArray();

  return ids.map(id => tenants.find(tenant => tenant.id === id) || null);
}

export async function retrieveManyTenantsByDomain(db: Db, domains: string[]) {
  const cursor = await collection(db).find({
    domain: {
      $in: domains,
    },
  });

  const tenants = await cursor.toArray();

  return domains.map(
    domain => tenants.find(tenant => tenant.domain === domain) || null
  );
}

export async function retrieveAllTenants(db: Db) {
  return collection(db)
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
  db: Db,
  id: string,
  update: UpdateTenantInput
) {
  // Get the tenant from the database.
  const result = await collection(db).findOneAndUpdate(
    { id },
    // Only update fields that have been updated.
    { $set: dotize(update, { embedArrays: true }) },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return result.value || null;
}
