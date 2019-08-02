import bcrypt from "bcryptjs";
import { Db, MongoError } from "mongodb";
import uuid from "uuid";

import { DeepPartial, Omit, Sub } from "coral-common/types";
import { dotize } from "coral-common/utils/dotize";
import {
  ConfirmEmailTokenExpired,
  DuplicateEmailError,
  DuplicateUserError,
  LocalProfileAlreadySetError,
  LocalProfileNotSetError,
  PasswordResetTokenExpired,
  TokenNotFoundError,
  UserAlreadyBannedError,
  UserAlreadySuspendedError,
  UsernameAlreadySetError,
  UserNotFoundError,
} from "coral-server/errors";
import {
  GQLBanStatus,
  GQLSuspensionStatus,
  GQLTimeRange,
  GQLUSER_ROLE,
} from "coral-server/graph/tenant/schema/__generated__/types";
import logger from "coral-server/logger";
import {
  Connection,
  ConnectionInput,
  resolveConnection,
} from "coral-server/models/helpers/connection";
import {
  createConnectionOrderVariants,
  createIndexFactory,
} from "coral-server/models/helpers/indexing";
import Query from "coral-server/models/helpers/query";
import { TenantResource } from "coral-server/models/tenant";

import { getLocalProfile, hasLocalProfile } from "./helpers";

function collection(mongo: Db) {
  return mongo.collection<Readonly<User>>("users");
}

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
  lastIssuedAt: Date;
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

  message?: string;
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
}

/**
 * BanStatus contains information about a ban for a given User.
 */
export interface BanStatus {
  /**
   * active when true, indicates that the given user is banned.
   */
  active: boolean;

  /**
   * history is the list of all ban events against a specific User.
   */
  history: BanStatusHistory[];
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
   * emailVerificationID is used to store state regarding the verification state
   * of an email address to prevent replay attacks.
   */
  emailVerificationID?: string;

  /**
   * emailVerified when true indicates that the given email address has been verified.
   */
  emailVerified?: boolean;

  /**
   * profiles is the array of profiles assigned to the user.
   */
  profiles: Profile[];

  /**
   * tokens lists the access tokens associated with the account.
   */
  tokens: Token[];

  /**
   * role is the current role of the User.
   */
  role: GQLUSER_ROLE;

  /**
   * status stores the user status information regarding moderation state.
   */
  status: UserStatus;

  /**
   * ignoredUsers stores the users that have been ignored by this User.
   */
  ignoredUsers: IgnoredUser[];

  /**
   * createdAt is the time that the User was created at.
   */
  createdAt: Date;
}

export async function createUserIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collection(mongo));

  // UNIQUE { id }
  await createIndex({ tenantID: 1, id: 1 }, { unique: true });

  // UNIQUE - PARTIAL { email }
  await createIndex(
    { tenantID: 1, email: 1 },
    { unique: true, partialFilterExpression: { email: { $exists: true } } }
  );

  // UNIQUE { profiles.type, profiles.id }
  await createIndex(
    { tenantID: 1, "profiles.type": 1, "profiles.id": 1 },
    {
      unique: true,
      partialFilterExpression: { "profiles.id": { $exists: true } },
    }
  );

  // { profiles }
  await createIndex(
    { tenantID: 1, profiles: 1, email: 1 },
    {
      partialFilterExpression: { profiles: { $exists: true } },
      background: true,
    }
  );

  // TEXT { id, username, email, createdAt }
  await createIndex(
    {
      tenantID: 1,
      id: "text",
      username: "text",
      email: "text",
      createdAt: -1,
    },
    { background: true }
  );

  const variants = createConnectionOrderVariants<Readonly<User>>(
    [{ createdAt: -1 }],
    { background: true }
  );

  // User Connection pagination.
  // { ...connectionParams }
  await variants(createIndex, {
    tenantID: 1,
  });

  // Role based User Connection pagination.
  // { role, ...connectionParams }
  await variants(createIndex, {
    tenantID: 1,
    role: 1,
  });

  // Suspension based User Connection pagination.
  await variants(createIndex, {
    tenantID: 1,
    "status.suspension.history.from.start": 1,
    "status.suspension.history.from.finish": 1,
  });

  // Ban based User Connection pagination.
  await variants(createIndex, {
    tenantID: 1,
    "status.ban.active": 1,
  });
}

