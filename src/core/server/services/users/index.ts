import { Db } from "mongodb";

import { Tenant } from "talk-server/models/tenant";
import {
  LocalProfile,
  setUserEmail,
  setUserLocalProfile,
  setUserUsername,
  updateUserPassword,
  upsertUser,
  UpsertUserInput,
  User,
} from "talk-server/models/user";

const USERNAME_REGEX = new RegExp(/^[a-zA-Z0-9_]+$/);
const USERNAME_MAX_LENGTH = 30;

/**
 * validateUsername will validate that the username is valid. Current
 * implementation uses a RegExp statically, future versions will expose this as
 * configuration.
 *
 * @param tenant tenant where the User is associated with
 * @param username the username to be tested
 */
function validateUsername(tenant: Tenant, username: string) {
  // TODO: replace these static regex/length with database options in the Tenant eventually

  if (!USERNAME_REGEX.test(username)) {
    throw new Error("username contained illegal characters");
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    throw new Error("username exceeded maximum length");
  }
}

/**
 * validatePassword will validate that the password is valid. Current
 * implementation uses a length statically, future versions will expose this as
 * configuration.
 *
 * @param tenant tenant where the User is associated with
 * @param password the password to be tested
 */
function validatePassword(tenant: Tenant, password: string) {
  // TODO: replace these static length with database options in the Tenant eventually
  if (password.length < 8) {
    throw new Error("password is too short");
  }
}

const EMAIL_REGEX = new RegExp(/^\S+@\S+.\S+$/);

/**
 * validateEmail will validate that the email is valid. Current implementation
 * uses a length statically, future versions will expose this as configuration.
 *
 * @param tenant tenant where the User is associated with
 * @param email the email to be tested
 */
function validateEmail(tenant: Tenant, email: string) {
  // TODO: replace these static length with database options in the Tenant eventually
  if (!EMAIL_REGEX.test(email)) {
    throw new Error("email is in an invalid format");
  }
}

export type UpsertUser = UpsertUserInput;

/**
 * upsert will upsert the User into the database for the Tenant.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be added to
 * @param input the input for creating the User
 */
export async function upsert(mongo: Db, tenant: Tenant, input: UpsertUser) {
  if (input.username) {
    validateUsername(tenant, input.username);
  }

  if (input.email) {
    validateEmail(tenant, input.email);
  }

  const localProfile: LocalProfile | undefined = input.profiles.find(
    ({ type }) => type === "local"
  ) as LocalProfile | undefined;
  if (localProfile) {
    validateEmail(tenant, localProfile.id);
    validatePassword(tenant, localProfile.password);

    if (input.email !== localProfile.id) {
      // TODO: (wyattjoh) return better error.
      throw new Error("email addresses don't match profile");
    }
  }

  const user = await upsertUser(mongo, tenant.id, input);

  return user;
}

/**
 * setUsername will set the username on the User if they don't already have one
 * associated with them.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param user User that should get their username changed
 * @param username the new username for the User
 */
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

  validateUsername(tenant, username);

  return setUserUsername(mongo, tenant.id, user.id, username);
}

/**
 * setEmail will set the email address on the User if they don't already have
 * one associated with them.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param user User that should get their username changed
 * @param email the new email for the User
 */
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

  validateEmail(tenant, email);

  return setUserEmail(mongo, tenant.id, user.id, email);
}

/**
 * setPassword will set the password on the User if they don't already have
 * one associated with them. This will allow the User to sign in with their
 * current email address and new password if email based authentication is
 * enabled. If the User does not have a email address associated with their
 * account, this will fail.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param user User that should get their password changed
 * @param password the new password for the User
 */
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

  validatePassword(tenant, password);

  return setUserLocalProfile(mongo, tenant.id, user.id, user.email, password);
}

/**
 * updatePassword will update the password associated with the User. If the User
 * does not already have a password associated with their account, it will fail.
 * If the User does not have an email address associated with the account, this
 * will fail.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param user User that should get their password changed
 * @param password the new password for the User
 */
export async function updatePassword(
  mongo: Db,
  tenant: Tenant,
  user: User,
  password: string
) {
  // We require that the email address for the user be defined for this method.
  if (!user.email) {
    throw new Error("no email address associated with user");
  }

  // We also don't allow this method to be used by users that don't have a local
  // profile already.
  if (
    !user.profiles.some(({ id, type }) => type === "local" && id === user.email)
  ) {
    throw new Error("user does not have a local profile");
  }

  validatePassword(tenant, password);

  return updateUserPassword(mongo, tenant.id, user.id, password);
}
