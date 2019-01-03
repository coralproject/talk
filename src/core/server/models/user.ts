import bcrypt from "bcryptjs";
import { Db } from "mongodb";
import uuid from "uuid";

import { Omit, Sub } from "talk-common/types";
import { GQLUSER_ROLE } from "talk-server/graph/tenant/schema/__generated__/types";
import { createIndexFactory, FilterQuery } from "talk-server/models/query";
import { TenantResource } from "talk-server/models/tenant";

function collection(mongo: Db) {
  return mongo.collection<Readonly<User>>("users");
}

export interface LocalProfile {
  type: "local";
  id: string;
  password: string;
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
}

export interface FacebookProfile {
  type: "facebook";
  id: string;
}

export interface GoogleProfile {
  type: "google";
  id: string;
}

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

export interface User extends TenantResource {
  readonly id: string;
  username?: string;
  lowercaseUsername?: string;
  displayName?: string;
  avatar?: string;
  email?: string;
  emailVerified?: boolean;
  profiles: Profile[];
  tokens: Token[];
  role: GQLUSER_ROLE;
  createdAt: Date;
}

export async function createUserIndexes(mongo: Db) {
  const createIndex = createIndexFactory(collection(mongo));

  // UNIQUE { id }
  await createIndex({ tenantID: 1, id: 1 }, { unique: true });

  // UNIQUE - PARTIAL { lowercaseUsername }
  await createIndex(
    { tenantID: 1, lowercaseUsername: 1 },
    {
      unique: true,
      partialFilterExpression: { lowercaseUsername: { $exists: true } },
    }
  );

  // UNIQUE - PARTIAL { email }
  await createIndex(
    { tenantID: 1, email: 1 },
    { unique: true, partialFilterExpression: { email: { $exists: true } } }
  );

  // UNIQUE { profiles.type, profiles.id }
  await createIndex(
    { tenantID: 1, "profiles.type": 1, "profiles.id": 1 },
    { unique: true }
  );
}

function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export type UpsertUserInput = Omit<
  User,
  "id" | "tenantID" | "tokens" | "createdAt" | "lowercaseUsername"
>;

export async function upsertUser(
  db: Db,
  tenantID: string,
  input: UpsertUserInput
) {
  const now = new Date();

  // Create a new ID for the user.
  const id = uuid.v4();

  // default are the properties set by the application when a new user is
  // created.
  const defaults: Sub<User, UpsertUserInput> = {
    id,
    tenantID,
    tokens: [],
    createdAt: now,
  };

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

  // Add in the lowercase username if it was sent.
  if (input.username) {
    defaults.lowercaseUsername = input.username.toLowerCase();
  }

  // Merge the defaults and the input together.
  const user: Readonly<User> = {
    ...defaults,
    ...input,
    profiles,
  };

  // Create a query that will utilize a findOneAndUpdate to facilitate an upsert
  // operation to ensure no user has the same profile and/or email address. If
  // any user is found to have the same profile as any of the profiles specified
  // in the new user object, then we should error here.
  const filter = createUpsertUserFilter(user);

  // Create the upsert/update operation.
  const update: { $setOnInsert: Readonly<User> } = {
    $setOnInsert: user,
  };

  // Insert it into the database. This may throw an error.
  const result = await collection(db).findOneAndUpdate(filter, update, {
    // We are using this to create a user, so we need to upsert it.
    upsert: true,

    // False to return the updated document instead of the original document.
    // This lets us detect if the document was updated or not.
    returnOriginal: false,
  });

  // Check to see if this was a new user that was upserted, or one was found
  // that matched existing records. We are sure here that the record exists
  // because we're returning the updated document and performing an upsert
  // operation.
  if (result.value!.id !== id) {
    // TODO: return better error.
    throw new Error("user already found");
  }

  return result.value!;
}

const createUpsertUserFilter = (user: Readonly<User>) => {
  const query: FilterQuery<User> = {
    // Query by the profiles if the user is being created with one.
    $or: user.profiles.map(profile => ({ profiles: { $elemMatch: profile } })),
  };

  if (user.email) {
    // Query by the email address if the user is being created with one.
    query.$or.push({ email: user.email });
  }

  return query;
};

export async function retrieveUser(db: Db, tenantID: string, id: string) {
  return collection(db).findOne({ tenantID, id });
}

export async function retrieveManyUsers(
  db: Db,
  tenantID: string,
  ids: string[]
) {
  const cursor = await collection(db).find({
    id: {
      $in: ids,
    },
    tenantID,
  });

  const users = await cursor.toArray();

  return ids.map(id => users.find(comment => comment.id === id) || null);
}

