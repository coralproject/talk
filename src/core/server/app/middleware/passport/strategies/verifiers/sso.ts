import Joi from "joi";
import { isNil } from "lodash";
import { Db } from "mongodb";

import { validate } from "coral-server/app/request/body";
import { IntegrationDisabled } from "coral-server/errors";
import {
  GQLSSOAuthIntegration,
  GQLUSER_ROLE,
} from "coral-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "coral-server/models/tenant";
import {
  retrieveUserWithProfile,
  SSOProfile,
  updateUserFromSSO,
} from "coral-server/models/user";
import { insert } from "coral-server/services/users";

import {
  getSSOProfile,
  needsSSOUpdate,
} from "coral-server/models/user/helpers";
import {
  isJWTRevoked,
  SymmetricSigningAlgorithm,
  verifyJWT,
} from "coral-server/services/jwt";
import { AugmentedRedis } from "coral-server/services/redis";
import { DateTime } from "luxon";
import { Verifier } from "../jwt";

export interface SSOStrategyOptions {
  mongo: Db;
}

export interface SSOUserProfile {
  id: string;
  email: string;
  username: string;
  badges?: string[];
  role?: GQLUSER_ROLE;
}

export interface SSOToken {
  jti?: string;
  exp?: number;
  iat?: number;
  user: SSOUserProfile;
}

export function isSSOToken(token: SSOToken | object): token is SSOToken {
  const { error } = Joi.validate(token, SSOTokenSchema);
  return isNil(error);
}

export const SSOUserProfileSchema = Joi.object()
  .keys({
    id: Joi.string().required(),
    email: Joi.string()
      .lowercase()
      .required(),
    username: Joi.string().required(),
    badges: Joi.array().items(Joi.string()),
    role: Joi.string().only(Object.values(GQLUSER_ROLE)),
  })
  .optionalKeys(["badges", "role"]);

export const SSOTokenSchema = Joi.object()
  .keys({
    jti: Joi.string().default(undefined),
    exp: Joi.number().default(undefined),
    iat: Joi.number().default(undefined),
    user: SSOUserProfileSchema.required(),
  })
  .optionalKeys(["jti", "exp", "iat"]);

export async function findOrCreateSSOUser(
  mongo: Db,
  redis: AugmentedRedis,
  tenant: Tenant,
  integration: GQLSSOAuthIntegration,
  token: SSOToken,
  now = new Date()
) {
  if (!token.user) {
    // TODO: (wyattjoh) replace with better error.
    throw new Error("token is malformed, missing user claim");
  }

  // Validate the token content.
  const decodedToken: SSOToken = validate(SSOTokenSchema, token);

  // Unpack the token.
  const {
    jti,
    exp,
    user: { id, email, username, badges, role },
    iat,
  } = decodedToken;

  // If the token has a JTI and EXP claim, then it can be logged out. Check to
  // see if it was revoked.
  if (jti && exp && (await isJWTRevoked(redis, jti))) {
    return null;
  }

  // Compute the last issued at time stamp.
  const lastIssuedAt = iat ? DateTime.fromSeconds(iat).toJSDate() : now;

  // Try to lookup user given their id provided in the `sub` claim.
  let user = await retrieveUserWithProfile(mongo, tenant.id, {
    type: "sso",
    id,
  });
  if (!user) {
    if (!integration.allowRegistration) {
      // Registration is disabled, so we can't create the user user here.
      return null;
    }

    // FIXME: (wyattjoh) implement rules! Not all users should be able to create an account via this method.

    const profile: SSOProfile = {
      type: "sso",
      id,
      lastIssuedAt,
    };

    // Create the new user, as one didn't exist before!
    user = await insert(
      mongo,
      tenant,
      {
        id,
        username,
        role: role || GQLUSER_ROLE.COMMENTER,
        badges,
        email,
        profiles: [profile],
      },
      now
    );
  } else if (iat && needsSSOUpdate(decodedToken.user, user)) {
    // Get the SSO Profile.
    const profile = getSSOProfile(user);
    if (profile && profile.lastIssuedAt < lastIssuedAt) {
      // The token presented to us has a newer issue date than the one
      // associated with this profile, we should update the user with new
      // details.
      user = await updateUserFromSSO(
        mongo,
        tenant.id,
        user.id,
        { email, username, badges, role: role || user.role },
        lastIssuedAt
      );
    }
  }

  return user;
}

export interface SSOVerifierOptions {
  mongo: Db;
  redis: AugmentedRedis;
}

export class SSOVerifier implements Verifier<SSOToken> {
  private mongo: Db;
  private redis: AugmentedRedis;

  constructor({ mongo, redis }: SSOVerifierOptions) {
    this.mongo = mongo;
    this.redis = redis;
  }

  public supports(token: SSOToken | object, tenant: Tenant): token is SSOToken {
    return tenant.auth.integrations.sso.enabled && isSSOToken(token);
  }

  public async verify(
    tokenString: string,
    token: SSOToken,
    tenant: Tenant,
    now: Date
  ) {
    const integration = tenant.auth.integrations.sso;
    if (!integration.enabled) {
      throw new IntegrationDisabled("sso");
    }

    if (!integration.key) {
      throw new Error("integration key does not exist");
    }

    verifyJWT(
      tokenString,
      {
        // Force the use of the HS256 algorithm. We can explore switching this
        // out in the future..
        // TODO: (wyattjoh) investigate replacing algorithm.
        algorithm: SymmetricSigningAlgorithm.HS256,
        secret: integration.key,
      },
      now
    );

    return findOrCreateSSOUser(
      this.mongo,
      this.redis,
      tenant,
      integration,
      token,
      now
    );
  }
}
