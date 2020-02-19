import { DateTime } from "luxon";
import { Db } from "mongodb";

import {
  ALLOWED_USERNAME_CHANGE_TIMEFRAME_DURATION,
  COMMENT_REPEAT_POST_DURATION,
  DOWNLOAD_LIMIT_TIMEFRAME_DURATION,
  SCHEDULED_DELETION_WINDOW_DURATION,
} from "coral-common/constants";
import { Config } from "coral-server/config";
import {
  DuplicateEmailError,
  DuplicateUserError,
  EmailAlreadySetError,
  EmailNotSetError,
  LocalProfileAlreadySetError,
  LocalProfileNotSetError,
  PasswordIncorrect,
  TokenNotFoundError,
  UserAlreadyBannedError,
  UserAlreadyPremoderated,
  UserAlreadySuspendedError,
  UserCannotBeIgnoredError,
  UsernameAlreadySetError,
  UsernameUpdatedWithinWindowError,
  UserNotFoundError,
} from "coral-server/errors";
import logger from "coral-server/logger";
import { Comment, retrieveComment } from "coral-server/models/comment";
import { Tenant } from "coral-server/models/tenant";
import {
  banUser,
  clearDeletionDate,
  consolidateUserBanStatus,
  consolidateUserPremodStatus,
  consolidateUserSuspensionStatus,
  createModeratorNote,
  createUser,
  createUserToken,
  deactivateUserToken,
  deleteModeratorNote,
  findOrCreateUser,
  FindOrCreateUserInput,
  ignoreUser,
  NotificationSettingsInput,
  premodUser,
  removeActiveUserSuspensions,
  removeUserBan,
  removeUserIgnore,
  removeUserPremod,
  retrieveUser,
  retrieveUserWithEmail,
  scheduleDeletionDate,
  setUserEmail,
  setUserLastDownloadedAt,
  setUserLocalProfile,
  setUserUsername,
  suspendUser,
  updateUserAvatar,
  updateUserEmail,
  updateUserNotificationSettings,
  updateUserPassword,
  updateUserRole,
  updateUserUsername,
  User,
  verifyUserPassword,
} from "coral-server/models/user";
import {
  getLocalProfile,
  hasLocalProfile,
  hasStaffRole,
} from "coral-server/models/user/helpers";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { JWTSigningConfig, signPATString } from "coral-server/services/jwt";
import { sendConfirmationEmail } from "coral-server/services/users/auth";

