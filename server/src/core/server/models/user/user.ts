import bcrypt from "bcryptjs";
import { DateTime, DurationObject } from "luxon";
import { MongoError } from "mongodb";
import { v4 as uuid } from "uuid";

import { DeepPartial, Sub } from "coral-common/common/lib/types";
import { MongoContext } from "coral-server/data/context";
import {
  ConfirmEmailTokenExpired,
  DuplicateEmailError,
  DuplicateUserError,
  EmailAlreadySetError,
  LocalProfileAlreadySetError,
  LocalProfileNotSetError,
  PasswordResetTokenExpired,
  SSOProfileNotSetError,
  TokenNotFoundError,
  UserAlreadyPremoderated,
  UserAlreadySuspendedError,
  UsernameAlreadySetError,
  UserNotFoundError,
} from "coral-server/errors";
import logger from "coral-server/logger";
import {
  Connection,
  ConnectionInput,
  Query,
  resolveConnection,
} from "coral-server/models/helpers";
import { TenantResource } from "coral-server/models/tenant";
import { DigestibleTemplate } from "coral-server/queue/tasks/mailer/templates";
import { dotize } from "coral-server/utils/dotize";

import {
  GQLBanStatus,
  GQLDIGEST_FREQUENCY,
  GQLModMessageStatus,
  GQLPremodStatus,
  GQLSuspensionStatus,
  GQLTimeRange,
  GQLUSER_ROLE,
  GQLUserMediaSettings,
  GQLUsernameStatus,
  GQLUserNotificationSettings,
  GQLWarningStatus,
} from "coral-server/graph/schema/__generated__/types";

import {
  CommentStatusCounts,
  createEmptyCommentStatusCounts,
  updateRelatedCommentCounts,
} from "../comment";
import { getLocalProfile, getSSOProfile, hasLocalProfile } from "./helpers";

export interface LocalProfile {
  type: "local";
  id: string;
  password: string;

  /**
   * passwordID is used to help protect against double password change race
   * conditions. Because the password cannot be compared against directly, this
   * ID can be used as it is only changed when the password is changed.
   */
  passwordID: string;

  /**
   * resetID is used during a password reset process to prevent replay attacks.
   * When a password reset email is sent, a resetID is associated with the
   * account and the token. When a given reset token is used, it is cleared from
   * the user, preventing the same reset URL from being used multiple times.
   */
  resetID?: string;
}

export interface OIDCProfile {
  type: "oidc";
  id: string;
  issuer: string;
  audience: string;
}

export interface SSOProfile {
  type: "sso";
  id: string;
  lastIssuedAt?: Date;
}

export interface FacebookProfile {
  type: "facebook";
  id: string;
}

export interface GoogleProfile {
  type: "google";
  id: string;
}

/**
 * Profile is all the different profiles that a given User may have associated
 * with their account.
 */
export type Profile =
  | LocalProfile
  | OIDCProfile
  | SSOProfile
  | FacebookProfile
  | GoogleProfile;

export interface Token {
  readonly id: string;
  name: string;
  createdAt: Date;
}

/**
 * ModeratorNote ModeratorNote is a note left by a moderator on the subject of a user.
 */
export interface ModeratorNote {
  /**
   * id is the identifier of the Note.
   */
  id: string;
  /**
   * body is the content of the Note
   */
  body: string;
  /**
   * createdAt is the date in which the Note was created.
   */
  createdAt: Date;
  /**
   * createdBy is the Moderator that authored the Note
   */
  createdBy: string;
}

/**
 * SuspensionStatusHistory SuspensionStatusHistory is the list of all suspension
 * events against a specific User.
 */
export interface SuspensionStatusHistory {
  /**
   * id is a specific reference for a particular suspension status that will be
   * used internally to update suspension records.
   */
  id: string;

  /**
   * from represents a range of time where a user suspension applies.
   */
  from: GQLTimeRange;

  /**
   * createdBy is the ID for the User that suspended the User. If `null`, the
   * suspension was created by the system.
   */
  createdBy?: string;

  /**
   * createdAt is the time that the given suspension time frame was created.
   */
  createdAt: Date;

  /**
   * modifiedBy is the ID for the User that modified the suspension for this
   * User. If `null`, the suspension has not been edited, or has been edited by
   * the system.
   */
  modifiedBy?: string;

  /**
   * modifiedAt is the time that the date that the given suspension time frame
   * was edited at.
   */
  modifiedAt?: Date;

  /**
   * message is the email message content sent to the user.
   */
  message: string;
}

/**
 * SuspensionStatus stores the user suspension status as well as the history of
 * changes.
 */
export interface SuspensionStatus {
  /**
   * history is the list of all suspension events against a specific User.
   */
  history: SuspensionStatusHistory[];
}

/**
 * BanStatusHistory is the list of all ban events against a specific User.
 */
export interface BanStatusHistory {
  /**
   * id is a specific reference for a particular banned status that will be
   * used internally to update banned records.
   */
  id: string;

  /**
   * active, when true, indicates that the user is banned from this status.
   */
  active: boolean;

  /**
   * createdBy is the ID for the User that banned the User. If `null`, the ban
   * was created by the system.
   */
  createdBy?: string;

  /**
   * createdAt is the time that the given ban was added.
   */
  createdAt: Date;

  message?: string;

  /**
   * will be populated if the ban was site-specific.
   */
  siteIDs?: string[];
}

/**
 * BanStatus contains information about a ban for a given User.
 */
export interface BanStatus {
  /**
   * active when true, indicates that the given user is banned.
   */
  active: boolean;

  siteIDs?: string[];

  /**
   * history is the list of all ban events against a specific User.
   */
  history: BanStatusHistory[];
}

export interface UsernameHistory {
  /**
   * id is a specific reference for a particular username history that will be
   * used internally to update username records.
   */
  id: string;

  /**
   * username is the username that was assigned
   */
  username: string;

  /**
   * createdBy is the user that created this username
   */
  createdBy: string;

  /**
   * createdAt is the time the username was created
   */
  createdAt: Date;
}

export interface UsernameStatus {
  /**
   * history is the list of all usernames for this user
   */
  history: UsernameHistory[];
}

/**
 * PremodStatusHistory is the history of premod status changes
 * against a specific User.
 */
export interface PremodStatusHistory {
  /**
   * active when true, indicates that the given user is premodded.
   */
  active: boolean;
  /**
   * createdBy is the ID for the User that premodded the User. If `null`, the
   * premod was created by the system.
   */
  createdBy?: string;

  /**
   * createdAt is the time that the given premod status was set.
   */
  createdAt: Date;
}

/**
 * PremodStatus is the status of whether a user is set to mandatory premod
 */
export interface PremodStatus {
  /**
   * active when true, indicates that the given user is set to mandatory premod.
   */
  active: boolean;

  /**
   * history is a list of previous enable/disable of premod status
   */
  history: PremodStatusHistory[];
}

export interface WarningStatusHistory {
  /**
   * active when true, indicates that the given user has not acknowledged the warning.
   */
  active: boolean;
  /**
   * createdBy is the user that created this warning
   */
  createdBy: string;

  /**
   * createdAt is the time the username was created
   */
  createdAt: Date;
  /**
   * acknowledgedAt is the time the commneter acknowledged it
   */
  acknowledgedAt?: Date;

  /**
   * message is the message sent to the commenter
   */
  message?: string;
}

export interface WarningStatus {
  active: boolean;
  history: WarningStatusHistory[];
}

export interface ModMessageStatusHistory {
  /**
   * active when true, indicates that the given user has not acknowledged the message.
   */
  active: boolean;
  /**
   * createdBy is the user that created this message
   */
  createdBy: string;

  /**
   * createdAt is the time the username was created
   */
  createdAt: Date;
  /**
   * acknowledgedAt is the time the commenter acknowledged it
   */
  acknowledgedAt?: Date;

