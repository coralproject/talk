import { intersection } from "lodash";
import { DateTime } from "luxon";

import {
  ALLOWED_USERNAME_CHANGE_TIMEFRAME_DURATION,
  COMMENT_REPEAT_POST_DURATION,
  DOWNLOAD_LIMIT_TIMEFRAME_DURATION,
  MAX_BIO_LENGTH,
  SCHEDULED_DELETION_WINDOW_DURATION,
} from "coral-common/constants";
import { formatDate } from "coral-common/date";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import {
  DuplicateEmailError,
  DuplicateUserError,
  EmailAlreadySetError,
  EmailNotSetError,
  InternalError,
  InvalidCredentialsError,
  LocalProfileAlreadySetError,
  LocalProfileNotSetError,
  PasswordIncorrect,
  TokenNotFoundError,
  UserAlreadyBannedError,
  UserAlreadyPremoderated,
  UserAlreadySuspendedError,
  UserBioTooLongError,
  UserCannotBeIgnoredError,
  UsernameAlreadySetError,
  UsernameUpdatedWithinWindowError,
  UserNotFoundError,
} from "coral-server/errors";
import logger from "coral-server/logger";
import { Comment, retrieveComment } from "coral-server/models/comment";
import { retrieveManySites } from "coral-server/models/site";
import {
  ensureFeatureFlag,
  hasFeatureFlag,
  linkUsersAvailable,
  Tenant,
} from "coral-server/models/tenant";
import {
  acknowledgeOwnModMessage,
  acknowledgeOwnWarning,
  banUser,
  clearDeletionDate,
  consolidateUserBanStatus,
  consolidateUserModMessageStatus,
  consolidateUserPremodStatus,
  consolidateUserSuspensionStatus,
  consolidateUserWarningStatus,
  createModeratorNote,
  createUser,
  createUserToken,
  deactivateUserToken,
  deleteModeratorNote,
  findOrCreateUser,
  FindOrCreateUserInput,
  ignoreUser,
  linkUsers,
  mergeUserSiteModerationScopes,
  modMessageUser,
  NotificationSettingsInput,
  premodUser,
  pullUserSiteModerationScopes,
  removeActiveUserSuspensions,
  removeUserBan,
  removeUserIgnore,
  removeUserPremod,
  removeUserSiteBan,
  removeUserWarning,
  retrieveUser,
  retrieveUserWithEmail,
  scheduleDeletionDate,
  setUserEmail,
  setUserLastDownloadedAt,
  setUserLocalProfile,
  setUserUsername,
  siteBanUser,
  suspendUser,
  updateUserAvatar,
  updateUserBio,
  updateUserEmail,
  updateUserMediaSettings,
  UpdateUserMediaSettingsInput,
  updateUserModerationScopes,
  updateUserNotificationSettings,
  updateUserPassword,
  updateUserRole,
  updateUserUsername,
  User,
  UserModerationScopes,
  verifyUserPassword,
  warnUser,
} from "coral-server/models/user";
import {
  getLocalProfile,
  hasLocalProfile,
  hasStaffRole,
  isSiteModerationScoped,
} from "coral-server/models/user/helpers";
import { MailerQueue } from "coral-server/queue/tasks/mailer";
import { RejectorQueue } from "coral-server/queue/tasks/rejector";
import { JWTSigningConfig, signPATString } from "coral-server/services/jwt";
import { sendConfirmationEmail } from "coral-server/services/users/auth";