function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export type InsertUserInput = Omit<
  User,
  | "id"
  | "tenantID"
  | "tokens"
  | "status"
  | "ignoredUsers"
  | "emailVerificationID"
  | "createdAt"
> &
  Partial<Pick<User, "id">>;

export async function insertUser(
  mongo: Db,
  tenantID: string,
  { id = uuid.v4(), ...input }: InsertUserInput,
  now = new Date()
) {
  // default are the properties set by the application when a new user is
  // created.
  const defaults: Sub<User, InsertUserInput> = {
    tenantID,
    tokens: [],
    ignoredUsers: [],
    status: {
      suspension: { history: [] },
      ban: { active: false, history: [] },
    },
    createdAt: now,
  };

  // Guard against empty login profiles (they need some way to login).
  if (input.profiles.length === 0) {
    throw new Error("users require at least one profile");
  }

  // Mutate the profiles to ensure we mask handle any secrets.
  const profiles: Profile[] = [];
  for (let profile of input.profiles) {
    switch (profile.type) {
      case "local":
        // Hash the user's password with bcrypt.
        const password = await hashPassword(profile.password);
        profile = {
          ...profile,
          password,
        };
        break;
    }
    // Save a copy.
    profiles.push(profile);
  }

  // Merge the defaults and the input together.
  const user: Readonly<User> = {
    ...defaults,
    ...input,
    id,
    profiles,
  };

  try {
    // Insert it into the database. This may throw an error.
    await collection(mongo).insert(user);
  } catch (err) {
    // Evaluate the error, if it is in regards to violating the unique index,
    // then return a duplicate Story error.
    if (err instanceof MongoError && err.code === 11000) {
      // Check if duplicate index was about the email.
      if (err.errmsg && err.errmsg.includes("tenantID_1_email_1")) {
        throw new DuplicateEmailError(input.email!);
      }
      throw new DuplicateUserError();
    }

    throw err;
  }

  return user;
}

export async function retrieveUser(mongo: Db, tenantID: string, id: string) {
  return collection(mongo).findOne({ tenantID, id });
}

export async function retrieveManyUsers(
  mongo: Db,
  tenantID: string,
  ids: string[]
) {
  const cursor = await collection(mongo).find({
    id: {
      $in: ids,
    },
    tenantID,
  });

  const users = await cursor.toArray();

  return ids.map(id => users.find(comment => comment.id === id) || null);
}

export async function retrieveUserWithProfile(
  mongo: Db,
  tenantID: string,
  profile: Partial<Pick<Profile, "id" | "type">>
) {
  return collection(mongo).findOne({
    tenantID,
    profiles: {
      $elemMatch: profile,
    },
  });
}

