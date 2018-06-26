import { merge } from "lodash";
import { Collection, Db } from "mongodb";
import { Omit, Sub } from "talk-common/types";
import { ActionCounts } from "talk-server/models/actions";
import { TenantResource } from "talk-server/models/tenant";
import uuid from "uuid";

function collection(db: Db): Collection<User> {
  return db.collection<User>("users");
}

export interface Profile {
  readonly id: string;
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

export enum UserRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  STAFF = "STAFF",
  COMMENTER = "COMMENTER",
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
  username: string;
  password?: string;
  profiles: Profile[];
  tokens: Token[];
  role: UserRole;
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
  | "role"
  | "action_counts"
  | "ignored_users"
  | "created_at"
>;

export async function create(
  db: Db,
  tenantID: string,
  input: CreateUserInput
): Promise<Readonly<User>> {
  const now = new Date();

  // // Pull out some useful properties from the input.
  // const { body, status } = input;

  // default are the properties set by the application when a new user is
  // created.
  const defaults: Sub<User, CreateUserInput> = {
    id: uuid.v4(),
    tenant_id: tenantID,
    role: UserRole.COMMENTER,
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
        status: UserUsernameStatus.SET,
        history: [],
      },
    },
    created_at: now,
  };

  // Merge the defaults and the input together.
  const user: User = merge({}, defaults, input);

  // Insert it into the database.
  await collection(db).insertOne(user);

  return user;
}

export async function retrieve(
  db: Db,
  tenantID: string,
  id: string
): Promise<Readonly<User> | null> {
  return collection(db).findOne({ id, tenant_id: tenantID });
}

export async function retrieveMany(
  db: Db,
  tenantID: string,
  ids: string[]
): Promise<Array<Readonly<User> | null>> {
  const cursor = await collection(db).find({
    id: {
      $in: ids,
    },
    tenant_id: tenantID,
  });

  const users = await cursor.toArray();

  return ids.map(id => users.find(comment => comment.id === id) || null);
}

export async function updateRole(
  db: Db,
  tenantID: string,
  id: string,
  role: UserRole
): Promise<Readonly<User> | null> {
  const result = await collection(db).findOneAndUpdate(
    { id, tenant_id: tenantID },
    { $set: { role } },
    { returnOriginal: false }
  );

  return result.value || null;
}