import {
  GQLAuthIntegrations,
  GQLFEATURE_FLAG,
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
  config: Config,
  mongo: MongoContext,
  tenant: Tenant,
  input: FindOrCreateUser,
  options: FindOrCreateUserOptions,
  now: Date
) {
  // Validate the input.
  validateFindOrCreateUserInput(input, options);

  try {
    // Try to find or create the user.
    const { user } = await findOrCreateUser(mongo, tenant.id, input, now);

    return user;
  } catch (err) {
    // If this error is related to a duplicate user error, we might have
    // encountered a race related to the unique index. We should try once more
    // to perform the operation.
    if (err instanceof DuplicateUserError) {
      // Retry the operation once more, if this operation fails, the error will
      // exit this function.
      const { user } = await findOrCreateUser(mongo, tenant.id, input, now);

      return user;
    }

    // If this is an error related to a duplicate email, we might be in a
    // position where the user can link their accounts. This can only occur if
    // the tenant has both local and another social profile enabled.
    if (
      err instanceof DuplicateEmailError &&
      linkUsersAvailable(config, tenant)
    ) {
      // Pull the email address out of the input, and re-try creating the user
      // given that. We need to pull the verified property out because we don't
      // want to have that embedded in the `...rest` object.
      const { email, emailVerified, ...rest } = input;

      // Create the user again this time, but associate the duplicate email to
      // the user account.
      const { user } = await findOrCreateUser(
        mongo,
        tenant.id,
        { ...rest, duplicateEmail: email },
        now
      );

      return user;
    }

    // The error wasn't related to a duplicate user or duplicate email error,
    // so just re-throw that error again.
    throw err;
  }
}

export type CreateUser = FindOrCreateUserInput;
export type CreateUserOptions = FindOrCreateUserOptions;