import {
  GQLAuthIntegrations,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";

import { AugmentedRedis } from "../redis";
import {
  generateAdminDownloadLink,
  generateDownloadLink,
} from "./download/token";
import { validateEmail, validatePassword, validateUsername } from "./helpers";

function validateFindOrCreateUserInput(
  input: FindOrCreateUser,
  options: FindOrCreateUserOptions
) {
  if (input.username && !options.skipUsernameValidation) {
    validateUsername(input.username);
  }

  if (input.email) {
    validateEmail(input.email);
  }

  const localProfile = getLocalProfile({ profiles: [input.profile] });
  if (localProfile) {
    validateEmail(localProfile.id);
    validatePassword(localProfile.password);

    if (input.email !== localProfile.id) {
      throw new Error("email addresses don't match profile");
    }
  }
}

export type FindOrCreateUser = FindOrCreateUserInput;

export interface FindOrCreateUserOptions {
  skipUsernameValidation?: boolean;
}

export async function findOrCreate(
  mongo: Db,
  tenant: Tenant,
  input: FindOrCreateUser,
  options: FindOrCreateUserOptions,
  now: Date
) {
  // Validate the input.
  validateFindOrCreateUserInput(input, options);

  const { user, wasUpserted } = await findOrCreateUser(
    mongo,
    tenant.id,
    input,
    now
  );

  if (wasUpserted) {
    // TODO: (wyattjoh) emit that a user was created
  }

  // TODO: (wyattjoh) evaluate the tenant to determine if we should send the verification email.

  return user;
}

export type CreateUser = FindOrCreateUserInput;
export type CreateUserOptions = FindOrCreateUserOptions;

export async function create(
  mongo: Db,
  tenant: Tenant,
  input: CreateUser,
  options: CreateUserOptions,
  now: Date
) {
  // Validate the input.
  validateFindOrCreateUserInput(input, options);

  if (input.id) {
    // Try to check to see if there is a user with the same ID before we try to
    // create the user again.
    const alreadyFoundUser = await retrieveUser(mongo, tenant.id, input.id);
    if (alreadyFoundUser) {
      throw new DuplicateUserError();
    }
  }

  if (input.email) {
    // Try to lookup the user to see if this user already has an account if they
    // do, we can short circuit the database index hit.
    const alreadyFoundUser = await retrieveUserWithEmail(
      mongo,
      tenant.id,
      input.email
    );
    if (alreadyFoundUser) {
      throw new DuplicateEmailError(input.email);
    }
  }

  const user = await createUser(mongo, tenant.id, input, now);

  // TODO: (wyattjoh) emit that a user was created

  // TODO: (wyattjoh) evaluate the tenant to determine if we should send the verification email.

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
 * @param mailer the mailer
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
 * @param mailer the mailer
 * @param tenant Tenant where the User will be interacted with
 * @param user User that should get their password changed
 * @param oldPassword the old password for the User
 * @param newPassword the new password for the User
 */
export async function updatePassword(
  mongo: Db,
  mailer: MailerQueue,
  tenant: Tenant,
  user: User,
  oldPassword: string,
  newPassword: string
) {
  // Validate that the new password is valid.
  validatePassword(newPassword);

  // We require that the email address for the user be defined for this method.
  if (!user.email) {
    throw new EmailNotSetError();
  }

  // We also don't allow this method to be used by users that don't have a local
  // profile already.
  const profile = getLocalProfile(user, user.email);
  if (!profile) {
    throw new LocalProfileNotSetError();
  }

  // Verify that the old password is correct. We'll be using the profile's
  // passwordID to ensure we prevent a race.
  const passwordVerified = await verifyUserPassword(
    user,
    oldPassword,
    user.email
  );
  if (!passwordVerified) {
    // We throw a PasswordIncorrect error here instead of an
    // InvalidCredentialsError because the current user is already signed in.
    throw new PasswordIncorrect();
  }

  const updatedUser = await updateUserPassword(
    mongo,
    tenant.id,
    user.id,
    newPassword,
    profile.passwordID
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
        name: "account-notification/password-change",
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

export async function requestAccountDeletion(
  mongo: Db,
  mailer: MailerQueue,
  tenant: Tenant,
  user: User,
  password: string,
  now: Date
) {
  if (!user.email) {
    throw new EmailNotSetError();
  }

  const passwordVerified = await verifyUserPassword(user, password, user.email);
  if (!passwordVerified) {
    // We throw a PasswordIncorrect error here instead of an
    // InvalidCredentialsError because the current user is already signed in.
    throw new PasswordIncorrect();
  }

  const deletionDate = DateTime.fromJSDate(now).plus({
    seconds: SCHEDULED_DELETION_WINDOW_DURATION,
  });

  const updatedUser = await scheduleDeletionDate(
    mongo,
    tenant.id,
    user.id,
    deletionDate.toJSDate()
  );

  // TODO: extract out into a common shared formatter
  // this is being duplicated everywhere
  const formattedDate = Intl.DateTimeFormat(tenant.locale, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  }).format(deletionDate.toJSDate());

  await mailer.add({
    tenantID: tenant.id,
    message: {
      to: user.email,
    },
    template: {
      name: "account-notification/delete-request-confirmation",
      context: {
        requestDate: formattedDate,
        organizationName: tenant.organization.name,
        organizationURL: tenant.organization.url,
      },
    },
  });

  return updatedUser;
}

export async function cancelAccountDeletion(
  mongo: Db,
  mailer: MailerQueue,
  tenant: Tenant,
  user: User
) {
  if (!user.email) {
    throw new EmailNotSetError();
  }

  const updatedUser = await clearDeletionDate(mongo, tenant.id, user.id);

  await mailer.add({
    tenantID: tenant.id,
    message: {
      to: user.email,
    },
    template: {
      name: "account-notification/delete-request-cancel",
      context: {
        organizationName: tenant.organization.name,
        organizationURL: tenant.organization.url,
      },
    },
  });

  return updatedUser;
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
  const signedToken = await signPATString(
    config,
    user,
    {
      // Tokens are issued with the token ID as their JWT ID.
      jwtid: result.token.id,

      // Tokens are issued with the tenant ID.
      issuer: tenant.id,

      // Tokens are not valid before the creation date.
      notBefore: 0,
    },
    now
  );

  return { ...result, signedToken };
}

/**
 * deactivateToken will disable the given Token so that it can not be used to
 * authenticate any more.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
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
 * updateUsername will update the current users username.
 *
 * @param mongo mongo database to interact with
 * @param mailer mailer queue instance
 * @param tenant Tenant where the User will be interacted with
 * @param user the User we are updating
 * @param username the username that we are setting on the User
 */
export async function updateUsername(
  mongo: Db,
  mailer: MailerQueue,
  tenant: Tenant,
  user: User,
  username: string,
  now: Date
) {
  // Validate the username.
  validateUsername(username);

  const canUpdate = canUpdateLocalProfile(tenant, user);
  if (!canUpdate) {
    throw new Error("Cannot update profile due to tenant settings");
  }

  // Get the earliest date that the username could have been edited before to/
  // allow it now.
  const lastUsernameEditAllowed = DateTime.fromJSDate(now)
    .plus({ seconds: -ALLOWED_USERNAME_CHANGE_TIMEFRAME_DURATION })
    .toJSDate();

  const { history } = user.status.username;
  if (history.length > 1) {
    // If the last update was made at a date sooner than the earliest edited
    // date, then we know that the last edit was conducted within the time-frame
    // already.
    const lastUpdate = history[history.length - 1];
    if (lastUpdate.createdAt > lastUsernameEditAllowed) {
      throw new UsernameUpdatedWithinWindowError(lastUpdate.createdAt);
    }
  }

  const updated = await updateUserUsername(
    mongo,
    tenant.id,
    user.id,
    username,
    user.id
  );

  if (user.email) {
    await mailer.add({
      tenantID: tenant.id,
      message: {
        to: user.email,
      },
      template: {
        name: "account-notification/update-username",
        context: {
          username: user.username!,
          organizationName: tenant.organization.name,
          organizationURL: tenant.organization.url,
          organizationContactEmail: tenant.organization.contactEmail,
        },
      },
    });
  } else {
    logger.warn(
      { id: user.id },
      "Failed to send email: user does not have email address"
    );
  }

  return updated;
}

/**
 * updateUsernameByID will update a given User's username.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param userID the User's ID that we are updating
 * @param username the username that we are setting on the User
 */
export async function updateUsernameByID(
  mongo: Db,
  tenant: Tenant,
  userID: string,
  username: string,
  createdBy: User
) {
  // Validate the username.
  validateUsername(username);

  return updateUserUsername(mongo, tenant.id, userID, username, createdBy.id);
}

/**
 * updateRole will update the given User to the specified role.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param user the user making the request
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
 * enabledAuthenticationIntegrations returns enabled auth integrations for a tenant
 *
 * @param tenant Tenant where the User will be interacted with
 * @param target whether to filter by stream or admin enabled. defaults to requiring both.
 */
function enabledAuthenticationIntegrations(
  tenant: Tenant,
  target?: "stream" | "admin"
): string[] {
  return Object.keys(tenant.auth.integrations).filter((key: string) => {
    const { enabled, targetFilter } = tenant.auth.integrations[
      key as keyof GQLAuthIntegrations
    ];
    if (target) {
      return enabled && targetFilter[target];
    }
    return enabled && targetFilter.admin && targetFilter.stream;
  });
}

/**
 * canUpdateLocalProfile will determine if a user is permitted to update their email address.
 *
 * @param tenant Tenant where the User will be interacted with
 * @param user the User that we are updating
 */
function canUpdateLocalProfile(tenant: Tenant, user: User): boolean {
  if (!tenant.accountFeatures.changeUsername) {
    return false;
  }

  if (!hasLocalProfile(user)) {
    return false;
  }

  const streamAuthTypes = enabledAuthenticationIntegrations(tenant, "stream");

  // user can update email if local auth is enabled or any integration other than sso is enabled
  return (
    streamAuthTypes.includes("local") ||
    !(streamAuthTypes.length === 1 && streamAuthTypes[0] === "sso")
  );
}

/**
 * updateEmail will update the current User's email address.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param mailer The mailer queue
 * @param config Convict config
 * @param signingConfig jwt signing config
 * @param user the User that we are updating
 * @param emailAddress the email address that we are setting on the User
 * @param password the users password for confirmation
 */
export async function updateEmail(
  mongo: Db,
  tenant: Tenant,
  mailer: MailerQueue,
  config: Config,
  signingConfig: JWTSigningConfig,
  user: User,
  emailAddress: string,
  password: string,
  now = new Date()
) {
  const email = emailAddress.toLowerCase();
  validateEmail(email);

  const canUpdate = canUpdateLocalProfile(tenant, user);
  if (!canUpdate) {
    throw new Error("Cannot update profile due to tenant settings");
  }

  const passwordVerified = await verifyUserPassword(user, password);
  if (!passwordVerified) {
    // We throw a PasswordIncorrect error here instead of an
    // InvalidCredentialsError because the current user is already signed in.
    throw new PasswordIncorrect();
  }

  const updated = await updateUserEmail(mongo, tenant.id, user.id, email);

  await sendConfirmationEmail(
    mongo,
    mailer,
    tenant,
    config,
    signingConfig,
    updated as Required<User>,
    now
  );
  return updated;
}

/**
 * updateUserEmail will update the given User's email address. This should not
 * trigger and email notifications as it's designed to be used by administrators
 * to update a user's email address.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param userID the User's ID that we are updating
 * @param email the email address that we are setting on the User
 */
export async function updateEmailByID(
  mongo: Db,
  tenant: Tenant,
  userID: string,
  email: string
) {
  // Validate the email address.
  validateEmail(email);

  return updateUserEmail(mongo, tenant.id, userID, email, true);
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
 * addModeratorNote will add a note to the users account.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be banned on
 * @param moderator the Moderator that is creating the note
 * @param userID the ID of the User who is the subject of the note
 * @param note the contents of the note
 * @param now the current time that the note was created
 */
export async function addModeratorNote(
  mongo: Db,
  tenant: Tenant,
  moderator: User,
  userID: string,
  note: string,
  now = new Date()
) {
  if (!note || note.length < 1) {
    throw new Error("Note cannot be empty");
  }

  return createModeratorNote(mongo, tenant.id, userID, moderator.id, note, now);
}

/**
 * destroyModeratorNote will remove a note from a user
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be banned on
 * @param userID  id of the user who is the subjet
 * @param id  id of the note to delete
 */

export async function destroyModeratorNote(
  mongo: Db,
  tenant: Tenant,
  userID: string,
  id: string,
  createdBy: User
) {
  return deleteModeratorNote(mongo, tenant.id, userID, id, createdBy.id);
}

/**
 * ban will ban a specific user from interacting with Coral.
 *
 * @param mongo mongo database to interact with
 * @param mailer the mailer
 * @param tenant Tenant where the User will be banned on
 * @param banner the User that is banning the User
 * @param userID the ID of the User being banned
 * @param message message to banned user
 * @param now the current time that the ban took effect
 */
export async function ban(
  mongo: Db,
  mailer: MailerQueue,
  tenant: Tenant,
  banner: User,
  userID: string,
  message: string,
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
  const user = await banUser(mongo, tenant.id, userID, banner.id, message, now);

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
        name: "account-notification/ban",
        context: {
          // TODO: (wyattjoh) possibly reevaluate the use of a required username.
          username: user.username!,
          organizationName: tenant.organization.name,
          organizationURL: tenant.organization.url,
          organizationContactEmail: tenant.organization.contactEmail,
          customMessage: (message || "").replace(/\n/g, "<br />"),
        },
      },
    });
  }

  return user;
}