export async function retrieveUserWithProfile(
  db: Db,
  tenantID: string,
  profile: Partial<Pick<Profile, "id" | "type">>
) {
  return collection(db).findOne({
    tenantID,
    profiles: {
      $elemMatch: profile,
    },
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
    // TODO: (wyattjoh) return better error
    throw new Error("user not found");
  }

  return result.value;
}

export async function verifyUserPassword(user: User, password: string) {
  const profile: LocalProfile | undefined = user.profiles.find(
    ({ type }) => type === "local"
  ) as LocalProfile | undefined;
  if (!profile) {
    throw new Error("no local profile exists for this user");
  }

  return bcrypt.compare(password, profile.password);
}

export async function updateUserPassword(
  mongo: Db,
  tenantID: string,
  id: string,
  password: string
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
      "profiles.type": "local",
    },
    {
      $set: {
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
      // TODO: (wyattjoh) return better error
      throw new Error("user not found");
    }

    if (
      !user.profiles.some(
        profile => profile.type === "local" && profile.id === user.email
      )
    ) {
      // TODO: (wyattjoh) return better error
      throw new Error("user does not have a local profile");
    }

    // TODO: (wyattjoh) return better error
    throw new Error("unexpected error occurred");
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
  // Lowercase the username.
  const lowercaseUsername = username.toLowerCase();

  // Search to see if this username has been used before.
  let user = await collection(mongo).findOne({
    tenantID,
    lowercaseUsername,
  });
  if (user) {
    // TODO: (wyattjoh) return better error
    throw new Error("duplicate username found");
  }

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
        lowercaseUsername,
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
      // TODO: (wyattjoh) return better error
      throw new Error("user not found");
    }

    if (user.username) {
      // TODO: (wyattjoh) return better error
      throw new Error("user already has username");
    }

    // TODO: (wyattjoh) return better error
    throw new Error("unexpected error occurred");
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
  // Lowercase the username.
  const lowercaseUsername = username.toLowerCase();

  // Search to see if this username has been used before.
  let user = await collection(mongo).findOne({
    tenantID,
    lowercaseUsername,
  });
  if (user) {
    // TODO: (wyattjoh) return better error
    throw new Error("duplicate username found");
  }

  // The username wasn't found, so add it to the user.
  const result = await collection(mongo).findOneAndUpdate(
    {
      tenantID,
      id,
    },
    {
      $set: {
        username,
        lowercaseUsername,
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
      // TODO: (wyattjoh) return better error
      throw new Error("user not found");
    }

    // TODO: (wyattjoh) return better error
    throw new Error("unexpected error occurred");
  }

  return result.value;
}

/**
 * updateUserDisplayName will set the displayName of the User. If the display
 * name is not provided, it will be unset.
 *
 * @param mongo the database handle
 * @param tenantID the ID to the Tenant
 * @param id the ID of the User where we are setting the displayName on
 * @param displayName the displayName that we want to set
 */
export async function updateUserDisplayName(
  mongo: Db,
  tenantID: string,
  id: string,
  displayName?: string
) {
  // The username wasn't found, so add it to the user.
  const result = await collection(mongo).findOneAndUpdate(
    {
      tenantID,
      id,
    },
    {
      // This will ensure that if the display name isn't provided, it will unset
      // the display name on the User.
      [displayName ? "$set" : "$unset"]: {
        displayName: displayName ? displayName : 1,
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
      // TODO: (wyattjoh) return better error
      throw new Error("user not found");
    }

    // TODO: (wyattjoh) return better error
    throw new Error("unexpected error occurred");
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
    // TODO: (wyattjoh) return better error
    throw new Error("duplicate email found");
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
      // TODO: (wyattjoh) return better error
      throw new Error("user not found");
    }

    if (user.email) {
      // TODO: (wyattjoh) return better error
      throw new Error("user already has email");
    }

    // TODO: (wyattjoh) return better error
    throw new Error("unexpected error occurred");
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
    // TODO: (wyattjoh) return better error
    throw new Error("duplicate email found");
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
      // TODO: (wyattjoh) return better error
      throw new Error("user not found");
    }

    // TODO: (wyattjoh) return better error
    throw new Error("unexpected error occurred");
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
      // TODO: (wyattjoh) return better error
      throw new Error("user not found");
    }

    // TODO: (wyattjoh) return better error
    throw new Error("unexpected error occurred");
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
    // TODO: (wyattjoh) return better error
    throw new Error("duplicate profile found");
  }

  // Hash the password.
  const hashedPassword = await hashPassword(password);

  // Create the profile that we'll use.
  const profile: LocalProfile = {
    type: "local",
    id: email,
    password: hashedPassword,
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
      // TODO: (wyattjoh) return better error
      throw new Error("user not found");
    }

    if (user.profiles.some(({ type }) => type === "local")) {
      // TODO: (wyattjoh) return better error
      throw new Error("user already has local profile");
    }

    // TODO: (wyattjoh) return better error
    throw new Error("unexpected error occurred");
  }

  return result.value;
}

export async function createUserToken(
  mongo: Db,
  tenantID: string,
  userID: string,
  name: string
) {
  // Create the Token that we'll be adding to the User.
  const token: Readonly<Token> = {
    id: uuid.v4(),
    name,
    createdAt: new Date(),
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
    // TODO: (wyattjoh) return better error
    throw new Error("user not found");
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
      // TODO: (wyattjoh) return better error
      throw new Error("user not found");
    }

    // Check to see if the User had that Token in the first place.
    if (!user.tokens.find(t => t.id === id)) {
      // TODO: (wyattjoh) return better error
      throw new Error("token not found on user");
    }

    // TODO: (wyattjoh) return better error
    throw new Error("could not remove the token for an unknown reason");
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