  /**
   * message is the message sent to the commenter
   */
  message?: string;
}

export interface ModMessageStatus {
  active: boolean;
  history: ModMessageStatusHistory[];
}

/**
 * UserStatus stores the user status information regarding moderation state.
 */
export interface UserStatus {
  /**
   * suspension stores the user suspension status as well as the history of
   * changes.
   */
  suspension: SuspensionStatus;

  /**
   * ban stores the user ban status as well as the history of changes.
   */
  ban: BanStatus;

  /**
   * username stores the history of username changes for this user.
   */
  username: UsernameStatus;

  /**
   * premod stores whether a user is set to mandatory premod and history of
   * premod status.
   */
  premod: PremodStatus;

  /**
   * warning stores whether a user has an unacknowledge warning and a history of
   * warnings
   */
  warning?: WarningStatus;

  /**
   * modMessage stores whether a user has an unacknowledged moderation message and
   * a history of moderation messages
   */
  modMessage?: ModMessageStatus;
}

/**
 * IgnoredUser is the entry describing a User being ignored.
 */
export interface IgnoredUser {
  /**
   * id is the ID of the User that was ignored.
   */
  id: string;

  /**
   * createdAt is the date that the User was ignored on.
   */
  createdAt: Date;
}

/**
 * Digest is the actual digest entry that is created every time a digest is
 * queued for aUser.
 */
export interface Digest {
  /**
   * template is a given digestable template that was generated during the
   * notification processing phase. This contains the context typically provided
   * to the individual notification emails that are sent.
   */
  template: DigestibleTemplate;

  /**
   * createdAt is the date that the digest entry was created at.
   */
  createdAt: Date;
}

export interface UserCommentCounts {
  status: CommentStatusCounts;
}

export interface UserModerationScopes {
  scoped: boolean;
  /**
   * siteIDs is the array of site ID's that this User can moderate. If not
   * provided the user can moderate all sites.
   */
  siteIDs?: string[];
}

export interface UserMembershipScopes {
  /**
   * scoped is whether or not the user's membership is limited to specific sites.
   */
  scoped: boolean;

  /**
   * siteIDs is the array of ID's for sites on which this user is a member.
   * If not present (and user has role of MEMBER), user is a member on all sites.
   */
  siteIDs?: string[];
}

/**
 * User is someone that leaves Comments, and logs in.
 */
export interface User extends TenantResource {
  /**
   * id is the identifier of the User.
   */
  readonly id: string;

  /**
   * username is the name of the User visible to other Users.
   */
  username?: string;

  /**
   * avatar is the url to the avatar for a specific User.
   */
  avatar?: string;

  /**
   * email is the current email address for the User.
   */
  email?: string;

  /**
   *
   * badges are user display badges
   */
  badges?: string[];

  /**
   * ssoURL is the url where a user can manage their sso account
   */
  ssoURL?: string;

  /**
   * emailVerificationID is used to store state regarding the verification state
   * of an email address to prevent replay attacks.
   */
  emailVerificationID?: string;

  /**
   * emailVerified when true indicates that the given email address has been verified.
   */
  emailVerified?: boolean;

  /**
   * duplicateEmail is used to store the email address that was associated with
   * the user account on creation that at the time was previously associated
   * with another local account.
   */
  duplicateEmail?: string;

  /**
   * profiles is the array of profiles assigned to the user. When a user deletes
   * their account, this is unset.
   */
  profiles?: Profile[];

  /**
   * tokens lists the access tokens associated with the account.
   */
  tokens: Token[];

  /**
   * role is the current role of the User.
   */
  role: GQLUSER_ROLE;

  /**
   * moderationScopes describes the scopes for moderation. These only apply when
   * the user has a MODERATOR role.
   */
  moderationScopes?: UserModerationScopes;

  /**
   * membershipScopes describes the scopes of membership. These only apply when
   * the user has a MEMBER role.
   */
  membershipScopes?: UserMembershipScopes;

  /**
   * notifications stores the notification settings for the given User.
   */
  notifications: GQLUserNotificationSettings;

  /**
   * digests stores all the notification digests on the User that are scheduled
   * to be sent out based on the User's notification preferences.
   */
  digests: Digest[];

  /**
   * hasDigests is true when there is digests to send.
   */
  hasDigests?: boolean;

  /**
   * status stores the user status information regarding moderation state.
   */
  status: UserStatus;

  /**
   * ignoredUsers stores the users that have been ignored by this User.
   */
  ignoredUsers: IgnoredUser[];

  /**
   * moderatorNotes are notes left by moderators about the User.
   */
  moderatorNotes: ModeratorNote[];

  /**
   * lastDownloadedAt is the last time the user requested to download their
   * user data.
   */
  lastDownloadedAt?: Date;

  /**
   * createdAt is the time that the User was created at.
   */
  createdAt: Date;

  /**
   * importedAt is the time that the User was imported using an import script
   */
  importedAt?: Date;
  /**
   * scheduledDeletionDate is the time that a user is scheduled to be deleted.
   * If this is null, the user has not requested for their account to be deleted.
   */
  scheduledDeletionDate?: Date;

  /**
   * deletedAt is the time that this user was deleted from our system.
   */
  deletedAt?: Date;

  /**
   * mediaSettings are optional media settings for the User.
   */
  mediaSettings?: GQLUserMediaSettings;

  commentCounts: UserCommentCounts;

  /**
   * bio is a user deifned biography
   */
  bio?: string;

  /**
   * lastSeenNotificationDate is the date of the last notification the user loaded (viewed)
   * in their notification tab.
   */
  lastSeenNotificationDate?: Date | null;

  premoderatedBecauseOfEmailAt?: Date;
}

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export interface FindOrCreateUserInput {
  id?: string;
  username?: string;
  avatar?: string;
  email?: string;
  badges?: string[];
  ssoURL?: string;
  emailVerified?: boolean;
  duplicateEmail?: string;
  role: GQLUSER_ROLE;
  profile: Profile;
}

/**
 * findOrCreateUserInput converts the FindOrCreateUserInput input into aUse.
 *
 * @param tenantID ID of the Tenant to create the user for
 * @param input the input for creating a User
 * @param now the current date
 */
export async function findOrCreateUserInput(
  tenantID: string,
  { id = uuid(), profile, email, ...input }: FindOrCreateUserInput,
  now: Date
): Promise<Readonly<User>> {
  // default are the properties set by the application when a new user is
  // created.
  const defaults: Sub<User, FindOrCreateUserInput> = {
    tenantID,
    tokens: [],
    ignoredUsers: [],
    status: {
      username: {
        history: [],
      },
      suspension: { history: [] },
      ban: { active: false, history: [] },
      premod: { active: false, history: [] },
      warning: { active: false, history: [] },
      modMessage: { active: false, history: [] },
    },
    notifications: {
      onReply: false,
      onFeatured: false,
      onModeration: false,
      onStaffReplies: false,
      digestFrequency: GQLDIGEST_FREQUENCY.NONE,
    },
    moderatorNotes: [],
    digests: [],
    createdAt: now,
    commentCounts: {
      status: createEmptyCommentStatusCounts(),
    },
  };

  if (input.username) {
    // Add the username history to the user.
    defaults.status.username.history.push({
      id: uuid(),
      username: input.username,
      createdBy: id,
      createdAt: now,
    });
  }

  // Store the user's profiles in a new array.
  const profiles: Profile[] = [];

  // Mutate the profiles to ensure we mask handle any secrets.
  if (profile.type === "local") {
    profiles.push({
      type: "local",
      // Lowercase the email address.
      id: profile.id.toLowerCase(),
      // Hash the user's password with bcrypt.
      password: await hashPassword(profile.password),
      passwordID: profile.passwordID,
    });
  } else {
    profiles.push(profile);
  }

  // Merge the defaults and the input together.
  const user: User = {
    ...defaults,
    ...input,
    profiles,
    id,
  };

  // Lowercase the email address if we have one now.
  if (email) {
    user.email = email.toLowerCase();
  }

  return user;
}

