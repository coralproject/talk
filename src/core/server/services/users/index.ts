import { DateTime } from "luxon";
import { Db } from "mongodb";

import {
  EMAIL_REGEX,
  PASSWORD_MIN_LENGTH,
  USERNAME_MAX_LENGTH,
  USERNAME_MIN_LENGTH,
  USERNAME_REGEX,
} from "talk-common/helpers/validate";
import {
  EmailAlreadySetError,
  EmailExceedsMaxLengthError,
  EmailInvalidFormatError,
  EmailNotSetError,
  LocalProfileAlreadySetError,
  LocalProfileNotSetError,
  PasswordTooShortError,
  TokenNotFoundError,
  UserAlreadyBannedError,
  UserAlreadySuspendedError,
  UsernameAlreadySetError,
  UsernameContainsInvalidCharactersError,
  UsernameExceedsMaxLengthError,
  UsernameTooShortError,
  UserNotFoundError,
} from "talk-server/errors";
import { GQLUSER_ROLE } from "talk-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "talk-server/models/tenant";
import {
  banUser,
  consolidateUserBanStatus,
  consolidateUserSuspensionStatus,
  createUserToken,
  deactivateUserToken,
  insertUser,
  InsertUserInput,
  LocalProfile,
  removeActiveUserSuspensions,
  removeUserBan,
  retrieveUser,
  setUserEmail,
  setUserLocalProfile,
  setUserUsername,
  suspendUser,
  updateUserAvatar,
  updateUserEmail,
  updateUserPassword,
  updateUserRole,
  updateUserUsername,
  User,
} from "talk-server/models/user";

import { MailerQueue } from "talk-server/queue/tasks/mailer";
import { JWTSigningConfig, signPATString } from "../jwt";

/**
 * validateUsername will validate that the username is valid. Current
 * implementation uses a RegExp statically, future versions will expose this as
 * configuration.
 *
 * @param username the username to be tested
 */
