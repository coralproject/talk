import { Db } from "mongodb";

import { Tenant } from "talk-server/models/tenant";
import {
  setUserEmail,
  setUserLocalProfile,
  setUserUsername,
  upsertUser,
  UpsertUserInput,
  User,
} from "talk-server/models/user";

export type UpsertUser = UpsertUserInput;

export async function upsert(db: Db, tenant: Tenant, input: UpsertUser) {
  const user = await upsertUser(db, tenant.id, input);

  return user;
}

export async function setUsername(
  mongo: Db,
  tenant: Tenant,
  user: User,
  username: string
) {
  // We require that the username is not defined in order to use this method.
  if (user.username) {
    throw new Error("username already associated with user");
  }

  return setUserUsername(mongo, tenant.id, user.id, username);
}

export async function setEmail(
  mongo: Db,
  tenant: Tenant,
  user: User,
  email: string
) {
  // We requires that the email address is not defined in order to use this
  // method.
  if (user.email) {
    throw new Error("email address already associated with user");
  }

  return setUserEmail(mongo, tenant.id, user.id, email);
}

export async function setPassword(
  mongo: Db,
  tenant: Tenant,
  user: User,
  password: string
) {
  // We require that the email address for the user be defined for this method.
  if (!user.email) {
    throw new Error("no email address associated with user");
  }

  // We also don't allow this method to be used by users that already have a
  // local profile.
  if (user.profiles.some(({ type }) => type === "local")) {
    throw new Error("user already has local profile");
  }

  return setUserLocalProfile(mongo, tenant.id, user.id, user.email, password);
}
