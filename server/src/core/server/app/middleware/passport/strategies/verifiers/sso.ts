import { Redis } from "ioredis";
import Joi from "joi";
import { throttle } from "lodash";
import { DateTime } from "luxon";
import { URL } from "url";

import validateImagePathname from "coral-common/common/lib/helpers/validateImagePathname";
import { validate } from "coral-server/app/request/body";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { IntegrationDisabled, TokenInvalidError } from "coral-server/errors";
import logger from "coral-server/logger";
import {
  filterActiveSigningSecrets,
  SigningSecret,
  SSOAuthIntegration,
} from "coral-server/models/settings";
import {
  Tenant,
  updateLastUsedAtTenantSSOSigningSecret,
} from "coral-server/models/tenant";
import {
  retrieveUserWithProfile,
  SSOProfile,
  updateUserFromSSO,
} from "coral-server/models/user";
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
import {
  findOrCreate,
  processAutomaticBanForUser,
  processAutomaticPremodForUser,
} from "coral-server/services/users";

import {
  GQLSSOAuthIntegration,
  GQLUSER_ROLE,
} from "coral-server/graph/schema/__generated__/types";

import { Verifier } from "../jwt";

export interface SSOStrategyOptions {
  mongo: MongoContext;
}

export interface SSOUserProfile {
  id: string;
  email: string;
  username: string;
  badges?: string[];
  role?: GQLUSER_ROLE;
  url?: string;
  avatar?: string;
}

export interface SSOToken {
  jti?: string;
  exp?: number;
  iat?: number;
  user: SSOUserProfile;
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function validateToken(token: SSOToken | object): string | undefined {
  const { error } = SSOTokenSchema.validate(token, { allowUnknown: true });
  return error ? "SSO: " + error.message : undefined;
}

function isValidImageURL(url: string) {
  try {
    const parsed = new URL(url);
    return validateImagePathname(parsed.pathname);
  } catch (err) {
    return false;
  }
}

export const SSOUserProfileSchema = Joi.object().keys({
  id: Joi.string().required(),
  email: Joi.string().lowercase().required(),
  username: Joi.string().required(),
  badges: Joi.array().items(Joi.string()).optional(),
  role: Joi.string()
    .valid(...Object.values(GQLUSER_ROLE))
    .optional(),
  url: Joi.string().uri().optional(),
  avatar: Joi.string().uri().optional(),
});

export const SSOTokenSchema = Joi.object().keys({
  jti: Joi.string().optional(),
  exp: Joi.number().optional(),
  iat: Joi.number().optional(),
  user: SSOUserProfileSchema.required(),
});

export async function findOrCreateSSOUser(
  config: Config,
  mongo: MongoContext,
  redis: AugmentedRedis,
  tenant: Tenant,
  integration: GQLSSOAuthIntegration,
  token: SSOToken,
  now = new Date()
) {
  // Validate the token content.
  const decodedToken: SSOToken = validate(SSOTokenSchema, token);

  // Unpack the token.
  const {
    jti,
    exp,
    user: { id, email, username, badges, role, url },
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

  // Try to get the avatar.
  let avatar: string | undefined;
  if (decodedToken.user.avatar && isValidImageURL(decodedToken.user.avatar)) {
    avatar = decodedToken.user.avatar;
  }

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
    user = await findOrCreate(
      config,
      mongo,
      tenant,
      {
        id,
        username,
        role: role || GQLUSER_ROLE.COMMENTER,
        ssoURL: url,
        avatar,
        badges,
        email,
        emailVerified: true,
        profile,
      },
      { skipUsernameValidation: true },
      now
    );

    await processAutomaticPremodForUser(mongo, tenant, user);
  } else if (iat && needsSSOUpdate(decodedToken.user, user)) {
    // Get the SSO Profile.
    const profile = getSSOProfile(user);
    if (
      profile &&
      (!profile.lastIssuedAt || profile.lastIssuedAt < lastIssuedAt)
    ) {
      // The token presented to us has a newer issue date than the one
      // associated with this profile, we should update the user with new
      // details.
      user = await updateUserFromSSO(
        mongo,
        tenant.id,
        user.id,
        {
          email,
          username,
          badges,
          // Default to the role on the user if no role was specified so that
          // organizations that manage their roles external to the tokens are
          // not affected by this update feature.
          role: role || user.role,
          avatar,
        },
        lastIssuedAt
      );
    }
  }

  // Check the user's email address against emailDomain configurations
  // to see if they should be set to banned or always pre-moderated.
  // We do this here, because if a bad actor obtains access to a user and
  // updates their old email to a new bad domain email, we will catch that
  // new bad domain here.
  await processAutomaticBanForUser(mongo, tenant, user);

  return user;
}

const updateLastUsedAtKID = throttle(
  async (redis: Redis, tenantID: string, kid: string, now: Date) => {
    try {
      await updateLastUsedAtTenantSSOSigningSecret(redis, tenantID, kid, now);
      logger.trace({ tenantID, kid }, "updated last used tenant sso key");
    } catch (err) {
      logger.error(
        { err, tenantID, kid },
        "could not update the last used tenant sso key"
      );
    }
  },
  // Only let this update the last used time stamp every minute.
  60 * 1000
);

export interface SSOVerifierOptions {
  config: Config;
  mongo: MongoContext;
  redis: AugmentedRedis;
}

export function getRelevantSSOSigningSecrets(
  integration: SSOAuthIntegration,
  tokenString: string,
  now: Date,
  kid?: string
): SigningSecret[] {
  // Collect all the current valid keys.
  const keys = integration.signingSecrets.filter(
    filterActiveSigningSecrets(now)
  );
  if (keys.length === 1) {
    // There is only one key, that's all we can use!
    return keys;
  }

  // There is more than one key that could work, lets see if the token has a
  // kid.
  if (kid) {
    // The token has a kid, so if we have a matching token, we should use it. If
    // we don't have a matching kid, we can't possibly verify it, so throw an
    // error.
    const key = keys.find((k) => k.kid === kid);
    if (!key) {
      throw new TokenInvalidError(
        tokenString,
        "kid was specified but no matching keys were found"
      );
    }

    return [key];
  }

  // Because no matching kid's were found, we should now use all valid secrets
  // instead.
  // TODO: [CORL-755] (wyattjoh) remove when we are able to make a breaking change to require signing with a kid
  return keys;
}

export class SSOVerifier implements Verifier<SSOToken> {
  private config: Config;
  private mongo: MongoContext;
  private redis: AugmentedRedis;

