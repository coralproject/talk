import Joi from "joi";
import jwt, { KeyFunctionCallback } from "jsonwebtoken";
import { Db } from "mongodb";
import { Strategy } from "passport-strategy";

import { extractJWTFromRequest } from "talk-server/app/middleware/passport/jwt";
import {
  findOrCreateOIDCUser,
  isOIDCToken,
  OIDCIDToken,
} from "talk-server/app/middleware/passport/oidc";
import { validate } from "talk-server/app/request/body";
import { GQLUSER_ROLE } from "talk-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "talk-server/models/tenant";
import { retrieveUserWithProfile, SSOProfile } from "talk-server/models/user";
import { upsert } from "talk-server/services/users";
import { Request } from "talk-server/types/express";

export interface SSOStrategyOptions {
  db: Db;
}

export interface SSOUserProfile {
  id: string;
  email: string;
  username: string;
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
  })
  .optionalKeys(["avatar"]);

export const SSODisplayNameUserProfileSchema = SSOUserProfileSchema.keys({
  displayName: Joi.string().default(undefined),
}).optionalKeys(["displayName"]);

export async function findOrCreateSSOUser(
  db: Db,
  tenant: Tenant,
  token: SSOToken
) {
  if (!token.user) {
    // TODO: (wyattjoh) replace with better error.
    throw new Error("token is malformed, missing user claim");
  }

  // Unpack/validate the token content.
  const { id, email, username, displayName, avatar }: SSOUserProfile = validate(
    tenant.auth.displayNameEnable
      ? SSODisplayNameUserProfileSchema
      : SSOUserProfileSchema,
    token.user
  );

  const profile: SSOProfile = {
    type: "sso",
    id,
  };

  // Try to lookup user given their id provided in the `sub` claim.
  let user = await retrieveUserWithProfile(db, tenant.id, profile);
  if (!user) {
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

export default class SSOStrategy extends Strategy {
  public name: string;

  private db: Db;

  constructor({ db }: SSOStrategyOptions) {
    super();

    this.name = "sso";
    this.db = db;
  }

  /**
   * retrieves the integration's secret to be used to verify the token.
   */
  private getSigningSecretGetter = (tenant: Tenant) => async (
    headers: { kid?: string },
    done: KeyFunctionCallback
  ) => {
    const integration = tenant.auth.integrations.sso;
    if (!integration) {
      // TODO: (wyattjoh) return a better error.
      return done(new Error("integration not found"));
    }

    if (!integration.enabled) {
      // TODO: (wyattjoh) return a better error.
      return done(new Error("integration not enabled"));
    }

    // TODO: (wyattjoh) do something with the kid... Lookup the secret or verify it matches what we have?

    return done(null, integration.key);
  };

  /**
   * findOrCreateUser will interpret the token and use the correct strategy for
   * retrieving/creating the user.
   *
   * @param tenant the tenant for the new/returning user
   * @param token the token that was unpacked and validated from the sso strategy
   */
  private async findOrCreateUser(
    tenant: Tenant,
    token: OIDCIDToken | SSOToken
  ) {
    if (isOIDCToken(token)) {
      // The token provided for SSO contains an issuer claim. We're assuming
      // that this request is associated with an OpenID Connect provider.
      return findOrCreateOIDCUser(this.db, tenant, token);
    }

    // Check to see if this token is a SSO Token or not, if it isn't error out.
    if (!isSSOToken(token)) {
      // TODO: (wyattjoh) return a better error.
      throw new Error("token is invalid");
    }

    // The token provided does not confirm to the OpenID Connect provider
    // spec, but id does conform to a SSOToken so we should expect the token to
    // contain the user profile.
    return findOrCreateSSOUser(this.db, tenant, token);
  }

  /**
   * wrapNewTokenHandler wraps the token handling with a promise.
   */
  private wrapNewTokenHandler = (tenant: Tenant) => async (
    err: Error | undefined,
    decoded: OIDCIDToken | SSOToken
  ) => {
    if (err) {
      return this.fail(err, 401);
    }

    try {
      // Find or create the user based on the decoded token.
      const user = await this.findOrCreateUser(tenant, decoded);

      // The user was found or created!
      return this.success(user, null);
    } catch (err) {
      return this.error(err);
    }
  };

  public authenticate(req: Request) {
    const { tenant } = req;
    if (!tenant) {
      // TODO: (wyattjoh) return a better error.
      return this.error(new Error("tenant not found"));
    }

    // Lookup the token.
    const token = extractJWTFromRequest(req);
    if (!token) {
      // TODO: (wyattjoh) return a better error.
      return this.fail(new Error("no token on request"), 400);
    }

    // Perform the JWT validation.
    jwt.verify(
      token,
      this.getSigningSecretGetter(tenant),
      {
        // Force the use of the HS256 algorithm. We can explore switching this
        // out in the future..
        algorithms: ["HS256"], // TODO: (wyattjoh) investigate replacing algorithm.
      },
      this.wrapNewTokenHandler(tenant)
    );
  }
}