function validateUsername(username: string) {
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

/**
 * validatePassword will validate that the password is valid. Current
 * implementation uses a length statically, future versions will expose this as
 * configuration.
 *
 * @param password the password to be tested
 */
function validatePassword(password: string) {
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
 * @param email the email to be tested
 */
function validateEmail(email: string) {
  if (!EMAIL_REGEX.test(email)) {
    throw new EmailInvalidFormatError();
  }

  // TODO: replace these static length with database options in the Tenant eventually
  if (email.length > EMAIL_MAX_LENGTH) {
    throw new EmailExceedsMaxLengthError(email.length, EMAIL_MAX_LENGTH);
  }
}

export type InsertUser = InsertUserInput;

/**
 * insert will upsert the User into the database for the Tenant.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be added to
 * @param input the input for creating the User
 */
export async function insert(
  mongo: Db,
  tenant: Tenant,
  input: InsertUser,
  now = new Date()
) {
  if (input.username) {
    validateUsername(input.username);
  }

  if (input.email) {
    validateEmail(input.email);
  }

  const localProfile: LocalProfile | undefined = input.profiles.find(
    ({ type }) => type === "local"
  ) as LocalProfile | undefined;
  if (localProfile) {
    validateEmail(localProfile.id);
    validatePassword(localProfile.password);

    if (input.email !== localProfile.id) {
      throw new Error("email addresses don't match profile");
    }
  }

  const user = await insertUser(mongo, tenant.id, input, now);

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

  validateUsername(username);

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

  validateEmail(email);

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

  validatePassword(password);

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

  validatePassword(password);

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
  name: string,
  now = new Date()
) {
  // Create the token for the User!
  const result = await createUserToken(mongo, tenant.id, user.id, name, now);

  // Sign the token!
  const signedToken = await signPATString(config, user, {
    // Tokens are issued with the token ID as their JWT ID.
    jwtid: result.token.id,

    // Tokens are issued with the tenant ID.
    issuer: tenant.id,

    // Tokens are not valid before the creation date.
    notBefore: DateTime.fromJSDate(now).toSeconds(),
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
  validateUsername(username);

  return updateUserUsername(mongo, tenant.id, userID, username);
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
  user: Pick<User, "id">,
  userID: string,
  role: GQLUSER_ROLE
) {
  if (user.id === userID) {
    throw new Error("cannot update your own user role");
  }

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
  validateEmail(email);

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

/**
 * ban will ban a specific user from interacting with Talk.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be banned on
 * @param user the User that is banning the User
 * @param userID the ID of the User being banned
 * @param now the current time that the ban took effect
 */
export async function ban(
  mongo: Db,
  mailer: MailerQueue,
  tenant: Tenant,
  banner: User,
  userID: string,
  now = new Date()
) {
  // Get the user being banned to check to see if the user already has an
  // existing ban.
  const targetUser = await retrieveUser(mongo, tenant.id, userID);
  if (!targetUser) {
    throw new UserNotFoundError(userID);
  }

  // Check to see if the User is currently banned.
  const banStatus = consolidateUserBanStatus(targetUser.status.ban);
  if (banStatus.active) {
    throw new UserAlreadyBannedError();
  }

  // Ban the user.
  const user = await banUser(mongo, tenant.id, userID, banner.id, now);

  if (user.email) {
    // Send the ban user email.
    await mailer.add({
      tenantID: tenant.id,
      message: {
        to: user.email,
      },
      template: {
        name: "ban",
        context: {
          // TODO: (wyattjoh) possibly reevaluate the use of a required username.
          username: user.username!,
          organizationName: tenant.organization.name,
          organizationURL: tenant.organization.url,
        },
      },
    });
  }

  return user;
}

/**
 * suspend will suspend a give user from interacting with Talk.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be suspended on
 * @param user the User that is suspending the User
 * @param userID the ID of the user being suspended
 * @param timeout the duration in seconds that the user will suspended for
 * @param now the current time that the suspension will take effect
 */
export async function suspend(
  mongo: Db,
  tenant: Tenant,
  user: User,
  userID: string,
  timeout: number,
  now = new Date()
) {
  // Convert the timeout to the until time.
  const finish = DateTime.fromJSDate(now)
    .plus({ seconds: timeout })
    .toJSDate();

  // Get the user being suspended to check to see if the user already has an
  // existing suspension.
  const targetUser = await retrieveUser(mongo, tenant.id, userID);
  if (!targetUser) {
    throw new UserNotFoundError(userID);
  }

  // Check to see if the User is currently suspended.
  const suspended = consolidateUserSuspensionStatus(
    targetUser.status.suspension,
    now
  );
  if (suspended.active && suspended.until) {
    throw new UserAlreadySuspendedError(suspended.until);
  }

  return suspendUser(mongo, tenant.id, userID, user.id, finish, now);
}

export async function removeSuspension(
  mongo: Db,
  tenant: Tenant,
  user: User,
  userID: string,
  now = new Date()
) {
  // Get the user being suspended to check to see if the user already has an
  // existing suspension.
  const targetUser = await retrieveUser(mongo, tenant.id, userID);
  if (!targetUser) {
    throw new UserNotFoundError(userID);
  }

  // Check to see if the User is currently suspended.
  const suspended = consolidateUserSuspensionStatus(
    targetUser.status.suspension,
    now
  );
  if (!suspended.active) {
    // The user is not suspended currently, just return the user because we
    // don't have to do anything.
    return targetUser;
  }

  // For each of the suspensions, remove it.
  return removeActiveUserSuspensions(mongo, tenant.id, userID, user.id, now);
}

export async function removeBan(
  mongo: Db,
  tenant: Tenant,
  user: User,
  userID: string,
  now = new Date()
) {
  // Get the user being un-banned to check if they are even banned.
  const targetUser = await retrieveUser(mongo, tenant.id, userID);
  if (!targetUser) {
    throw new UserNotFoundError(userID);
  }

  // Check to see if the User is currently banned.
  const banStatus = consolidateUserBanStatus(targetUser.status.ban);
  if (!banStatus.active) {
    // The user is not ban currently, just return the user because we don't
    // have to do anything.
    return targetUser;
  }

  return removeUserBan(mongo, tenant.id, userID, user.id, now);
}
