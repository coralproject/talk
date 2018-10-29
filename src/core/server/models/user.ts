import bcrypt from "bcryptjs";
import { Db } from "mongodb";
import uuid from "uuid";

import { Omit, Sub } from "talk-common/types";
import {
  GQLUSER_ROLE,
  GQLUSER_USERNAME_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { EncodedActionCounts } from "talk-server/models/action";
import { FilterQuery } from "talk-server/models/query";
import { TenantResource } from "talk-server/models/tenant";

function collection(db: Db) {
  return db.collection<Readonly<User>>("users");
}

export interface LocalProfile {
  type: "local";
  id: string;
}

export interface OIDCProfile {
  type: "oidc";
  id: string;
  issuer: string;
  audience: string;
}

export interface SSOProfile {
  type: "sso";
  id: string;
}

export interface FacebookProfile {
  type: "facebook";
  id: string;
}

export type Profile = LocalProfile | OIDCProfile | SSOProfile | FacebookProfile;

export interface Token {
  readonly id: string;
  name: string;
  active: boolean;
}

export interface UserStatusHistory<T> {
  status: T;
  assigned_by?: string;
  reason?: string;
  created_at: Date;
}

export interface UserStatusItem<T> {
  status: T;
  history: Array<UserStatusHistory<T>>;
}

export interface UserStatus {
  username: UserStatusItem<GQLUSER_USERNAME_STATUS>;
  banned: UserStatusItem<boolean>;
  suspension: UserStatusItem<Date | null>;
}

export interface User extends TenantResource {
  readonly id: string;
  username: string | null;
  displayName?: string;
  password?: string;
  avatar?: string;
  email?: string;
  email_verified?: boolean;
  profiles: Profile[];
  tokens: Token[];
  role: GQLUSER_ROLE;
  status: UserStatus;
  action_counts: EncodedActionCounts;
  ignored_users: string[];
  created_at: Date;
}

export type UpsertUserInput = Omit<
  User,
  | "id"
  | "tenant_id"
  | "tokens"
  | "status"
  | "action_counts"
  | "ignored_users"
  | "created_at"
>;

export async function upsertUser(
  db: Db,
  tenantID: string,
  input: UpsertUserInput
) {
  const now = new Date();

  // Create a new ID for the user.
  const id = uuid.v4();

  // default are the properties set by the application when a new user is
  // created.
  const defaults: Sub<User, UpsertUserInput> = {
    id,
    tenant_id: tenantID,
    tokens: [],
    action_counts: {},
    ignored_users: [],
    status: {
      banned: {
        status: false,
        history: [],
      },
      suspension: {
        status: null,
        history: [],
      },
      username: {
        status: input.username
          ? GQLUSER_USERNAME_STATUS.SET
          : GQLUSER_USERNAME_STATUS.UNSET,
        history: [],
      },
    },
    created_at: now,
  };

  let hashedPassword;
  if (input.password) {
    // Hash the user's password with bcrypt.
    hashedPassword = await bcrypt.hash(input.password, 10);
  }

  // Merge the defaults and the input together.
  const user: Readonly<User> = {
    ...defaults,
    ...input,

    // Specified last in the merge call, it will override any existing password
    // entry if it is defined.
    password: hashedPassword,
  };

  // Create a query that will utilize a findOneAndUpdate to facilitate an upsert
  // operation to ensure no user has the same profile and/or email address. If
  // any user is found to have the same profile as any of the profiles specified
  // in the new user object, then we should error here.
  const filter = createUpsertUserFilter(user);

  // Create the upsert/update operation.
  const update: { $setOnInsert: Readonly<User> } = {
    $setOnInsert: user,
  };

  // Insert it into the database. This may throw an error.
  const result = await collection(db).findOneAndUpdate(filter, update, {
    // We are using this to create a user, so we need to upsert it.
    upsert: true,

    // False to return the updated document instead of the original document.
    // This lets us detect if the document was updated or not.
    returnOriginal: false,
  });

  // Check to see if this was a new user that was upserted, or one was found
  // that matched existing records. We are sure here that the record exists
  // because we're returning the updated document and performing an upsert
  // operation.
  if (result.value!.id !== id) {
    // TODO: return better error.
    throw new Error("user already found");
  }

  return result.value!;
}

const createUpsertUserFilter = (user: Readonly<User>) => {
  const query: FilterQuery<User> = {
    // Query by the profiles if the user is being created with one.
    $or: user.profiles.map(profile => ({ profiles: { $elemMatch: profile } })),
  };

  if (user.email) {
    // Query by the email address if the user is being created with one.
    query.$or.push({ email: user.email });
  }

  return query;
};

export async function retrieveUser(db: Db, tenantID: string, id: string) {
  return collection(db).findOne({ id, tenant_id: tenantID });
}

export async function retrieveManyUsers(
  db: Db,
  tenantID: string,
  ids: string[]
) {
  const cursor = await collection(db).find({
    id: {
      $in: ids,
    },
    tenant_id: tenantID,
  });

  const users = await cursor.toArray();

  return ids.map(id => users.find(comment => comment.id === id) || null);
}

export async function retrieveUserWithProfile(
  db: Db,
  tenantID: string,
  profile: Profile
) {
  return collection(db).findOne({
    tenant_id: tenantID,
    profiles: {
      $elemMatch: profile,
    },
  });
}

export async function updateUserRole(
  db: Db,
  tenantID: string,
  id: string,
  role: GQLUSER_ROLE
) {
  const result = await collection(db).findOneAndUpdate(
    { id, tenant_id: tenantID },
    { $set: { role } },
    { returnOriginal: false }
  );

  return result.value || null;
}

export async function verifyUserPassword(user: User, password: string) {
  if (user.password) {
    return bcrypt.compare(password, user.password);
  }

  return false;
}