export async function findOrCreateUser(
  mongo: MongoContext,
  tenantID: string,
  input: FindOrCreateUserInput,
  now: Date
) {
  const user = await findOrCreateUserInput(tenantID, input, now);

  try {
    const result = await mongo.users().findOneAndUpdate(
      {
        tenantID,
        profiles: {
          $elemMatch: {
            id: input.profile.id,
            type: input.profile.type,
          },
        },
      },
      { $setOnInsert: user },
      {
        // True to return the original document instead of the updated document.
        // This will ensure that when an upsert operation adds a new User, it
        // should return null.
        returnOriginal: true,
        upsert: true,
      }
    );

    return {
      user: result.value || user,
      wasUpserted: !result.value,
    };
  } catch (err) {
    // Evaluate the error, if it is in regards to violating the unique index,
    // then return a duplicate User error.
    if (err instanceof MongoError && err.code === 11000) {
      // Check if duplicate index was about the email.
      if (err.errmsg && err.errmsg.includes("tenantID_1_email_1")) {
        throw new DuplicateEmailError(user.email!);
      }

      // Some other error occurred.
      throw new DuplicateUserError(err);
    }

    throw err;
  }
}

export type CreateUserInput = FindOrCreateUserInput;

export async function createUser(
  mongo: MongoContext,
  tenantID: string,
  input: CreateUserInput,
  now: Date
) {
  const user = await findOrCreateUserInput(tenantID, input, now);

  try {
    // Insert it into the database. This may throw an error.
    await mongo.users().insertOne(user);
  } catch (err) {
    // Evaluate the error, if it is in regards to violating the unique index,
    // then return a duplicate User error.
    if (err instanceof MongoError && err.code === 11000) {
      // Check if duplicate index was about the email.
      if (err.errmsg && err.errmsg.includes("tenantID_1_email_1")) {
        throw new DuplicateEmailError(user.email!);
      }

      // Some other error occured.
      throw new DuplicateUserError(err);
    }

    throw err;
  }

  return user;
}

export async function retrieveUserByUsername(
  mongo: MongoContext,
  tenantID: string,
  username: string
) {
  return mongo.users().findOne({ tenantID, username });
}

export async function retrieveUser(
  mongo: MongoContext,
  tenantID: string,
  id: string
) {
  return mongo.users().findOne({ tenantID, id });
}

export async function retrieveManyUsers(
  mongo: MongoContext,
  tenantID: string,
  ids: ReadonlyArray<string>
) {
  const cursor = mongo.users().find({
    tenantID,
    id: {
      $in: ids,
    },
  });

  const users = await cursor.toArray();

  return ids.map((id) => users.find((user) => user.id === id) || null);
}

export async function retrieveUserWithProfile(
  mongo: MongoContext,
  tenantID: string,
  profile: Partial<Pick<Profile, "id" | "type">>
) {
  return mongo.users().findOne({
    tenantID,
    profiles: {
      $elemMatch: profile,
    },
  });
}

export async function retrieveUserWithEmail(
  mongo: MongoContext,
  tenantID: string,
  emailAddress: string
) {
  const email = emailAddress.toLowerCase();

  return mongo.users().findOne({
    tenantID,
    $or: [
      {
        profiles: {
          $elemMatch: { id: email, type: "local" },
        },
      },
      { email },
    ],
  });
}

/**
 * updateUserRole updates a given User's role.
 *
 * @param mongo mongodb database to interact with
 * @param tenantID Tenant ID where the User resides
 * @param id ID of the User that we are updating
 * @param role new role to set to the User
 * @param siteIDs siteIDs are the sites to add to the roles scope
 */
export async function updateUserRole(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  role: GQLUSER_ROLE,
  scoped: boolean
) {
  const update: Partial<User> = { role };
  const scopes = { scoped };
  if (scoped) {
    if (role === GQLUSER_ROLE.MODERATOR) {
      update.moderationScopes = scopes;
    } else if (role === GQLUSER_ROLE.MEMBER) {
      update.membershipScopes = scopes;
    } else {
      throw new Error(`Site scopes may not be applied to role ${role}`);
    }
  } else {
    // This may seem odd, but is a result of us
    // storing scopes for multiple roles when a user
    // can only have a single role at a time
    update.moderationScopes = scopes;
    update.membershipScopes = scopes;
  }

  const result = await mongo.users().findOneAndUpdate(
    { id, tenantID },
    { $set: update },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    throw new UserNotFoundError(id);
  }

  return result.value;
}

