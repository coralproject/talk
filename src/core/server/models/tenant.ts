import dotize from "dotize";
import { merge } from "lodash";
import { Db } from "mongodb";
import uuid from "uuid";

import { Sub } from "talk-common/types";
import {
  GQLMODERATION_MODE,
  GQLUSER_ROLE,
} from "talk-server/graph/tenant/schema/__generated__/types";

function collection(db: Db) {
  return db.collection<Readonly<Tenant>>("tenants");
}

export interface TenantResource {
  readonly tenant_id: string;
}

export interface Wordlist {
  banned: string[];
  suspect: string[];
}

// AuthIntegrations.

export interface EmailDomainRuleCondition {
  // emailDomain is the domain name component of the email addresses that should
  // match for this condition.
  emailDomain: string;

  // emailVerifiedRequired stipulates that this rule only applies when the user
  // account has been marked as having their email address already verified.
  emailVerifiedRequired: boolean;
}

// RoleRule describes the role assignment for when a user logs into Talk, how
// they can have their account automatically upgraded to a specific role when
// the domain for their email matches the one provided.
export interface RoleRule extends Partial<EmailDomainRuleCondition> {
  // role is the specific GQLUSER_ROLE that should be assigned to the newly created
  // user depending on their email address.
  role: GQLUSER_ROLE;
}

export interface AuthRules {
  // roles allow the configuration of automatic role assignment based on the
  // user's email address.
  roles?: RoleRule[];

  // restrictTo when populated, will restrict which users can login using this
  // integration. If a user successfully logs in using the OIDCStrategy, but
  // does not match the following rules, the user will not be created.
  restrictTo?: EmailDomainRuleCondition[];
}

export interface AuthIntegration {
  enabled: boolean;
}

export interface DisplayNameAuthIntegration {
  displayNameEnable: boolean;
}

// SSOAuthIntegration is an AuthIntegration that provides a secret to the admins
// of a tenant, where they can sign a SSO payload with it to provide to the
// embed to allow single sign on.
export interface SSOAuthIntegration
  extends AuthIntegration,
    DisplayNameAuthIntegration {
  key: string;
}

// OIDCAuthIntegration provides a way to store Open ID Connect credentials. This
// will be used in the admin to provide staff logins for users.
export interface OIDCAuthIntegration
  extends AuthIntegration,
    DisplayNameAuthIntegration {
  clientID: string;
  clientSecret: string;
  issuer: string;
  authorizationURL: string;
  jwksURI: string;
  tokenURL: string;
}

export interface FacebookAuthIntegration extends AuthIntegration {
  clientID: string;
  clientSecret: string;
}

export interface GoogleAuthIntegration extends AuthIntegration {
  clientID: string;
  clientSecret: string;
}

export type LocalAuthIntegration = AuthIntegration;

// AuthIntegrations describes all of the possible auth integration configurations.
export interface AuthIntegrations {
  // local is the auth integration for the local auth.
  local: LocalAuthIntegration;

  // sso is the external auth integration for the single sign on auth.
  sso?: SSOAuthIntegration;

  // sso is the external auth integration for the OpenID Connect auth.
  oidc?: OIDCAuthIntegration;

  // sso is the external auth integration for the Google auth.
  google?: GoogleAuthIntegration;

  // sso is the external auth integration for the Facebook auth.
  facebook?: FacebookAuthIntegration;
}

export interface Auth {
  integrations: AuthIntegrations;
}

// Tenant definition.

export interface Tenant {
  readonly id: string;

  // Domain is set when the tenant is created, and is used to retrieve the
  // specific tenant that the API request pertains to.
  domain: string;

  moderation: GQLMODERATION_MODE;
  requireEmailConfirmation: boolean;
  infoBoxEnable: boolean;
  infoBoxContent?: string;
  questionBoxEnable: boolean;
  questionBoxIcon?: string;
  questionBoxContent?: string;
  premodLinksEnable: boolean;
  autoCloseStream: boolean;
  closedTimeout: number;
  closedMessage?: string;
  customCssUrl?: string;
  disableCommenting: boolean;
  disableCommentingMessage?: string;

  // editCommentWindowLength is the length of time (in milliseconds) after a
  // comment is posted that it can still be edited by the author.
  editCommentWindowLength: number;
  charCountEnable: boolean;
  charCount?: number;
  organizationName: string;
  organizationContactEmail: string;

  // wordlist stores all the banned/suspect words.
  wordlist: Wordlist;

  // domains is the set of whitelisted domains.
  domains: string[];

  // Set of configured authentication integrations.
  auth: Auth;
}

/**
 * CreateTenantInput is the set of properties that can be set when a given
 * Tenant is created. The remainder of the properties are set from defaults and
 * are modifiable via the update method.
 */
export type CreateTenantInput = Pick<
  Tenant,
  "domain" | "organizationName" | "organizationContactEmail" | "domains"
>;

/**
 * create will create a new Tenant.
 *
 * @param db the MongoDB connection used to create the tenant.
 * @param input the customizable parts of the Tenant available during creation
 */
export async function createTenant(db: Db, input: CreateTenantInput) {
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
    charCountEnable: false,
    wordlist: {
      suspect: [],
      banned: [],
    },
    auth: {
      integrations: {
        local: {
          enabled: true,
        },
      },
    },
  };

  // Create the new Tenant by merging it together with the defaults.
  const tenant: Readonly<Tenant> = merge({}, input, defaults);

  // Insert the Tenant into the database.
  await collection(db).insert(tenant);

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

export async function updateTenant(
  db: Db,
  id: string,
  update: Partial<CreateTenantInput>
) {
  // Get the tenant from the database.
  const result = await collection(db).findOneAndUpdate(
    { id },
    // Only update fields that have been updated.
    { $set: dotize(update) },
    // False to return the updated document instead of the original
    // document.
    { returnOriginal: false }
  );

  return result.value || null;
}
