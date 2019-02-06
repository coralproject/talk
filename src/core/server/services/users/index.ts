import { Db } from "mongodb";

import {
  EMAIL_REGEX,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from "talk-common/helpers/validate";
import {
  DisplayNameExceedsMaxLengthError,
  EmailAlreadySetError,
  EmailExceedsMaxLengthError,
  EmailInvalidFormatError,
  EmailNotSetError,
  LocalProfileAlreadySetError,
  LocalProfileNotSetError,
  PasswordTooShortError,
  TokenNotFoundError,
  UsernameAlreadySetError,
  UsernameContainsInvalidCharactersError,
  UsernameExceedsMaxLengthError,
  UsernameTooShortError,
} from "talk-server/errors";
import { GQLUSER_ROLE } from "talk-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "talk-server/models/tenant";
import {
  createUserToken,
  deactivateUserToken,
  LocalProfile,
  setUserEmail,
  setUserLocalProfile,
  setUserUsername,
  updateUserAvatar,
  updateUserDisplayName,
  updateUserEmail,
  updateUserPassword,
  updateUserRole,
  updateUserUsername,
  upsertUser,
  UpsertUserInput,
  User,
} from "talk-server/models/user";

import { JWTSigningConfig, signPATString } from "../jwt";

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
    throw new UsernameContainsInvalidCharactersError();
  }

  if (username.length > USERNAME_MAX_LENGTH) {
    throw new UsernameExceedsMaxLengthError(
      username.length,
      USERNAME_MAX_LENGTH
    );
  }

  if (username.length < USERNAME_MIN_LENGTH) {
    throw new UsernameTooShortError(username.length, USERNAME_MIN_LENGTH);
  }
}

const DISPLAY_NAME_MAX_LENGTH = USERNAME_MAX_LENGTH;

/**
 * validateDisplayName will validate that the username is valid.
 *
 * @param tenant tenant where the User is associated with
 * @param displayName the display name to be tested
 */
function validateDisplayName(tenant: Tenant, displayName: string) {
  // TODO: replace these static regex/length with database options in the Tenant eventually

  if (displayName.length > DISPLAY_NAME_MAX_LENGTH) {
    throw new DisplayNameExceedsMaxLengthError(
      displayName.length,
      DISPLAY_NAME_MAX_LENGTH
    );
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
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new PasswordTooShortError(password.length, PASSWORD_MIN_LENGTH);
  }
}

const EMAIL_MAX_LENGTH = 100;

/**
 * validateEmail will validate that the email is valid. Current implementation
 * uses a length statically, future versions will expose this as configuration.
 *
 * @param tenant tenant where the User is associated with
 * @param email the email to be tested
 */
function validateEmail(tenant: Tenant, email: string) {
  if (!EMAIL_REGEX.test(email)) {
    throw new EmailInvalidFormatError();
  }

  // TODO: replace these static length with database options in the Tenant eventually
  if (email.length > EMAIL_MAX_LENGTH) {
    throw new EmailExceedsMaxLengthError(email.length, EMAIL_MAX_LENGTH);
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
    throw new UsernameAlreadySetError();
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
    throw new EmailAlreadySetError();
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
    throw new EmailNotSetError();
  }

  // We also don't allow this method to be used by users that already have a
  // local profile.
  if (user.profiles.some(({ type }) => type === "local")) {
    throw new LocalProfileAlreadySetError();
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
    throw new EmailNotSetError();
  }

  // We also don't allow this method to be used by users that don't have a local
  // profile already.
  if (
    !user.profiles.some(({ id, type }) => type === "local" && id === user.email)
  ) {
    throw new LocalProfileNotSetError();
  }

  validatePassword(tenant, password);

  return updateUserPassword(mongo, tenant.id, user.id, password);
}

/**
 * createToken will create a Token for the User as well as return a signed Token
 * that can be used to authenticate.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param config signing configuration to create the signed token
 * @param user User that should get updated
 * @param name name of the Token
 */
export async function createToken(
  mongo: Db,
  tenant: Tenant,
  config: JWTSigningConfig,
  user: User,
  name: string
) {
  // Create the token for the User!
  const result = await createUserToken(mongo, tenant.id, user.id, name);

  // Sign the token!
  const signedToken = await signPATString(config, user, {
    // Tokens are issued with the token ID as their JWT ID.
    jwtid: result.token.id,

    // Tokens are issued with the tenant ID.
    issuer: tenant.id,
  });

  return { ...result, signedToken };
}

/**
 * deactivateToken will disable the given Token so that it can not be used to
 * authenticate any more.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param config signing configuration to create the signed token
 * @param user User that should get updated
 * @param id of the Token to be deactivated
 */
export async function deactivateToken(
  mongo: Db,
  tenant: Tenant,
  user: User,
  id: string
) {
  if (!user.tokens.find(t => t.id === id)) {
    throw new TokenNotFoundError();
  }

  return deactivateUserToken(mongo, tenant.id, user.id, id);
}

/**
 * updateUsername will update a given User's username.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param userID the User's ID that we are updating
 * @param username the username that we are setting on the User
 */
export async function updateUsername(
  mongo: Db,
  tenant: Tenant,
  userID: string,
  username: string
) {
  // Validate the username.
  validateUsername(tenant, username);

  return updateUserUsername(mongo, tenant.id, userID, username);
}

/**
 * updateDisplayName will update a given User's display name.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param userID the User's ID that we are updating
 * @param displayName the display name that we are setting on the User
 */
export async function updateDisplayName(
  mongo: Db,
  tenant: Tenant,
  userID: string,
  displayName?: string
) {
  if (displayName) {
    // Validate the display name.
    validateDisplayName(tenant, displayName);
  }

  return updateUserDisplayName(mongo, tenant.id, userID, displayName);
}

/**
 * updateRole will update the given User to the specified role.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param userID the User's ID that we are updating
 * @param role the role that we are setting on the User
 */
export async function updateRole(
  mongo: Db,
  tenant: Tenant,
  userID: string,
  role: GQLUSER_ROLE
) {
  return updateUserRole(mongo, tenant.id, userID, role);
}

/**
 * updateEmail will update the given User's email address.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param userID the User's ID that we are updating
 * @param email the email address that we are setting on the User
 */
export async function updateEmail(
  mongo: Db,
  tenant: Tenant,
  userID: string,
  email: string
) {
  // Validate the email address.
  validateEmail(tenant, email);

  return updateUserEmail(mongo, tenant.id, userID, email);
}

/**
 * updateAvatar will update the given User's avatar.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param userID the User's ID that we are updating
 * @param avatar the avatar that we are setting on the User
 */
export async function updateAvatar(
  mongo: Db,
  tenant: Tenant,
  userID: string,
  avatar?: string
) {
  return updateUserAvatar(mongo, tenant.id, userID, avatar);
}
