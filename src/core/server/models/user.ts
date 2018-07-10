import bcrypt from "bcryptjs";
import { merge } from "lodash";
import { Db } from "mongodb";
import uuid from "uuid";

import { Omit, Sub } from "talk-common/types";
import {
  GQLUSER_ROLE,
  GQLUSER_USERNAME_STATUS,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { ActionCounts } from "talk-server/models/actions";
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
  provider: string;
}

export interface SSOProfile {
  type: "sso";
  id: string;
}

export type Profile = LocalProfile | OIDCProfile | SSOProfile;

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
  email?: string;
  email_verified?: boolean;
  profiles: Profile[];
  tokens: Token[];
  role: GQLUSER_ROLE;
  status: UserStatus;
  action_counts: ActionCounts;
  ignored_users: string[];
  created_at: Date;
}

export type CreateUserInput = Omit<
  User,
  | "id"
  | "tenant_id"
  | "tokens"
  | "status"
  | "action_counts"
  | "ignored_users"
  | "created_at"
>;

export async function createUser(
  db: Db,
  tenantID: string,
  input: CreateUserInput
) {
  const now = new Date();

  // default are the properties set by the application when a new user is
  // created.
  const defaults: Sub<User, CreateUserInput> = {
    id: uuid.v4(),
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

  // Merge the defaults and the input together.
  const user: Readonly<User> = merge({}, defaults, input);

  // Insert it into the database.
  await collection(db).insertOne(user);

  return user;
}

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
    return bcrypt.compare(user.password, password);
  }

  return false;
}