export async function retrieveUserWithEmail(
  mongo: Db,
  tenantID: string,
  email: string
) {
  return collection(mongo).findOne({
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
 */
export async function updateUserRole(
  mongo: Db,
  tenantID: string,
  id: string,
  role: GQLUSER_ROLE
) {
  const result = await collection(mongo).findOneAndUpdate(
    { id, tenantID },
    { $set: { role } },
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
  mongo: Db,
  tenantID: string,
  id: string,
  password: string,
  passwordID: string
) {
  // Hash the password.
  const hashedPassword = await hashPassword(password);

  // Update the user with the new password.
  const result = await collection(mongo).findOneAndUpdate(
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

  return result.value || null;
}

export interface UpdateUserInput {
  email?: string;
  username?: string;
}

export async function updateUserFromSSO(
  mongo: Db,
  tenantID: string,
  id: string,
  update: UpdateUserInput,
  lastIssuedAt: Date
) {
  // Update the user with the new password.
  const result = await collection(mongo).findOneAndUpdate(
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

  return result.value || null;
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
  mongo: Db,
  tenantID: string,
  id: string,
  username: string
) {
  // TODO: (wyattjoh) investigate adding the username previously used to an array.

  // The username wasn't found, so add it to the user.
  const result = await collection(mongo).findOneAndUpdate(
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
 * updateUserUsername will set the username of the User.
 *
 * @param mongo the database handle
 * @param tenantID the ID to the Tenant
 * @param id the ID of the User where we are setting the username on
 * @param username the username that we want to set
 */
export async function updateUserUsername(
  mongo: Db,
  tenantID: string,
  id: string,
  username: string
) {
  // TODO: (wyattjoh) investigate adding the username previously used to an array.

  // The username wasn't found, so add it to the user.
  const result = await collection(mongo).findOneAndUpdate(
    {
      tenantID,
      id,
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
  mongo: Db,
  tenantID: string,
  id: string,
  emailAddress: string
) {
  // Lowercase the email address.
  const email = emailAddress.toLowerCase();

  // Search to see if this email has been used before.
  let user = await collection(mongo).findOne({
    tenantID,
    email,
  });
  if (user) {
    throw new DuplicateEmailError(email);
  }

  // The email wasn't found, so try to update the User.
  const result = await collection(mongo).findOneAndUpdate(
    {
      tenantID,
      id,
      email: null,
    },
    {
      $set: {
        email,
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
      throw new UsernameAlreadySetError();
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
 */
export async function updateUserEmail(
  mongo: Db,
  tenantID: string,
  id: string,
  emailAddress: string
) {
  // Lowercase the email address.
  const email = emailAddress.toLowerCase();

  // Search to see if this email has been used before.
  let user = await collection(mongo).findOne({
    tenantID,
    email,
  });
  if (user) {
    throw new DuplicateEmailError(email);
  }

  // The email wasn't found, so try to update the User.
  const result = await collection(mongo).findOneAndUpdate(
    {
      tenantID,
      id,
    },
    {
      $set: {
        email,
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
  mongo: Db,
  tenantID: string,
  id: string,
  avatar?: string
) {
  // The email wasn't found, so try to update the User.
  const result = await collection(mongo).findOneAndUpdate(
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
  mongo: Db,
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
  const result = await collection(mongo).findOneAndUpdate(
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
  mongo: Db,
  tenantID: string,
  userID: string,
  name: string,
  now = new Date()
) {
  // Create the Token that we'll be adding to the User.
  const token: Readonly<Token> = {
    id: uuid.v4(),
    name,
    createdAt: now,
  };

  const result = await collection(mongo).findOneAndUpdate(
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

export async function deactivateUserToken(
  mongo: Db,
  tenantID: string,
  userID: string,
  id: string
) {
  // Try to remove the Token from the User.
  const result = await collection(mongo).findOneAndUpdate(
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
    if (!user.tokens.find(t => t.id === id)) {
      throw new TokenNotFoundError();
    }

    throw new Error("an unexpected error occurred");
  }

  // We have to typecast here because we know at this point that the record does
  // contain the Token.
  const token: Token = result.value.tokens.find(t => t.id === id) as Token;

  // Mutate the user in order to remove the Token from the list of Token's.
  const updatedUser: Readonly<User> = {
    ...result.value,
    tokens: result.value.tokens.filter(t => t.id !== id),
  };

  return {
    user: updatedUser,
    token,
  };
}

export type UserConnectionInput = ConnectionInput<User>;

export async function retrieveUserConnection(
  mongo: Db,
  tenantID: string,
  input: UserConnectionInput
): Promise<Readonly<Connection<Readonly<User>>>> {
  // Create the query.
  const query = new Query(collection(mongo)).where({ tenantID });

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
  return resolveConnection(query, input, user => user.createdAt);
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
  mongo: Db,
  tenantID: string,
  id: string,
  createdBy: string,
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
  };

  // Try to update the user if the user isn't already banned.
  const result = await collection(mongo).findOneAndUpdate(
    {
      id,
      tenantID,
      "status.ban.active": {
        $ne: true,
      },
    },
    {
      $set: {
        "status.ban.active": true,
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

    // Check to see if the user is already banned.
    const ban = consolidateUserBanStatus(user.status.ban);
    if (ban.active) {
      throw new UserAlreadyBannedError();
    }

    throw new Error("an unexpected error occurred");
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
  mongo: Db,
  tenantID: string,
  id: string,
  createdBy: string,
  now = new Date()
) {
  // Create the new ban.
  const ban: BanStatusHistory = {
    id: uuid(),
    active: false,
    createdBy,
    createdAt: now,
  };

  // Try to update the user if the user isn't already banned.
  const result = await collection(mongo).findOneAndUpdate(
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
 * @param from the range of time that the user is being banned for
 * @param message the message sent to suspended user in email
 * @param now the current date
 */
export async function suspendUser(
  mongo: Db,
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
  const result = await collection(mongo).findOneAndUpdate(
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
  mongo: Db,
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
  const result = await collection(mongo).findOneAndUpdate(
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

export type ConsolidatedBanStatus = Omit<GQLBanStatus, "history"> &
  Pick<BanStatus, "history">;

export function consolidateUserBanStatus(
  ban: User["status"]["ban"]
): ConsolidatedBanStatus {
  return ban;
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
}

export function consolidateUserStatus(
  status: User["status"],
  now = new Date()
): ConsolidatedUserStatus {
  // Return the status.
  return {
    suspension: consolidateUserSuspensionStatus(status.suspension, now),
    ban: consolidateUserBanStatus(status.ban),
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
  mongo: Db,
  tenantID: string,
  id: string
): Promise<string> {
  // Create the ID.
  const resetID = uuid.v4();

  // Associate the resetID with the user.
  const result = await collection(mongo).findOneAndUpdate(
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
  mongo: Db,
  tenantID: string,
  id: string
): Promise<string> {
  // Create the ID.
  const emailVerificationID = uuid.v4();

  // Associate the resetID with the user.
  const result = await collection(mongo).findOneAndUpdate(
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
  mongo: Db,
  tenantID: string,
  id: string,
  password: string,
  passwordID: string,
  resetID: string
) {
  // Hash the password.
  const hashedPassword = await hashPassword(password);

  // Update the user with the new password.
  const result = await collection(mongo).findOneAndUpdate(
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

  return result.value || null;
}

export async function confirmUserEmail(
  mongo: Db,
  tenantID: string,
  id: string,
  email: string,
  emailVerificationID: string
) {
  // Update the user with a confirmed email address.
  const result = await collection(mongo).findOneAndUpdate(
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

  return result.value || null;
}

export async function ignoreUser(
  mongo: Db,
  tenantID: string,
  id: string,
  ignoreUserID: string,
  now = new Date()
) {
  const ignoredUser: IgnoredUser = {
    id: ignoreUserID,
    createdAt: now,
  };

  const result = await collection(mongo).findOneAndUpdate(
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
      user.ignoredUsers.some(u => u.id === ignoreUserID)
    ) {
      // TODO: improve error
      throw new Error("user already ignored");
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}

export async function removeUserIgnore(
  mongo: Db,
  tenantID: string,
  id: string,
  ignoreUserID: string
) {
  const result = await collection(mongo).findOneAndUpdate(
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
      user.ignoredUsers.every(u => u.id !== ignoreUserID)
    ) {
      // TODO: improve error
      throw new Error("user already not ignored");
    }

    throw new Error("an unexpected error occurred");
  }

  return result.value;
}
