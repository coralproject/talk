import { merge } from "lodash";
import { Db } from "mongodb";
import uuid from "uuid";

import { Omit, Sub } from "talk-common/types";
import { GQLUSER_ROLE } from "talk-server/graph/tenant/schema/__generated__/types";
import { ActionCounts } from "talk-server/models/actions";
import { TenantResource } from "talk-server/models/tenant";

function collection(db: Db) {
  return db.collection<Readonly<User>>("users");
}

export interface Profile {
  readonly id: string;
  readonly type: string;
  provider: string;
}

export interface Token {
  readonly id: string;
  name: string;
  active: boolean;
}

export enum UserUsernameStatus {
  // UNSET is used when the username can be changed, and does not necessarily
  // require moderator action to become active. This can be used when the user
  // signs up with a social login and has the option of setting their own
  // username.
  UNSET = "UNSET",

  // SET is used when the username has been set for the first time, but cannot
  // change without the username being rejected by a moderator and that moderator
  // agreeing that the username should be allowed to change.
  SET = "SET",

  // APPROVED is used when the username was changed, and subsequently approved by
  // said moderator.
  APPROVED = "APPROVED",

  // REJECTED is used when the username was changed, and subsequently rejected by
  // said moderator.
  REJECTED = "REJECTED",

  // CHANGED is used after a user has changed their username after it was
  // rejected.
  CHANGED = "CHANGED",
}

export interface UserStatusHistory<T> {
  status: T; // TODO: migrate field
  assigned_by?: string;
  reason?: string; // TODO: migrate field
  created_at: Date;
}

export interface UserStatusItem<T> {
  status: T; // TODO: migrate field
  history: Array<UserStatusHistory<T>>;
}

export interface UserStatus {
  username: UserStatusItem<UserUsernameStatus>;
  banned: UserStatusItem<boolean>;
  suspension: UserStatusItem<Date | null>;
}

export interface User extends TenantResource {
  readonly id: string;
  username: string | null;
  password?: string;
  email?: string;
  email_verified?: boolean;
  profiles: Profile[];
  tokens: Token[];
  role: GQLUSER_ROLE;
  status: UserStatus;
  action_counts: ActionCounts;
  ignored_users: string[]; // TODO: migrate field
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

export async function create(db: Db, tenantID: string, input: CreateUserInput) {
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
          ? UserUsernameStatus.SET
          : UserUsernameStatus.UNSET,
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

export async function retrieve(db: Db, tenantID: string, id: string) {
  return collection(db).findOne({ id, tenant_id: tenantID });
}

export async function retrieveMany(db: Db, tenantID: string, ids: string[]) {
  const cursor = await collection(db).find({
    id: {
      $in: ids,
    },
    tenant_id: tenantID,
  });

  const users = await cursor.toArray();

  return ids.map(id => users.find(comment => comment.id === id) || null);
}

export async function retrieveWithProfile(
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

export async function updateRole(
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
