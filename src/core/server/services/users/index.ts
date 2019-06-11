import { DateTime } from "luxon";
import { Db } from "mongodb";

import {
  EmailAlreadySetError,
  EmailNotSetError,
  LocalProfileAlreadySetError,
  LocalProfileNotSetError,
  TokenNotFoundError,
  UserAlreadyBannedError,
  UserAlreadySuspendedError,
  UserCannotBeIgnoredError,
  UsernameAlreadySetError,
  UserNotFoundError,
} from "coral-server/errors";
import { GQLUSER_ROLE } from "coral-server/graph/tenant/schema/__generated__/types";
import { getLocalProfile, hasLocalProfile } from "coral-server/helpers/users";
import { Tenant } from "coral-server/models/tenant";
import {
  banUser,
  consolidateUserBanStatus,
  consolidateUserSuspensionStatus,
  createUserToken,
  deactivateUserToken,
  ignoreUser,
  insertUser,
  InsertUserInput,
  removeActiveUserSuspensions,
  removeUserBan,
  removeUserIgnore,
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
} from "coral-server/models/user";
import { userIsStaff } from "coral-server/models/user/helpers";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { JWTSigningConfig, signPATString } from "coral-server/services/jwt";

import { validateEmail, validatePassword, validateUsername } from "./helpers";

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

  const localProfile = getLocalProfile(input);
  if (localProfile) {
    validateEmail(localProfile.id);
    validatePassword(localProfile.password);

    if (input.email !== localProfile.id) {
      throw new Error("email addresses don't match profile");
    }
  }

  const user = await insertUser(mongo, tenant.id, input, now);

  // // TODO: (wyattjoh) evaluate the tenant to determine if we should send the verification email.
  // if (localProfile && user.email) {
  //   if (mailer) {
  //     // // Send the email confirmation email.
  //     // await sendConfirmationEmail(mongo, mailer, tenant, user, user.email);
  //   } else {
  //     // FIXME: (wyattjoh) extract the local profile based inserts into another function.
  //     throw new Error("local profile was provided, but the mailer was not");
  //   }
  // }

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
  mailer: MailerQueue,
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

  const updatedUser = await setUserEmail(mongo, tenant.id, user.id, email);

  // // FIXME: (wyattjoh) evaluate the tenant to determine if we should send the verification email.
  // // Send the email confirmation email.
  // await sendConfirmationEmail(mailer, tenant, updatedUser, email);

  return updatedUser;
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
  if (hasLocalProfile(user)) {
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
  mailer: MailerQueue,
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
  if (!hasLocalProfile(user, user.email)) {
    throw new LocalProfileNotSetError();
  }

  validatePassword(password);

  const updatedUser = await updateUserPassword(
    mongo,
    tenant.id,
    user.id,
    password
  );

  // If the user has an email address associated with their account, send them
  // a ban notification email.
  if (updatedUser.email) {
    // Send the ban user email.
    await mailer.add({
      tenantID: tenant.id,
      message: {
        to: updatedUser.email,
      },
      template: {
        name: "password-change",
        context: {
          // TODO: (wyattjoh) possibly reevaluate the use of a required username.
          username: updatedUser.username!,
          organizationName: tenant.organization.name,
          organizationURL: tenant.organization.url,
          organizationContactEmail: tenant.organization.contactEmail,
        },
      },
    });
  }

  return user;
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
 * updateEmail will update the given User's email address. This should not
 * trigger and email notifications as it's designed to be used by administrators
 * to update a user's email address.
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
 * ban will ban a specific user from interacting with Coral.
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

  // If the user has an email address associated with their account, send them
  // a ban notification email.
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
          organizationContactEmail: tenant.organization.contactEmail,
        },
      },
    });
  }

  return user;
}

/**
 * suspend will suspend a give user from interacting with Coral.
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
  mailer: MailerQueue,
  tenant: Tenant,
  user: User,
  userID: string,
  timeout: number,
  now = new Date()
) {
  // Convert the timeout to the until time.
  const finishDateTime = DateTime.fromJSDate(now).plus({ seconds: timeout });

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

  const updatedUser = await suspendUser(
    mongo,
    tenant.id,
    userID,
    user.id,
    finishDateTime.toJSDate(),
    now
  );

  // If the user has an email address associated with their account, send them
  // a suspend notification email.
  if (updatedUser.email) {
    // Send the suspend user email.
    await mailer.add({
      tenantID: tenant.id,
      message: {
        to: updatedUser.email,
      },
      template: {
        name: "suspend",
        context: {
          // TODO: (wyattjoh) possibly reevaluate the use of a required username.
          username: updatedUser.username!,
          until: finishDateTime.toRFC2822(),
          organizationName: tenant.organization.name,
          organizationURL: tenant.organization.url,
          organizationContactEmail: tenant.organization.contactEmail,
        },
      },
    });
  }

  return updatedUser;
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

export async function ignore(
  mongo: Db,
  tenant: Tenant,
  user: User,
  userID: string,
  now = new Date()
) {
  // Get the user being ignored to check if they exist.
  const targetUser = await retrieveUser(mongo, tenant.id, userID);
  if (!targetUser) {
    throw new UserNotFoundError(userID);
  }

  const userToBeIgnoredIsStaff = userIsStaff(targetUser);
  if (userToBeIgnoredIsStaff) {
    throw new UserCannotBeIgnoredError(userID);
  }

  // TODO: extract function
  if (user.ignoredUsers && user.ignoredUsers.some(u => u.id === userID)) {
    // TODO: improve error
    throw new Error("user already ignored");
  }

  await ignoreUser(mongo, tenant.id, user.id, userID, now);

  return targetUser;
}

export async function removeIgnore(
  mongo: Db,
  tenant: Tenant,
  user: User,
  userID: string
) {
  // Get the user being un-ignored to check if they exist.
  const targetUser = await retrieveUser(mongo, tenant.id, userID);
  if (!targetUser) {
    throw new UserNotFoundError(userID);
  }

  if (user.ignoredUsers && user.ignoredUsers.every(u => u.id !== userID)) {
    // TODO: improve error
    throw new Error("user already not ignored");
  }

  await removeUserIgnore(mongo, tenant.id, user.id, userID);

  return targetUser;
}