export async function mergeUserSiteModerationScopes(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  siteIDs: ReadonlyArray<string>
) {
  const result = await mongo.users().findOneAndUpdate(
    { id, tenantID },
    {
      $addToSet: {
        "moderationScopes.siteIDs": { $each: siteIDs },
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    throw new UserNotFoundError(id);
  }

  return result.value;
}

export async function pullUserSiteModerationScopes(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  siteIDs: ReadonlyArray<string>
) {
  const result = await mongo.users().findOneAndUpdate(
    { id, tenantID },
    {
      $pull: {
        "moderationScopes.siteIDs": { $in: siteIDs },
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );

  if (!result.value) {
    throw new UserNotFoundError(id);
  }

  return result.value;
}

export async function mergeUserMembershipScopes(
  mongo: MongoContext,
  tenantID: string,
  userID: string,
  membershipScopes: string[]
) {
  const result = await mongo.users().findOneAndUpdate(
    {
      id: userID,
      tenantID,
    },
    {
      $addToSet: {
        "membershipScopes.siteIDs": { $each: membershipScopes },
      },
    },
    {
      returnOriginal: false,
    }
  );

  if (!result.value) {
    throw new UserNotFoundError(userID);
  }

  return result.value;
}

export async function pullUserMembershipScopes(
  mongo: MongoContext,
  tenantID: string,
  userID: string,
  membershipScopes: string[]
) {
  const result = await mongo.users().findOneAndUpdate(
    {
      id: userID,
      tenantID,
    },
    {
      $pull: {
        "membershipScopes.siteIDs": { $in: membershipScopes },
      },
    },
    {
      returnOriginal: false,
    }
  );

  if (!result.value) {
    throw new UserNotFoundError(userID);
  }

  return result.value;
}

export async function updateUserModerationScopes(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  moderationScopes: UserModerationScopes
) {
  const result = await mongo.users().findOneAndUpdate(
    { id, tenantID },
    { $set: { moderationScopes } },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    throw new UserNotFoundError(id);
  }

  return result.value;
}

export async function updateUserMembershipScopes(
  mongo: MongoContext,
  tenantID: string,
  userID: string,
  siteIDs: string[]
) {
  const result = await mongo
    .users()
    .findOneAndUpdate(
      { id: userID, tenantID },
      { $set: { membershipScopes: { siteIDs } } },
      { returnOriginal: false }
    );

  if (!result.value) {
    throw new UserNotFoundError(userID);
  }

  return result.value;
}

export async function verifyUserPassword(
  user: Pick<User, "profiles">,
  password: string,
  withEmail?: string
) {
  const profile = getLocalProfile(user, withEmail);
  if (!profile) {
    throw new LocalProfileNotSetError();
  }

  return bcrypt.compare(password, profile.password);
}

export async function updateUserPassword(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  password: string,
  passwordID: string
) {
  // Hash the password.
  const hashedPassword = await hashPassword(password);

  // Update the user with the new password.
  const result = await mongo.users().findOneAndUpdate(
    {
      tenantID,
      id,
      // This ensures that the document we're updating already has a local
      // profile associated with them.
      profiles: {
        $elemMatch: {
          type: "local",
          passwordID,
        },
      },
    },
    {
      $set: {
        // Update the passwordID with a new one.
        "profiles.$[profiles].passwordID": uuid(),
        "profiles.$[profiles].password": hashedPassword,
      },
    },
    {
      arrayFilters: [{ "profiles.type": "local" }],
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    const profile = getLocalProfile(user);
    if (!profile) {
      throw new LocalProfileNotSetError();
    }

    if (profile.passwordID !== passwordID) {
      throw new Error("passwordID mismatch");
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

export async function scheduleDeletionDate(
  mongo: MongoContext,
  tenantID: string,
  userID: string,
  deletionDate: Date
) {
  const result = await mongo.users().findOneAndUpdate(
    {
      id: userID,
      tenantID,
    },
    {
      $set: {
        scheduledDeletionDate: deletionDate,
      },
    },
    {
      returnOriginal: false,
    }
  );
  if (!result.value) {
    throw new UserNotFoundError(userID);
  }

  return result.value;
}

export async function clearDeletionDate(
  mongo: MongoContext,
  tenantID: string,
  userID: string
) {
  const result = await mongo.users().findOneAndUpdate(
    {
      id: userID,
      tenantID,
    },
    {
      $unset: {
        scheduledDeletionDate: "",
      },
    },
    {
      // We want to return edited user so that
      // we send back the cleared scheduledDeletionDate
      // to the client
      returnOriginal: false,
    }
  );
  if (!result.value) {
    throw new UserNotFoundError(userID);
  }

  return result.value;
}

export interface UpdateUserInput {
  email?: string;
  username?: string;
  badges?: string[];
  role?: GQLUSER_ROLE;
  avatar?: string;
}

export async function updateUserFromSSO(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  update: UpdateUserInput,
  lastIssuedAt: Date
) {
  // Update the user with the new properties.
  const result = await mongo.users().findOneAndUpdate(
    {
      tenantID,
      id,
      // This ensures that the document we're updating already has a sso
      // profile associated with them.
      "profiles.type": "sso",
    },
    {
      $set: {
        "profiles.$[profiles].lastIssuedAt": lastIssuedAt,
        ...update,
      },
    },
    {
      arrayFilters: [{ "profiles.type": "sso" }],
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    const user = await retrieveUserWithProfile(mongo, tenantID, {
      type: "sso",
      id,
    });
    if (!user) {
      throw new UserNotFoundError(id);
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

/**
 * setUserUsername will set the username of the User if the username hasn't
 * already been used before.
 *
 * @param mongo the database handle
 * @param tenantID the ID to the Tenant
 * @param id the ID of the User where we are setting the username on
 * @param username the username that we want to set
 */
export async function setUserUsername(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  username: string
) {
  // TODO: (wyattjoh) investigate adding the username previously used to an array.

  // The username wasn't found, so add it to the user.
  const result = await mongo.users().findOneAndUpdate(
    {
      tenantID,
      id,
      username: null,
    },
    {
      $set: {
        username,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Try to get the current user to discover what happened.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    if (user.username) {
      throw new UsernameAlreadySetError();
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

/**
 * updateUsername will set the username of the User.
 *
 * @param mongo the database handle
 * @param tenantID the ID to the Tenant
 * @param id the ID of the User where we are setting the username on
 * @param username the username that we want to set
 * @param createdBy the user making the change
 */

export async function updateUserUsername(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  username: string,
  createdBy: string,
  now = new Date()
) {
  const usernameHistory: UsernameHistory = {
    id: uuid(),
    username,
    createdBy,
    createdAt: now,
  };

  const result = await mongo.users().findOneAndUpdate(
    { id, tenantID },
    {
      $set: {
        username,
      },
      $push: {
        "status.username.history": usernameHistory,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );

  if (!result.value) {
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

/**
 * setUserEmail will set the email address of the User if they don't already
 * have one associated with them, and it hasn't been used before.
 *
 * @param mongo the database handle
 * @param tenantID the ID to the Tenant
 * @param id the ID of the User where we are setting the email address on
 * @param emailAddress the email address we want to set
 */
export async function setUserEmail(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  emailAddress: string
) {
  // Lowercase the email address.
  const email = emailAddress.toLowerCase();

  // Search to see if this email has been used before.
  let user = await mongo.users().findOne({
    tenantID,
    email,
  });
  if (user) {
    throw new DuplicateEmailError(email);
  }

  // The email wasn't found, so try to update the User.
  const result = await mongo.users().findOneAndUpdate(
    {
      tenantID,
      id,
      email: null,
    },
    {
      $set: {
        email,
      },
      $unset: {
        duplicateEmail: "",
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Try to get the current user to discover what happened.
    user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    if (user.email) {
      throw new EmailAlreadySetError();
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

/**
 * updateUserEmail will update a given User's email address to the one provided.
 *
 * @param mongo the database that we are interacting with
 * @param tenantID the Tenant ID of the Tenant where the User exists
 * @param id the User ID that we are updating
 * @param emailAddress email address that we are setting on the User
 * @param emailVerified whether email is verified
 */
export async function updateUserEmail(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  emailAddress: string,
  emailVerified = false
) {
  // Lowercase the email address.
  const email = emailAddress.toLowerCase();

  try {
    // The email wasn't found, so try to update the User.
    const result = await mongo.users().findOneAndUpdate(
      {
        tenantID,
        id,
      },
      {
        $set: {
          email,
          emailVerified,
          "profiles.$[profiles].id": email,
        },
      },
      {
        arrayFilters: [{ "profiles.type": "local" }],
        returnOriginal: false,
      }
    );
    if (!result.value) {
      // Try to get the current user to discover what happened.
      const user = await retrieveUser(mongo, tenantID, id);
      if (!user) {
        throw new UserNotFoundError(id);
      }

      throw new Error("an unexpected error occurred");
    }
    return result.value;
  } catch (err) {
    if (err instanceof MongoError && err.code === 11000) {
      throw new DuplicateEmailError(email);
    }
    throw err;
  }
}

/**
 * updateUserBio will update the bio associated with a User. If the bio
 * is not provided, it will be unset.
 *
 * @param mongo the database that we are interacting with
 * @param tenantID the Tenant ID of the Tenant where the User exists
 * @param id the User ID that we are updating
 * @param bio the string for the user bio
 */
export async function updateUserBio(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  bio?: string
) {
  // The email wasn't found, so try to update the User.
  const result = await mongo.users().findOneAndUpdate(
    {
      tenantID,
      id,
    },
    {
      // This will ensure that if the bio isn't provided, it will unset the
      // bio on the User.
      [bio ? "$set" : "$unset"]: {
        bio: bio ? bio : 1,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Try to get the current user to discover what happened.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

/**
 * updateUserAvatar will update the avatar associated with a User. If the avatar
 * is not provided, it will be unset.
 *
 * @param mongo the database that we are interacting with
 * @param tenantID the Tenant ID of the Tenant where the User exists
 * @param id the User ID that we are updating
 * @param avatar URL that the avatar exists at
 */
export async function updateUserAvatar(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  avatar?: string
) {
  // The email wasn't found, so try to update the User.
  const result = await mongo.users().findOneAndUpdate(
    {
      tenantID,
      id,
    },
    {
      // This will ensure that if the avatar isn't provided, it will unset the
      // avatar on the User.
      [avatar ? "$set" : "$unset"]: {
        avatar: avatar ? avatar : 1,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Try to get the current user to discover what happened.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

/**
 * setUserLocalProfile will set the local profile for a User if they don't
 * already have one associated with them and the profile doesn't exist on any
 * other User already.
 *
 * @param mongo the database handle
 * @param tenantID the ID to the Tenant
 * @param id the ID of the User where we are setting the local profile on
 * @param emailAddress the email address we want to set
 * @param password the password we want to set
 */
export async function setUserLocalProfile(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  emailAddress: string,
  password: string
) {
  // Lowercase the email address.
  const email = emailAddress.toLowerCase();

  // Try to see if this local profile already exists on a User.
  let user = await retrieveUserWithProfile(mongo, tenantID, {
    type: "local",
    id: email,
  });
  if (user) {
    throw new DuplicateEmailError(email);
  }

  // Hash the password.
  const hashedPassword = await hashPassword(password);

  // Create the profile that we'll use.
  const profile: LocalProfile = {
    type: "local",
    id: email,
    password: hashedPassword,
    passwordID: uuid(),
  };

  // The profile wasn't found, so add it to the User.
  const result = await mongo.users().findOneAndUpdate(
    {
      tenantID,
      id,
      // This ensures that the document we're updating does not contain a local
      // profile.
      "profiles.type": { $ne: "local" },
    },
    {
      $push: {
        profiles: profile,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Try to get the current user to discover what happened.
    user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // Check to see if the user has any local profile (not just a local profile
    // with a specific email).
    if (hasLocalProfile(user)) {
      throw new LocalProfileAlreadySetError();
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

export async function createUserToken(
  mongo: MongoContext,
  tenantID: string,
  userID: string,
  name: string,
  now = new Date()
) {
  // Create the Token that we'll be adding to the User.
  const token: Readonly<Token> = {
    id: uuid(),
    name,
    createdAt: now,
  };

  const result = await mongo.users().findOneAndUpdate(
    {
      id: userID,
      tenantID,
    },
    {
      $push: { tokens: token },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    throw new UserNotFoundError(userID);
  }

  return {
    user: result.value,
    token,
  };
}

export async function updateUserSSOProfileID(
  mongo: MongoContext,
  tenantID: string,
  userID: string,
  ssoProfileID: string
) {
  const result = await mongo.users().findOneAndUpdate(
    {
      id: userID,
      tenantID,
      // This ensures that the document we're updating already has an sso
      // profile associated with them.
      "profiles.type": "sso",
    },
    {
      $set: {
        "profiles.$[profiles].id": ssoProfileID,
      },
    },
    {
      arrayFilters: [{ "profiles.type": "sso" }],
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );

  if (!result.value) {
    const user = await retrieveUser(mongo, tenantID, userID);
    if (!user) {
      throw new UserNotFoundError(userID);
    }

    const ssoProfile = getSSOProfile(user);
    if (!ssoProfile) {
      throw new SSOProfileNotSetError();
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

export async function deactivateUserToken(
  mongo: MongoContext,
  tenantID: string,
  userID: string,
  id: string
) {
  // Try to remove the Token from the User.
  const result = await mongo.users().findOneAndUpdate(
    {
      id: userID,
      tenantID,
      "tokens.id": id,
    },
    {
      $pull: { tokens: { id } },
    },
    {
      // True to return the original document instead of the updated
      // document.
      returnOriginal: true,
    }
  );
  if (!result.value) {
    const user = await retrieveUser(mongo, tenantID, userID);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // Check to see if the User had that Token in the first place.
    if (!user.tokens.find((t) => t.id === id)) {
      throw new TokenNotFoundError();
    }

    throw new Error("an unexpected error occurred");
  }

  // We have to typecast here because we know at this point that the record does
  // contain the Token.
  const token: Token = result.value.tokens.find((t) => t.id === id) as Token;

  // Mutate the user in order to remove the Token from the list of Token's.
  const updatedUser: Readonly<User> = {
    ...result.value,
    tokens: result.value.tokens.filter((t) => t.id !== id),
  };

  return {
    user: updatedUser,
    token,
  };
}

export type UserConnectionInput = ConnectionInput<User>;

export async function retrieveUserConnection(
  mongo: MongoContext,
  tenantID: string,
  input: UserConnectionInput
): Promise<Readonly<Connection<Readonly<User>>>> {
  // Create the query.
  const query = new Query(mongo.users()).where({ tenantID });

  // If a filter is being applied, filter it as well.
  if (input.filter) {
    query.where(input.filter);
  }

  return retrieveConnection(input, query);
}

async function retrieveConnection(
  input: UserConnectionInput,
  query: Query<User>
): Promise<Readonly<Connection<Readonly<User>>>> {
  // Apply the pagination arguments to the query.
  query.orderBy({ createdAt: -1 });
  if (input.after) {
    query.where({ createdAt: { $lt: input.after as Date } });
  }

  // Return a connection.
  return resolveConnection(query, input, (user) => user.createdAt);
}

export enum PremodUserReason {
  None = 0,
  EmailPremodFilter,
}

/**
 * premodUser will set a user to mandatory premod.
 *
 * @param mongo the mongo database handle
 * @param tenantID the Tenant's ID where the User exists
 * @param id the ID of the user being banned
 * @param createdBy the ID of the user premodding
 * @param now the current date
 */
export async function premodUser(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  createdBy?: string,
  now = new Date(),
  reason = PremodUserReason.None
) {
  // Create the new ban.
  const premodStatusHistory: PremodStatusHistory = {
    active: true,
    createdBy,
    createdAt: now,
  };

  const set: any = {
    "status.premod.active": true,
  };

  if (reason === PremodUserReason.EmailPremodFilter) {
    set.premoderatedBecauseOfEmailAt = now;
  }

  // Try to update the user if the user isn't already banned.
  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
      "status.premod.active": {
        $ne: true,
      },
    },
    {
      $set: set,
      $push: {
        "status.premod.history": premodStatusHistory,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Get the user so we can figure out why the ban operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // Check to see if the user is already banned.
    const premod = consolidateUserPremodStatus(user.status.premod);
    if (premod.active) {
      throw new UserAlreadyPremoderated();
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

/**
 * removeUserPremod will lift a user premod  requirement
 *
 * @param mongo the mongo database handle
 * @param tenantID the Tenant's ID where the User exists
 * @param id the ID of the user having their ban lifted
 * @param createdBy the ID of the user lifting the premod
 * @param now the current date
 */
export async function removeUserPremod(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  createdBy: string,
  now = new Date()
) {
  // Create the new ban.
  const premod: PremodStatusHistory = {
    active: false,
    createdBy,
    createdAt: now,
  };

  // Try to update the user if the user isn't already banned.
  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
      "status.premod.active": true,
    },
    {
      $set: {
        "status.premod.active": false,
      },
      $push: {
        "status.premod.history": premod,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );

  if (!result.value) {
    // Get the user so we can figure out why the ban operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // The user wasn't banned already, so nothing needs to be done!
    return user;
  }

  return result.value;
}

export async function siteBanUser(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  createdBy: string,
  message?: string,
  siteIDs?: string[],
  now = new Date()
) {
  const banHistory: BanStatusHistory = {
    id: uuid(),
    active: true,
    createdBy,
    createdAt: now,
    message,
    siteIDs,
  };

  // Try to update the user if the user isn't already banned.
  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
    },
    {
      $push: {
        "status.ban.history": banHistory,
      },
      $addToSet: {
        "status.ban.siteIDs": { $each: siteIDs },
      },
      $set: {
        "status.ban.active": false,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );

  if (!result.value) {
    // Get the user so we can figure out why the ban operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

/**
 * banUser will ban a specific user from interacting with the site.
 *
 * @param mongo the mongo database handle
 * @param tenantID the Tenant's ID where the User exists
 * @param id the ID of the user being banned
 * @param createdBy the ID of the user banning the above mentioned user
 * @param message message to banned user
 * @param now the current date
 */
export async function banUser(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  createdBy?: string,
  message?: string,
  now = new Date()
) {
  // Create the new ban.
  const banHistory: BanStatusHistory = {
    id: uuid(),
    active: true,
    createdBy,
    createdAt: now,
    message,
    siteIDs: [],
  };

  // Try to update the user if the user isn't already banned.
  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
    },
    {
      $set: {
        "status.ban.active": true,
        "status.ban.siteIDs": [],
      },
      $push: {
        "status.ban.history": banHistory,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Get the user so we can figure out why the ban operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

export async function removeUserSiteBan(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  createdBy: string,
  now = new Date(),
  siteIDs?: string[]
) {
  // Create the new ban.
  const ban: BanStatusHistory = {
    id: uuid(),
    active: false,
    createdBy,
    createdAt: now,
    siteIDs,
  };

  // Try to update the user if the user isn't already banned.
  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
    },
    {
      $push: {
        "status.ban.history": ban,
      },
      $pull: {
        "status.ban.siteIDs": { $in: siteIDs },
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );

  if (!result.value) {
    // Get the user so we can figure out why the ban operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // The user wasn't banned already, so nothing needs to be done!
    return user;
  }

  return result.value;
}

/**
 * removeUserBan will lift a user ban from a User allowing them to interact with
 * the site again.
 *
 * @param mongo the mongo database handle
 * @param tenantID the Tenant's ID where the User exists
 * @param id the ID of the user having their ban lifted
 * @param createdBy the ID of the user lifting the ban
 * @param now the current date
 */
export async function removeUserBan(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  createdBy: string,
  now = new Date(),
  siteIDs?: string[]
) {
  // Create the new ban.
  const ban: BanStatusHistory = {
    id: uuid(),
    active: false,
    createdBy,
    createdAt: now,
    siteIDs,
  };

  // Try to update the user if the user isn't already banned.
  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
      $or: [
        {
          "status.ban.active": {
            $ne: false,
          },
        },
        {
          "status.ban.history": {
            $size: 0,
          },
        },
      ],
    },
    {
      $set: {
        "status.ban.active": false,
        "status.ban.siteIDs": [],
      },
      $push: {
        "status.ban.history": ban,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Get the user so we can figure out why the ban operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // The user wasn't banned already, so nothing needs to be done!
    return user;
  }

  return result.value;
}

/**
 * suspendUser will suspend a user for a specific time range from interacting
 * with the site.
 *
 * @param mongo the mongo database handle
 * @param tenantID the Tenant's ID where the User exists
 * @param id the ID of the user being suspended
 * @param createdBy the ID of the user banning the above mentioned user
 * @param finish the date the suspension ends
 * @param message the message sent to suspended user in email
 * @param now the current date
 */
export async function suspendUser(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  createdBy: string,
  finish: Date,
  message: string,
  now = new Date()
) {
  // Create the new suspension.
  const suspension: SuspensionStatusHistory = {
    id: uuid(),
    from: {
      start: now,
      finish,
    },
    createdBy,
    createdAt: now,
    message,
  };

  // Try to update the user if the user isn't already suspended.
  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
      "status.suspension.history": {
        $not: {
          $elemMatch: {
            "from.start": {
              $lte: now,
            },
            "from.finish": {
              $gt: now,
            },
          },
        },
      },
    },
    {
      $push: {
        "status.suspension.history": suspension,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Get the user so we can figure out why the suspend operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // Check to see if the user is already suspended.
    const suspended = consolidateUserSuspensionStatus(
      user.status.suspension,
      now
    );
    if (suspended.active && suspended.until) {
      throw new UserAlreadySuspendedError(suspended.until);
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

/**
 * removeUserSuspensions will lift any active suspensions.
 *
 * @param mongo the mongo database handle
 * @param tenantID the Tenant's ID where the User exists
 * @param id the ID of the User having their suspension lifted
 * @param modifiedBy the ID of the User lifting the suspension
 * @param now the current date
 */
export async function removeActiveUserSuspensions(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  modifiedBy: string,
  now = new Date()
) {
  // Prepare the update payload.
  const update: DeepPartial<SuspensionStatusHistory> = {
    from: {
      finish: now,
    },
    modifiedAt: now,
    modifiedBy,
  };

  // Try to update the user suspension times.
  const result = await mongo.users().findOneAndUpdate(
    { tenantID, id },
    {
      $set: dotize({
        "status.suspension.history.$[active]": update,
      }),
    },
    {
      arrayFilters: [
        // Change the finish date on all suspension records that indicate their
        // active time within our current range.
        {
          "active.from.start": { $lte: now },
          "active.from.finish": { $gt: now },
        },
      ],
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Get the user so we can figure out why the suspend operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // The user wasn't already suspended, so nothing needs to be done!
    return user;
  }

  logger.debug({ result }, "finished update operation");

  return result.value;
}

export async function warnUser(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  createdBy: string,
  message?: string,
  now = new Date()
) {
  // Create the new warning.
  const warningHistory: WarningStatusHistory = {
    active: true,
    createdBy,
    createdAt: now,
    message,
  };
  // Try to update the user if the user isn't already warned.
  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
      "status.warning.active": {
        $ne: true,
      },
    },
    {
      $set: {
        "status.warning.active": true,
      },
      $push: {
        "status.warning.history": warningHistory,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Get the user so we can figure out why the ban operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // Check to see if the user is already warned.
    const warning = consolidateUserWarningStatus(user.status.warning);
    if (warning && warning.active) {
      throw new Error("User already warned");
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

/**
 * removeUserWarning will remove a warning from a User allowing them to interact with
 * the site again.
 *
 * @param mongo the mongo database handle
 * @param tenantID the Tenant's ID where the User exists
 * @param id the ID of the user having their warning removed
 * @param modifiedBy the ID of the user removing the warning
 * @param now the current date
 */
export async function removeUserWarning(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  createdBy: string,
  now = new Date()
) {
  // Create the new history entry.
  const update: WarningStatusHistory = {
    active: false,
    createdBy,
    createdAt: now,
  };

  // Try to update the user if the user isn't already warned.
  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
      $or: [
        {
          "status.warning.active": {
            $ne: false,
          },
        },
        {
          "status.warning.history": {
            $size: 0,
          },
        },
      ],
    },
    {
      $set: {
        "status.warning.active": false,
      },
      $push: {
        "status.warning.history": update,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Get the user so we can figure out why the warn operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // The user wasn't warned already, so nothing needs to be done
    return user;
  }

  return result.value;
}

/**
 * acknowledgeWarning will remove a warning from a User allowing them to interact with
 * the site again.
 *
 * @param mongo the mongo database handle
 * @param tenantID the Tenant's ID where the User exists
 * @param id the ID of the user having their warning removed
 * @param now the current date
 */
export async function acknowledgeOwnWarning(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  now = new Date()
) {
  // Create the new update.
  const update: WarningStatusHistory = {
    active: false,
    acknowledgedAt: now,
    createdAt: now,
    createdBy: id,
  };

  // Try to update the user if the user isn't already warned.
  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
      "status.warning.active": {
        $eq: true,
      },
    },
    {
      $set: {
        "status.warning.active": false,
      },
      $push: {
        "status.warning.history": update,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Get the user so we can figure out why the warn operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // The user wasn't warned already, so nothing needs to be done!
    return user;
  }

  return result.value;
}

export async function sendModMessageUser(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  createdBy: string,
  message?: string,
  now = new Date()
) {
  // Create the new message.
  const modMessageHistory: ModMessageStatusHistory = {
    active: true,
    createdBy,
    createdAt: now,
    message,
  };

  // Try to update the user with the message.
  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
    },
    {
      $set: {
        "status.modMessage.active": true,
      },
      $push: {
        "status.modMessage.history": modMessageHistory,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );

  if (!result.value) {
    // Get the user so we can figure out why the message operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

/**
 * acknowledgeOwnModMessage will acknowledge a moderation message that was
 * sent to the user.
 *
 * @param mongo the mongo database handle
 * @param tenantID the Tenant's ID where the User exists
 * @param id the ID of the user having their warning removed
 * @param now the current date
 */
export async function acknowledgeOwnModMessage(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  now = new Date()
) {
  // Create the new update.
  const update: ModMessageStatusHistory = {
    active: false,
    acknowledgedAt: now,
    createdAt: now,
    createdBy: id,
  };

  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
      "status.modMessage.active": {
        $eq: true,
      },
    },
    {
      $set: {
        "status.modMessage.active": false,
      },
      $push: {
        "status.modMessage.history": update,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Get the user so we can figure out why the acknowledge mod message operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // The user didn't have a mod message to acknowledge, so nothing needs to be done
    return user;
  }

  return result.value;
}

export type ConsolidatedBanStatus = Omit<GQLBanStatus, "history" | "sites"> &
  Pick<BanStatus, "history"> & { siteIDs?: string[] };

export type ConsolidatedUsernameStatus = Omit<GQLUsernameStatus, "history"> &
  Pick<UsernameStatus, "history">;

export type ConsolidatedPremodStatus = Omit<GQLPremodStatus, "history"> &
  Pick<PremodStatus, "history">;

export type ConsolidatedWarningStatus = Omit<GQLWarningStatus, "history"> &
  Pick<PremodStatus, "history">;

export type ConsolidatedModMessageStatus = Omit<
  GQLModMessageStatus,
  "history"
> &
  Pick<ModMessageStatus, "history">;

export function consolidateUsernameStatus(
  username: User["status"]["username"]
) {
  return username;
}

const computeBanActive = (ban: BanStatus, siteID?: string) => {
  if (ban.active) {
    return true;
  }

  if (siteID && ban.siteIDs?.includes(siteID)) {
    return true;
  }

  return false;
};

export function consolidateUserBanStatus(
  ban: User["status"]["ban"],
  siteID?: string
) {
  return {
    ...ban,
    active: computeBanActive(ban, siteID),
  };
}

export function consolidateUserPremodStatus(premod: User["status"]["premod"]) {
  return premod;
}

export function consolidateUserWarningStatus(
  warning: User["status"]["warning"]
) {
  if (!warning) {
    return {
      active: false,
      history: [],
    };
  }
  const activeWarning = warning.history[warning.history.length - 1];
  return {
    active: warning.active,
    history: warning.history,
    message: activeWarning ? activeWarning.message : undefined,
  };
}

/**
 * consolidateUserModMessageStatus takes the most recent moderation message if there is one
 * and adds its message to the modMessage status
 */
export function consolidateUserModMessageStatus(
  modMessage: User["status"]["modMessage"]
) {
  if (!modMessage) {
    return {
      active: false,
      history: [],
    };
  }
  const activeModMessage = modMessage.history[modMessage.history.length - 1];
  return {
    active: modMessage.active,
    history: modMessage.history,
    message: activeModMessage ? activeModMessage.message : undefined,
  };
}

export type ConsolidatedSuspensionStatus = Omit<
  GQLSuspensionStatus,
  "history"
> &
  Pick<SuspensionStatus, "history">;

export function consolidateUserSuspensionStatus(
  suspension: User["status"]["suspension"],
  now = new Date()
): ConsolidatedSuspensionStatus {
  return suspension.history.reduce(
    (status: ConsolidatedSuspensionStatus, history) => {
      // Check to see if we're currently suspended.
      if (history.from.start <= now && history.from.finish > now) {
        status.active = true;

        // Ensure that we have the furthest suspension finish time.
        if (!status.until || status.until < history.from.finish) {
          status.until = history.from.finish;
        }
      }

      return status;
    },
    {
      active: false,
      history: suspension.history,
    }
  );
}

export interface ConsolidatedUserStatus {
  suspension: ConsolidatedSuspensionStatus;
  ban: ConsolidatedBanStatus;
  premod: ConsolidatedPremodStatus;
  warning: ConsolidatedWarningStatus;
}

export function consolidateUserStatus(
  status: User["status"],
  now = new Date(),
  siteID?: string
): ConsolidatedUserStatus {
  return {
    suspension: consolidateUserSuspensionStatus(status.suspension, now),
    ban: consolidateUserBanStatus(status.ban, siteID),
    premod: consolidateUserPremodStatus(status.premod),
    warning: consolidateUserWarningStatus(status.warning),
  };
}

/**
 * createOrRetrieveUserPasswordResetID will create/retrieve a password reset ID
 * on the User.
 *
 * @param mongo MongoDB instance to interact with
 * @param tenantID Tenant ID that the User exists on
 * @param id ID of the User that we are creating a reset ID with
 */
export async function createOrRetrieveUserPasswordResetID(
  mongo: MongoContext,
  tenantID: string,
  id: string
): Promise<string> {
  // Create the ID.
  const resetID = uuid();

  // Associate the resetID with the user.
  const result = await mongo.users().findOneAndUpdate(
    {
      tenantID,
      id,
      // This ensures that the document we're updating already has a local
      // profile associated with them and also doesn't have a resetID.
      profiles: {
        $elemMatch: {
          type: "local",
          resetID: null,
        },
      },
    },
    {
      $set: {
        "profiles.$[profiles].resetID": resetID,
      },
    },
    {
      arrayFilters: [{ "profiles.type": "local" }],
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    const localProfile = getLocalProfile(user);
    if (!localProfile) {
      throw new LocalProfileNotSetError();
    }

    if (localProfile.resetID) {
      return localProfile.resetID;
    }

    throw new Error("an unexpected error occurred");
  }

  return resetID;
}

export async function createOrRetrieveUserEmailVerificationID(
  mongo: MongoContext,
  tenantID: string,
  id: string
): Promise<string> {
  // Create the ID.
  const emailVerificationID = uuid();

  // Associate the resetID with the user.
  const result = await mongo.users().findOneAndUpdate(
    {
      tenantID,
      id,
      // This ensures that we don't set a emailVerificationID when there is one
      // already.
      emailVerificationID: null,
      $or: [{ emailVerified: false }, { emailVerified: null }],
    },
    {
      $set: {
        emailVerificationID,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    if (user.emailVerified) {
      throw new Error("email address has already been verified");
    }

    if (user.emailVerificationID) {
      return user.emailVerificationID;
    }

    throw new Error("an unexpected error occurred");
  }

  return emailVerificationID;
}

export async function resetUserPassword(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  password: string,
  passwordID: string,
  resetID: string
) {
  // Hash the password.
  const hashedPassword = await hashPassword(password);

  // Update the user with the new password.
  const result = await mongo.users().findOneAndUpdate(
    {
      tenantID,
      id,
      // This ensures that the document we're updating already has a local
      // profile associated with them and also matches the resetID specified.
      profiles: {
        $elemMatch: {
          type: "local",
          passwordID,
          resetID,
        },
      },
    },
    {
      $set: {
        // Update the passwordID with a new one.
        "profiles.$[profiles].passwordID": uuid(),
        "profiles.$[profiles].password": hashedPassword,
      },
      $unset: {
        "profiles.$[profiles].resetID": "",
      },
    },
    {
      arrayFilters: [{ "profiles.type": "local", "profiles.resetID": resetID }],
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    const profile = getLocalProfile(user);
    if (!profile) {
      throw new LocalProfileNotSetError();
    }

    if (profile.resetID !== resetID) {
      throw new PasswordResetTokenExpired("reset id mismatch");
    }

    if (profile.passwordID !== passwordID) {
      throw new PasswordResetTokenExpired("password id mismatch");
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

export async function confirmUserEmail(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  email: string,
  emailVerificationID: string
) {
  // Update the user with a confirmed email address.
  const result = await mongo.users().findOneAndUpdate(
    {
      tenantID,
      id,
      email,
      emailVerificationID,
    },
    {
      $set: {
        emailVerified: true,
      },
      $unset: {
        emailVerificationID: "",
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    if (user.email !== email) {
      throw new ConfirmEmailTokenExpired("email mismatch");
    }

    if (user.emailVerificationID !== emailVerificationID) {
      throw new ConfirmEmailTokenExpired("email verification id mismatch");
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

export async function ignoreUser(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  ignoreUserID: string,
  now = new Date()
) {
  const ignoredUser: IgnoredUser = {
    id: ignoreUserID,
    createdAt: now,
  };

  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
      ignoredUsers: {
        $not: {
          $eq: {
            id: ignoreUserID,
          },
        },
      },
    },
    {
      $push: { ignoredUsers: ignoredUser },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Get the user so we can figure out why the ignore operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // TODO: extract function
    if (
      user.ignoredUsers &&
      user.ignoredUsers.some((u) => u.id === ignoreUserID)
    ) {
      // TODO: improve error
      throw new Error("user already ignored");
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

export async function removeUserIgnore(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  ignoreUserID: string
) {
  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
      "ignoredUsers.id": ignoreUserID,
    },
    {
      $pull: { ignoredUsers: { id: ignoreUserID } },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Get the user so we can figure out why the ignore operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    // TODO: extract function
    if (
      user.ignoredUsers &&
      user.ignoredUsers.every((u) => u.id !== ignoreUserID)
    ) {
      // TODO: improve error
      throw new Error("user already not ignored");
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

export async function setUserLastDownloadedAt(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  now: Date
) {
  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
    },
    {
      $set: { lastDownloadedAt: now },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Get the user so we can figure out why the ignore operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

export type NotificationSettingsInput = Partial<GQLUserNotificationSettings>;

export async function updateUserNotificationSettings(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  notifications: NotificationSettingsInput
) {
  const update: DeepPartial<User> = { notifications };

  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
    },
    { $set: dotize(update) },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Get the user so we can figure out why the update operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

export type UpdateUserMediaSettingsInput = Partial<GQLUserMediaSettings>;

export async function updateUserMediaSettings(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  mediaSettings: UpdateUserMediaSettingsInput
) {
  const update: DeepPartial<User> = { mediaSettings };

  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
    },
    { $set: dotize(update) },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Get the user so we can figure out why the update operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

/**
 * insertUserNotificationDigests will push the notification contexts onto the
 * User so that notifications can now be queued.
 *
 * @param mongo the database to put the notification digests into
 * @param tenantID the ID of the Tenant that this User exists on
 * @param id the ID of the User to insert the digests onto
 * @param templates the templates that represent the digests to be inserted
 * @param now the current time
 */
export async function insertUserNotificationDigests(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  templates: DigestibleTemplate[],
  now: Date
) {
  // Form the templates into digests to be sent.
  const digests: Digest[] = templates.map((template) => ({
    template,
    createdAt: now,
  }));

  const result = await mongo.users().findOneAndUpdate(
    {
      id,
      tenantID,
    },
    {
      $push: {
        digests: { $each: digests },
      },
      $set: {
        hasDigests: true,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    // Get the user so we can figure out why the update operation failed.
    const user = await retrieveUser(mongo, tenantID, id);
    if (!user) {
      throw new UserNotFoundError(id);
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

/**
 * pullUserNotificationDigests will pull notification digests for a given User
 * so it can be added to the mailer queue.
 *
 * @param mongo the database to pull digests from
 * @param tenantID the tenant ID to pull digests for
 * @param frequency the frequency that we're scanning for to limit the digest
 *                  operation
 */
export async function pullUserNotificationDigests(
  mongo: MongoContext,
  tenantID: string,
  frequency: GQLDIGEST_FREQUENCY
) {
  const result = await mongo.users().findOneAndUpdate(
    {
      tenantID,
      "notifications.digestFrequency": frequency,
      hasDigests: true,
    },
    { $set: { digests: [], hasDigests: false } },
    {
      // True to return the original document instead of the updated document.
      returnOriginal: true,
    }
  );

  return result.value || null;
}

/**
 * retrieveUserScheduledForDeletion will return a user that is scheduled for
 * deletion as well as create a reschedule date in the future.
 *
 * @param mongo the database to pull scheduled users to delete from
 * @param tenantID the tenant ID to pull users that have been scheduled for
 * deletion on
 * @param rescheduledDuration duration in which to reschedule
 * @param now the current time
 */
export async function retrieveLockedUserScheduledForDeletion(
  mongo: MongoContext,
  tenantID: string,
  rescheduledDuration: DurationObject,
  now: Date
) {
  const rescheduledDeletionDate = DateTime.fromJSDate(now)
    .plus(rescheduledDuration)
    .toJSDate();

  const result = await mongo.users().findOneAndUpdate(
    {
      tenantID,
      scheduledDeletionDate: { $lte: now },
      deletedAt: { $exists: false },
    },
    {
      $set: {
        scheduledDeletionDate: rescheduledDeletionDate,
      },
    },
    {
      // We want to get back the user with
      // modified scheduledDeletionDate
      returnOriginal: false,
    }
  );

  return result.value || null;
}

/**
 * createModeratorNote will add a note to a users account
 *
 * @param mongo the database to put the notification digests into
 * @param tenantID the ID of the Tenant that this User exists on
 * @param id the ID of the User who is the subject of the note
 * @param createdBy the ID of Moderator that is creating the note
 * @param note the contents of the note
 * @param now the current time that the note was created
 */
export async function createModeratorNote(
  mongo: MongoContext,
  tenantID: string,
  id: string,
  createdBy: string,
  note: string,
  now = new Date()
) {
  const moderatorNote: ModeratorNote = {
    id: uuid(),
    createdAt: now,
    body: note,
    createdBy,
  };
  const result = await mongo.users().findOneAndUpdate(
    { id, tenantID },
    {
      $push: {
        moderatorNotes: moderatorNote,
      },
    },
    {
      // False to return the updated document instead of the original
      // document.
      returnOriginal: false,
    }
  );
  if (!result.value) {
    throw new UserNotFoundError(id);
  }

  return result.value;
}

/**
 * deleteModeratorNote will remove a note from a user profile
 *
 * @param mongo the database to put the notification digests into
 * @param tenantID the ID of the Tenant that this User exists on
 * @param userID the ID of the user
 * @param id the ID of the note to delete
 * @param createdBy the ID of the note author
 */
export async function deleteModeratorNote(
  mongo: MongoContext,
  tenantID: string,
  userID: string,
  id: string,
  createdBy: string
) {
  const result = await mongo.users().findOneAndUpdate(
    {
      id: userID,
      tenantID,
    },
    {
      $pull: {
        moderatorNotes: { id, createdBy },
      },
    },
    {
      returnOriginal: false,
    }
  );
  if (!result.value) {
    throw new UserNotFoundError(id);
  }
  return result.value;
}

export async function linkUsers(
  mongo: MongoContext,
  tenantID: string,
  sourceUserID: string,
  destinationUserID: string
) {
  // Delete the old user from the database.
  const source = await mongo.users().findOneAndDelete({
    id: sourceUserID,
    tenantID,
  });
  if (!source.value) {
    throw new UserNotFoundError(sourceUserID);
  }

  // If the source user doesn't have any profiles, we have nothing to do. We
  // should abort.
  if (!source.value.profiles) {
    throw new Error(
      "cannot link a user with no profiles, failed source authentication precondition"
    );
  }

  // Add the new profile to the destination user.
  const dest = await mongo.users().findOneAndUpdate(
    {
      id: destinationUserID,
      tenantID,
    },
    {
      $push: {
        profiles: {
          $each: source.value.profiles,
        },
      },
    }
  );
  if (!dest.value) {
    throw new UserNotFoundError(destinationUserID);
  }

  return dest.value;
}

export const updateUserCommentCounts = (
  mongo: MongoContext,
  tenantID: string,
  id: string,
  commentCounts: DeepPartial<UserCommentCounts>
) => updateRelatedCommentCounts(mongo.users(), tenantID, id, commentCounts);
