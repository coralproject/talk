import Joi from "joi";
import jwt from "jsonwebtoken";
import { Db } from "mongodb";

import { validate } from "talk-server/app/request/body";
import {
  GQLSSOAuthIntegration,
  GQLUSER_ROLE,
} from "talk-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "talk-server/models/tenant";
import { retrieveUserWithProfile, SSOProfile } from "talk-server/models/user";
import { upsert } from "talk-server/services/users";

export interface SSOStrategyOptions {
  mongo: Db;
}

export interface SSOUserProfile {
  id: string;
  email: string;
  username?: string;
  avatar?: string;
  displayName?: string;
}

export interface SSOToken {
  user: SSOUserProfile;
}

export const SSOUserProfileSchema = Joi.object()
  .keys({
    id: Joi.string(),
    email: Joi.string(),
    username: Joi.string(),
    avatar: Joi.string().default(undefined),
    displayName: Joi.string().default(undefined),
  })
  .optionalKeys(["avatar", "displayName"]);

export async function findOrCreateSSOUser(
  db: Db,
  tenant: Tenant,
  integration: GQLSSOAuthIntegration,
  token: SSOToken
) {
  if (!token.user) {
    // TODO: (wyattjoh) replace with better error.
    throw new Error("token is malformed, missing user claim");
  }

  // Unpack/validate the token content.
  const { id, email, username, displayName, avatar }: SSOUserProfile = validate(
    SSOUserProfileSchema,
    token.user
  );

  const profile: SSOProfile = {
    type: "sso",
    id,
  };

  // Try to lookup user given their id provided in the `sub` claim.
  let user = await retrieveUserWithProfile(db, tenant.id, profile);
  if (!user) {
    if (!integration.allowRegistration) {
      // Registration is disabled, so we can't create the user user here.
      return null;
    }

    // FIXME: (wyattjoh) implement rules! Not all users should be able to create an account via this method.

    // Create the new user, as one didn't exist before!
    user = await upsert(db, tenant, {
      username,
      // When the displayName is disabled on the tenant, the displayName will
      // never be set (or even stored in the database).
      displayName,
      role: GQLUSER_ROLE.COMMENTER,
      email,
      avatar,
      profiles: [profile],
    });
  }

  // TODO: (wyattjoh) possibly update the user profile if the remaining details mismatch?

  return user;
}

/**
 * isSSOUserProfile will check if the given profile is a SSOUserProfile.
 *
 * @param profile the profile to check for the type
 */
export function isSSOUserProfile(
  profile: SSOUserProfile | object
): profile is SSOUserProfile {
  return (
    typeof (profile as SSOUserProfile).id !== "undefined" &&
    typeof (profile as SSOUserProfile).email !== "undefined" &&
    typeof (profile as SSOUserProfile).username !== "undefined"
  );
}

export function isSSOToken(token: SSOToken | object): token is SSOToken {
  return (
    typeof (token as SSOToken).user === "object" &&
    isSSOUserProfile((token as SSOToken).user)
  );
}

export interface SSOVerifierOptions {
  mongo: Db;
}

export class SSOVerifier {
  private mongo: Db;

  constructor({ mongo }: SSOVerifierOptions) {
    this.mongo = mongo;
  }

  public supports(token: SSOToken | object, tenant: Tenant): token is SSOToken {
    return tenant.auth.integrations.sso.enabled && isSSOToken(token);
  }

  public async verify(tokenString: string, token: SSOToken, tenant: Tenant) {
    const integration = tenant.auth.integrations.sso;
    if (!integration.enabled) {
      // TODO: (wyattjoh) return a better error.
      throw new Error("integration not enabled");
    }

    if (!integration.key) {
      throw new Error("integration key does not exist");
    }

    // Verify that the token is valid. This will throw an error if it isn't.
    jwt.verify(tokenString, integration.key, {
      // Force the use of the HS256 algorithm. We can explore switching this
      // out in the future..
      algorithms: ["HS256"], // TODO: (wyattjoh) investigate replacing algorithm.
    });

    return findOrCreateSSOUser(this.mongo, tenant, integration, token);
  }
}