export async function create(
  mongo: MongoContext,
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
  mongo: MongoContext,
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
  mongo: MongoContext,
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
  mongo: MongoContext,
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
  mongo: MongoContext,
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
  mongo: MongoContext,
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

  const formattedDate = formatDate(deletionDate.toJSDate(), tenant.locale);

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
  mongo: MongoContext,
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
  mongo: MongoContext,
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
  mongo: MongoContext,
  tenant: Tenant,
  user: User,
  id: string
) {
  if (!user.tokens.find((t) => t.id === id)) {
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
  mongo: MongoContext,
  mailer: MailerQueue,
  tenant: Tenant,
  user: User,
  username: string,
  now: Date
) {
  // Validate the username.
  validateUsername(username);

  if (!tenant.accountFeatures.changeUsername) {
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
  mongo: MongoContext,
  tenant: Tenant,
  userID: string,
  username: string,
  createdBy: User
) {
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
  mongo: MongoContext,
  tenant: Tenant,
  viewer: Pick<User, "id">,
  userID: string,
  role: GQLUSER_ROLE
) {
  if (viewer.id === userID) {
    throw new Error("cannot update your own user role");
  }

  return updateUserRole(mongo, tenant.id, userID, role);
}

export async function promoteUser(
  mongo: MongoContext,
  tenant: Tenant,
  viewer: User,
  userID: string
) {
  if (!hasFeatureFlag(tenant, GQLFEATURE_FLAG.SITE_MODERATOR)) {
    throw new InternalError("feature flag not enabled", {
      flag: GQLFEATURE_FLAG.SITE_MODERATOR,
    });
  }

  if (viewer.id === userID) {
    throw new Error("cannot promote yourself");
  }

  if (!isSiteModerationScoped(viewer.moderationScopes)) {
    throw new Error("viewer must be a site moderator");
  }

  const user = await retrieveUser(mongo, tenant.id, userID);
  if (!user) {
    throw new UserNotFoundError(userID);
  }

  if (user.role === GQLUSER_ROLE.ADMIN) {
    throw new Error("user can't be an admin");
  }

  if (
    user.role === GQLUSER_ROLE.MODERATOR &&
    !isSiteModerationScoped(user.moderationScopes)
  ) {
    throw new Error("user can't be an organization moderator");
  }

  // Merge the site moderation scopes.
  let updated = await mergeUserSiteModerationScopes(
    mongo,
    tenant.id,
    userID,
    viewer.moderationScopes.siteIDs
  );

  // If the user isn't a site moderator now, make them one!
  if (updated.role !== GQLUSER_ROLE.MODERATOR) {
    updated = await updateUserRole(
      mongo,
      tenant.id,
      user.id,
      GQLUSER_ROLE.MODERATOR
    );
  }

  return updated;
}

export async function demoteUser(
  mongo: MongoContext,
  tenant: Tenant,
  viewer: User,
  userID: string
) {
  if (!hasFeatureFlag(tenant, GQLFEATURE_FLAG.SITE_MODERATOR)) {
    throw new InternalError("feature flag not enabled", {
      flag: GQLFEATURE_FLAG.SITE_MODERATOR,
    });
  }

  if (viewer.id === userID) {
    throw new Error("cannot promote yourself");
  }

  if (!isSiteModerationScoped(viewer.moderationScopes)) {
    throw new Error("viewer must be a site moderator");
  }

  const user = await retrieveUser(mongo, tenant.id, userID);
  if (!user) {
    throw new UserNotFoundError(userID);
  }

  if (user.role === GQLUSER_ROLE.ADMIN) {
    throw new Error("user can't be an admin");
  }

  if (
    user.role === GQLUSER_ROLE.MODERATOR &&
    !isSiteModerationScoped(user.moderationScopes)
  ) {
    throw new Error("user can't be an organization moderator");
  }

  // Pull the site moderation scopes.
  let updated = await pullUserSiteModerationScopes(
    mongo,
    tenant.id,
    userID,
    viewer.moderationScopes.siteIDs
  );

  // If the user doesn't have any more siteID's, demote the user role to a
  // commenter.
  if (updated.moderationScopes?.siteIDs?.length === 0) {
    updated = await updateUserRole(
      mongo,
      tenant.id,
      user.id,
      GQLUSER_ROLE.COMMENTER
    );
  }

  return updated;
}

export async function updateModerationScopes(
  mongo: MongoContext,
  tenant: Tenant,
  viewer: Pick<User, "id">,
  userID: string,
  moderationScopes: UserModerationScopes
) {
  // Ensure Tenant has site moderators enabled.
  ensureFeatureFlag(tenant, GQLFEATURE_FLAG.SITE_MODERATOR);

  if (viewer.id === userID) {
    throw new Error("cannot update your own moderation scopes");
  }

  if (!moderationScopes.siteIDs) {
    throw new Error("no sites specified in the moderation scopes");
  }

  const sites = await retrieveManySites(
    mongo,
    tenant.id,
    moderationScopes.siteIDs
  );
  if (sites.some((site) => site === null)) {
    throw new Error(
      "some or all of the sites specified in the moderation scopes do not exist"
    );
  }

  return updateUserModerationScopes(mongo, tenant.id, userID, moderationScopes);
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
): ReadonlyArray<keyof GQLAuthIntegrations> {
  const integrations = Object.keys(tenant.auth.integrations) as ReadonlyArray<
    keyof GQLAuthIntegrations
  >;

  return integrations.filter((key) => {
    // Get the filter and enabled status for the integration.
    const { enabled, targetFilter } = tenant.auth.integrations[key];
    if (!enabled) {
      return false;
    }

    // If the target was specified, then filter for that target.
    if (target) {
      return targetFilter[target];
    }

    // Otherwise, require all targets.
    return targetFilter.admin && targetFilter.stream;
  });
}

/**
 * canUpdateEmailAddress will determine if a user is permitted to update their
 * email address.
 *
 * @param tenant Tenant where the User will be interacted with
 * @param user the User that we are updating
 */
function canUpdateEmailAddress(tenant: Tenant, user: User): boolean {
  // If the user doesn't have a local profile, they can't update their email
  // address because the email address is externally controlled.
  if (!hasLocalProfile(user)) {
    return false;
  }

  // Get the enabled integrations for the stream.
  const integrations = enabledAuthenticationIntegrations(tenant, "stream");

  // If the local auth integration is enabled, then the user can update the
  // email address.
  if (integrations.includes("local")) {
    return true;
  }

  return false;
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
  mongo: MongoContext,
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

  if (!canUpdateEmailAddress(tenant, user)) {
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
  mongo: MongoContext,
  tenant: Tenant,
  userID: string,
  email: string
) {
  // Validate the email address.
  validateEmail(email);

  return updateUserEmail(mongo, tenant.id, userID, email, true);
}

/**
 * updateBio will update the given User's avatar.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be interacted with
 * @param userID the User's ID that we are updating
 * @param bio the bio that we are setting on the User
 */
export async function updateBio(
  mongo: MongoContext,
  tenant: Tenant,
  user: User,
  bio?: string
) {
  if (bio && bio.length > MAX_BIO_LENGTH) {
    throw new UserBioTooLongError(user.id);
  }

  return updateUserBio(mongo, tenant.id, user.id, bio);
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
  mongo: MongoContext,
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
  mongo: MongoContext,
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
  mongo: MongoContext,
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
 * @param rejector the comment rejector queue
 * @param tenant Tenant where the User will be banned on
 * @param banner the User that is banning the User
 * @param userID the ID of the User being banned
 * @param message message to banned user
 * @param rejectExistingComments whether all the authors previous comments should be rejected
 * @param now the current time that the ban took effect
 */
export async function ban(
  mongo: MongoContext,
  mailer: MailerQueue,
  rejector: RejectorQueue,
  tenant: Tenant,
  banner: User,
  userID: string,
  message: string,
  rejectExistingComments: boolean,
  siteIDs?: string[] | null,
  now = new Date()
) {
  // site moderators must provide at least one site ID to ban the user on
  // otherwise, they would be performing an organization wide ban.
  if (
    // check if they are a site moderator
    banner.role === GQLUSER_ROLE.MODERATOR &&
    banner.moderationScopes &&
    banner.moderationScopes.siteIDs &&
    banner.moderationScopes.siteIDs.length !== 0 &&
    // ensure they've provided at least one site ID
    (!siteIDs || siteIDs.length === 0)
  ) {
    throw new Error("site moderators must provide at least one site ID to ban");
  }

  // Get the user being banned to check to see if the user already has an
  // existing ban.
  const targetUser = await retrieveUser(mongo, tenant.id, userID);
  if (!targetUser) {
    throw new UserNotFoundError(userID);
  }

  let user: Readonly<User>;

  // Perform a site ban
  if (siteIDs && siteIDs.length > 0) {
    user = await siteBanUser(
      mongo,
      tenant.id,
      userID,
      banner.id,
      message,
      siteIDs,
      now
    );
  }
  // Otherwise, perform a regular ban
  else {
    // Check to see if the User is currently banned.
    const banStatus = consolidateUserBanStatus(targetUser.status.ban);
    if (banStatus.active) {
      throw new UserAlreadyBannedError();
    }

    // Ban the user.
    user = await banUser(mongo, tenant.id, userID, banner.id, message, now);

    const supsensionStatus = consolidateUserSuspensionStatus(
      targetUser.status.suspension
    );

    // remove suspension if present
    if (supsensionStatus.active) {
      user = await removeActiveUserSuspensions(
        mongo,
        tenant.id,
        userID,
        banner.id,
        now
      );
    }

    const premodStatus = consolidateUserPremodStatus(targetUser.status.premod);

    // remove premod if present
    if (premodStatus.active) {
      user = await removeUserPremod(mongo, tenant.id, userID, banner.id, now);
    }

    // remove warning if present
    const warningStatus = consolidateUserWarningStatus(
      targetUser.status.warning
    );

    if (warningStatus.active) {
      user = await removeUserWarning(mongo, tenant.id, userID, banner.id, now);
    }

    if (rejectExistingComments) {
      await rejector.add({
        tenantID: tenant.id,
        authorID: userID,
        moderatorID: banner.id,
      });
    }
  }

  // If the user has an email address associated with their account, send them
  // a ban notification email.
  if (user?.email) {
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
  mongo: MongoContext,
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
  mongo: MongoContext,
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
 * modMessage will send a moderation message to a specific user.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be messaged on
 * @param moderator the User that is messaging the User
 * @param userID the ID of the User being messaged
 * @param now the current time that the message was sent
 */
export async function modMessage(
  mongo: MongoContext,
  tenant: Tenant,
  moderator: User,
  userID: string,
  message: string,
  now = new Date()
) {
  // Send moderation message to the user.
  return modMessageUser(mongo, tenant.id, userID, moderator.id, message, now);
}

// todo: need to add some documentation above this function
export async function acknowledgeModMessage(
  mongo: MongoContext,
  tenant: Tenant,
  userID: string,
  now = new Date()
) {
  const targetUser = await retrieveUser(mongo, tenant.id, userID);
  if (!targetUser) {
    throw new UserNotFoundError(userID);
  }

  const modMessageStatus = consolidateUserModMessageStatus(
    targetUser.status.modMessage
  );
  if (!modMessageStatus.active) {
    // The user does not currently have a mod message sent to them, just return the user because we
    // don't have to do anything.
    return targetUser;
  }

  // acknowledge the mod message
  // todo: look into -- is there another way to acknowledge warnings since this specifies own?
  return acknowledgeOwnModMessage(mongo, tenant.id, userID, now);
}

/**
 * warn will warn a specific user.
 *
 * @param mongo mongo database to interact with
 * @param tenant Tenant where the User will be warned on
 * @param moderator the User that is warning the User
 * @param userID the ID of the User being warned
 * @param now the current time that the warning took effect
 */
export async function warn(
  mongo: MongoContext,
  tenant: Tenant,
  moderator: User,
  userID: string,
  message: string,
  now = new Date()
) {
  // Get the user being warned to check to see if the user already has an
  // existing warning.
  const targetUser = await retrieveUser(mongo, tenant.id, userID);
  if (!targetUser) {
    throw new UserNotFoundError(userID);
  }

  // Check to see if the User is currently warned.
  const warningStatus = consolidateUserWarningStatus(targetUser.status.warning);
  if (warningStatus.active) {
    throw new Error("User already warned");
  }

  // Ban the user.
  return warnUser(mongo, tenant.id, userID, moderator.id, message, now);
}

export async function removeWarning(
  mongo: MongoContext,
  tenant: Tenant,
  moderator: User,
  userID: string,
  now = new Date()
) {
  // Get the user being suspended to check to see if the user already has an
  // existing warning.
  const targetUser = await retrieveUser(mongo, tenant.id, userID);
  if (!targetUser) {
    throw new UserNotFoundError(userID);
  }

  // Check to see if the User is currently warned.
  const warningStatus = consolidateUserWarningStatus(targetUser.status.warning);
  if (!warningStatus.active) {
    // The user is not warned currently, just return the user because we
    // don't have to do anything.
    return targetUser;
  }

  // remove warning.
  return removeUserWarning(mongo, tenant.id, userID, moderator.id, now);
}

export async function acknowledgeWarning(
  mongo: MongoContext,
  tenant: Tenant,
  userID: string,
  now = new Date()
) {
  const targetUser = await retrieveUser(mongo, tenant.id, userID);
  if (!targetUser) {
    throw new UserNotFoundError(userID);
  }

  const warningStatus = consolidateUserWarningStatus(targetUser.status.warning);
  if (!warningStatus.active) {
    // The user is not warned currently, just return the user because we
    // don't have to do anything.
    return targetUser;
  }

  // remove warning
  return acknowledgeOwnWarning(mongo, tenant.id, userID, now);
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
  mongo: MongoContext,
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
  mongo: MongoContext,
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
  mongo: MongoContext,
  tenant: Tenant,
  viewer: User,
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

  // Remove a regular ban
  if (banStatus.active) {
    return removeUserBan(mongo, tenant.id, userID, viewer.id, now);
  }
  // Remove a site ban
  else if (banStatus.siteIDs && banStatus.siteIDs.length > 0) {
    return removeUserSiteBan(
      mongo,
      tenant.id,
      userID,
      viewer.id,
      now,
      banStatus.siteIDs
    );
  }

  // The user is not ban currently, just return the user because we don't
  // have to do anything.
  return targetUser;
}

export async function ignore(
  mongo: MongoContext,
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
  if (user.ignoredUsers && user.ignoredUsers.some((u) => u.id === userID)) {
    // TODO: improve error
    throw new Error("user already ignored");
  }

  await ignoreUser(mongo, tenant.id, user.id, userID, now);

  return targetUser;
}

export async function removeIgnore(
  mongo: MongoContext,
  tenant: Tenant,
  user: User,
  userID: string
) {
  // Get the user being un-ignored to check if they exist.
  const targetUser = await retrieveUser(mongo, tenant.id, userID);
  if (!targetUser) {
    throw new UserNotFoundError(userID);
  }

  if (user.ignoredUsers && user.ignoredUsers.every((u) => u.id !== userID)) {
    // TODO: improve error
    throw new Error("user already not ignored");
  }

  await removeUserIgnore(mongo, tenant.id, user.id, userID);

  return targetUser;
}

export async function requestCommentsDownload(
  mongo: MongoContext,
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
          date: formatDate(now, tenant.locale),
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
  mongo: MongoContext,
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
  mongo: MongoContext,
  tenant: Tenant,
  user: User,
  settings: NotificationSettingsInput
) {
  return updateUserNotificationSettings(mongo, tenant.id, user.id, settings);
}

export async function updateMediaSettings(
  mongo: MongoContext,
  tenant: Tenant,
  user: User,
  settings: UpdateUserMediaSettingsInput
) {
  return updateUserMediaSettings(mongo, tenant.id, user.id, settings);
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
 * retrieveUserLastCommentNotArchived will return the id (if set) of the comment that
 * the user last wrote. This will return null if the user has not made a comment
 * within the CURRENT_REPEAT_POST_TIMESPAN.
 *
 * @param mongo the db
 * @param redis the Redis instance that Coral interacts with
 * @param tenant the Tenant to operate on
 * @param user the User that we're looking up the limit for
 */
export async function retrieveUserLastCommentNotArchived(
  mongo: MongoContext,
  redis: AugmentedRedis,
  tenant: Tenant,
  user: User
): Promise<Readonly<Comment> | null> {
  const id: string | null = await redis.get(userLastCommentIDKey(tenant, user));
  if (!id) {
    return null;
  }

  return retrieveComment(mongo.comments(), tenant.id, id);
}

export interface LinkUser {
  email: string;
  password: string;
}

export async function link(
  config: Config,
  mongo: MongoContext,
  tenant: Tenant,
  source: User,
  { email, password }: LinkUser
) {
  if (!linkUsersAvailable(config, tenant)) {
    throw new Error("cannot link users, not available");
  }

  // TODO: validate the source user

  // Refuse to link a user that already has an email address.
  if (source.email || hasLocalProfile(source)) {
    throw new Error("user already has an email linked to the source account");
  }

  // Validate the input. If the values do not pass validation, it can't possibly
  // be correct.
  validateEmail(email);

  // Validate if the credentials are correct.
  const destination = await retrieveUserWithEmail(mongo, tenant.id, email);
  if (!destination) {
    throw new InvalidCredentialsError(
      "can't find user linked with email address"
    );
  }

  // Validate that the source and destination user aren't the same.
  if (destination.id === source.id) {
    throw new Error("cannot link the same accounts together");
  }

  // Ensure that the destination profile has a local profile.
  if (!hasLocalProfile(destination, email)) {
    throw new Error("destination user does not have a local profile");
  }

  // Ensure there is no clash between the source and destination user profiles.
  const profiles = {
    destination: (destination.profiles || []).map((p) => p.type),
    source: (source.profiles || []).map((p) => p.type),
  };

  // Check for any intersecting profiles.
  const intersecting = intersection(profiles.destination, profiles.source);
  if (intersecting.length > 0) {
    throw new Error(
      `user linking found intersecting profiles: ${intersecting}`
    );
  }

  // Verify if the password provided is correct for this account.
  const verified = await verifyUserPassword(destination, password, email);
  if (!verified) {
    throw new InvalidCredentialsError("can't verify password for linking");
  }

  // Perform the account linking step to delete the source user and copy over
  // the account profiles.
  const linked = await linkUsers(mongo, tenant.id, source.id, destination.id);

  // TODO: send an email to the linked user

  return linked;
}