/**
 * premod will premod a specific user.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be banned on
 * @param moderator the User that is banning the User
 * @param userID the ID of the User being banned
 * @param now the current time that the ban took effect
 */
export async function premod(
  mongo: Db,
  tenant: Tenant,
  moderator: User,
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
  const premodStatus = consolidateUserPremodStatus(targetUser.status.premod);
  if (premodStatus.active) {
    throw new UserAlreadyPremoderated();
  }

  // Ban the user.
  return premodUser(mongo, tenant.id, userID, moderator.id, now);
}

export async function removePremod(
  mongo: Db,
  tenant: Tenant,
  moderator: User,
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
  const premodStatus = consolidateUserPremodStatus(targetUser.status.premod);
  if (!premodStatus.active) {
    // The user is not premodded currently, just return the user because we
    // don't have to do anything.
    return targetUser;
  }

  // For each of the suspensions, remove it.
  return removeUserPremod(mongo, tenant.id, userID, moderator.id, now);
}
/**
 * suspend will suspend a give user from interacting with Coral.
 *
 * @param mongo mongo database to interact with
 * @param mailer the mailer
 * @param tenant Tenant where the User will be suspended on
 * @param user the User that is suspending the User
 * @param userID the ID of the user being suspended
 * @param timeout the duration in seconds that the user will suspended for
 * @param message message to suspended user
 * @param now the current time that the suspension will take effect
 */