  constructor({ mongo, redis, config }: SSOVerifierOptions) {
    this.config = config;
    this.mongo = mongo;
    this.redis = redis;
  }

  public enabled(tenant: Tenant): boolean {
    return tenant.auth.integrations.sso.enabled;
  }

  public checkForValidationError(
    // eslint-disable-next-line @typescript-eslint/ban-types
    token: SSOToken | object,
    kid?: string
  ): string | undefined {
    // TODO: [CORL-755] (wyattjoh) check that the `kid` it provided and matches a given kid in a future release
    return validateToken(token);
  }

  public async verify(
    tokenString: string,
    token: SSOToken,
    tenant: Tenant,
    now: Date,
    kid?: string
  ) {
    const integration = tenant.auth.integrations.sso;
    if (!integration.enabled) {
      throw new IntegrationDisabled("sso");
    }

    // Get the valid configurations for the given token and integration pair.
    const keys = getRelevantSSOSigningSecrets(
      integration,
      tokenString,
      now,
      kid
    );
    if (keys.length === 0) {
      throw new TokenInvalidError(
        tokenString,
        "no verification configuration can be matched"
      );
    }

    // TODO: [CORL-755] (wyattjoh) remove once we've added the requirement for `kid`.
    // While there are configs left to test...
    while (keys.length > 0) {
      // Grab the next config to test. We know that the shift operation will
      // return a config because we validated it's length in the loop predicate.
      const key = keys.shift()!;

      try {
        verifyJWT(
          tokenString,
          {
            // TODO: (wyattjoh) investigate replacing algorithm.
            algorithm: SymmetricSigningAlgorithm.HS256,
            secret: key.secret,
          },
          now
        );
      } catch (err) {
        // If this is the last config to test, we need to rethrow the error
        // here.
        if (keys.length === 0) {
          throw err;
        }

        // There are still configs to test, continue.
        continue;
      }

      // The verification did not throw an error, which means the verification
      // succeeded! Mark the key as used last now and break out. We should do
      // this in the nextTick because it's not important to have it recorded at
      // the same time.
      updateLastUsedAtKID(this.redis, tenant.id, key.kid, now).catch((err) => {
        logger.error({ err }, "could not update last used at kid");
      });

      // TODO: [CORL-754] (wyattjoh) reintroduce when we amend the front-end to display the kid
      // if (!kid) {
      //   logger.warn(
      //     { tenantID: tenant.id, kid: config.kid },
      //     "token without a `kid` matched key with known `kid`"
      //   );
      // }
      break;
    }

    return findOrCreateSSOUser(
      this.config,
      this.mongo,
      this.redis,
      tenant,
      integration,
      token,
      now
    );
  }
}