export async function suspend(
  mongo: Db,
  mailer: MailerQueue,
  tenant: Tenant,
  user: User,
  userID: string,
  timeout: number,
  message: string,
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
    message,
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
        name: "account-notification/suspend",
        context: {
          // TODO: (wyattjoh) possibly reevaluate the use of a required username.
          username: updatedUser.username!,
          until: finishDateTime.toRFC2822(),
          organizationName: tenant.organization.name,
          organizationURL: tenant.organization.url,
          organizationContactEmail: tenant.organization.contactEmail,
          customMessage: (message || "").replace(/\n/g, "<br />"),
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

  const userToBeIgnoredIsStaff = hasStaffRole(targetUser);
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

export async function requestCommentsDownload(
  mongo: Db,
  mailer: MailerQueue,
  tenant: Tenant,
  config: Config,
  signingConfig: JWTSigningConfig,
  user: User,
  now: Date
) {
  if (!tenant.accountFeatures.downloadComments) {
    throw new Error("Downloading comments is not enabled");
  }
  // Check to see if the user is allowed to download this now.
  if (
    user.lastDownloadedAt &&
    DateTime.fromJSDate(user.lastDownloadedAt)
      .plus({ seconds: DOWNLOAD_LIMIT_TIMEFRAME_DURATION })
      .toSeconds() >= DateTime.fromJSDate(now).toSeconds()
  ) {
    throw new Error("requested download too early");
  }

  const downloadUrl = await generateDownloadLink(
    user.id,
    tenant,
    config,
    signingConfig,
    now
  );

  await setUserLastDownloadedAt(mongo, tenant.id, user.id, now);

  if (user.email) {
    await mailer.add({
      tenantID: tenant.id,
      message: {
        to: user.email,
      },
      template: {
        name: "account-notification/download-comments",
        context: {
          username: user.username!,
          date: Intl.DateTimeFormat(tenant.locale).format(now),
          downloadUrl,
          organizationName: tenant.organization.name,
          organizationURL: tenant.organization.url,
        },
      },
    });
  } else {
    logger.error(
      { userID: user.id },
      "could not send download email because the user does not have an email address"
    );
  }

  return user;
}

export async function requestUserCommentsDownload(
  mongo: Db,
  tenant: Tenant,
  config: Config,
  signingConfig: JWTSigningConfig,
  userID: string,
  now: Date
) {
  const downloadUrl = await generateAdminDownloadLink(
    userID,
    tenant,
    config,
    signingConfig,
    now
  );

  return downloadUrl;
}

export async function updateNotificationSettings(
  mongo: Db,
  tenant: Tenant,
  user: User,
  settings: NotificationSettingsInput
) {
  return updateUserNotificationSettings(mongo, tenant.id, user.id, settings);
}

function userLastCommentIDKey(
  tenant: Pick<Tenant, "id">,
  user: Pick<User, "id">
) {
  return `${tenant.id}:lastCommentID:${user.id}`;
}

/**
 * updateUserLastCommentID will update the id of the users most recent comment.
 *
 * @param redis the Redis instance that Coral interacts with
 * @param tenant the Tenant to operate on
 * @param user the User that we're setting the limit for
 * @param commentID the id of the comment
 */
export async function updateUserLastCommentID(
  redis: AugmentedRedis,
  tenant: Tenant,
  user: User,
  commentID: string
) {
  const key = userLastCommentIDKey(tenant, user);

  await redis.set(key, commentID, "EX", COMMENT_REPEAT_POST_DURATION);
}

/**
 * retrieveUserLastComment will return the id (if set) of the comment that
 * the user last wrote. This will return null if the user has not made a comment
 * within the CURRENT_REPEAT_POST_TIMESPAN.
 *
 * @param mongo the db
 * @param redis the Redis instance that Coral interacts with
 * @param tenant the Tenant to operate on
 * @param user the User that we're looking up the limit for
 */
export async function retrieveUserLastComment(
  mongo: Db,
  redis: AugmentedRedis,
  tenant: Tenant,
  user: User
): Promise<Readonly<Comment> | null> {
  const id: string | null = await redis.get(userLastCommentIDKey(tenant, user));
  if (!id) {
    return null;
  }

  return retrieveComment(mongo, tenant.id, id);
}
