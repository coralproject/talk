import Joi from "joi";
import { isNil } from "lodash";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";

import { constructTenantURL } from "coral-server/app/url";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import {
  LocalProfileNotSetError,
  PasswordResetTokenExpired,
  TokenInvalidError,
  UserNotFoundError,
} from "coral-server/errors";
import { Tenant } from "coral-server/models/tenant";
import {
  createOrRetrieveUserPasswordResetID,
  resetUserPassword,
  retrieveUser,
  User,
} from "coral-server/models/user";
import { getLocalProfile } from "coral-server/models/user/helpers";
import {
  JWTSigningConfig,
  signString,
  StandardClaims,
  StandardClaimsSchema,
  verifyJWT,
} from "coral-server/services/jwt";

import { validatePassword } from "../helpers";

export interface ResetToken extends Required<StandardClaims> {
  // aud specifies `reset` as the audience to indicate that this is a reset
  // token.
  aud: "reset";

  /**
   * rid is the reset ID that is used to prevent replay attacks with the same
   * reset token.
   */
  rid: string;
}

const ResetTokenSchema = StandardClaimsSchema.keys({
  aud: Joi.string().valid("reset"),
  rid: Joi.string(),
});

export function isResetToken(token: ResetToken | object): token is ResetToken {
  const { error } = ResetTokenSchema.validate(token, {
    presence: "required",
  });
  return isNil(error);
}

/**
 * generateResetURL will generate a reset URL that will send the user to the redirect
 * after they have reset their password.
 *
 * @param mongo MongoDB instance to interact with
 * @param tenant Tenant that the user exists on
 * @param config the convict config object
 * @param signingConfig signing configuration that will be used to sign the token
 * @param user User to create the password reset URL for
 * @param now the current time
 */
export async function generateResetURL(
  mongo: MongoContext,
  tenant: Tenant,
  config: Config,
  signingConfig: JWTSigningConfig,
  user: User,
  now: Date = new Date()
) {
  // Generate a reset ID to associate with the user account.
  const resetID = await createOrRetrieveUserPasswordResetID(
    mongo,
    tenant.id,
    user.id
  );

  // Change the JS Date to a DateTime for ease of use.
  const nowDate = DateTime.fromJSDate(now);
  const nowSeconds = Math.round(nowDate.toSeconds());

  // The expiry of this token is linked as 1 day after issuance.
  const expiresAt = Math.round(nowDate.plus({ days: 1 }).toSeconds());

  // Generate a token with this new reset ID.
  const resetToken: ResetToken = {
    jti: uuid(),
    iss: tenant.id,
    sub: user.id,
    exp: expiresAt,
    rid: resetID,
    iat: nowSeconds,
    nbf: nowSeconds,
    aud: "reset",
  };

  // Sign it with the signing config.
  const token = await signString(signingConfig, resetToken);

  // Generate and return the reset URL.
  return constructTenantURL(
    config,
    tenant,
    // TODO: (kiwi) verify that url is correct.
    `/account/password/reset#resetToken=${token}`
  );
}

export async function verifyResetTokenString(
  mongo: MongoContext,
  tenant: Tenant,
  signingConfig: JWTSigningConfig,
  tokenString: string,
  now: Date
) {
  const token = verifyJWT(tokenString, signingConfig, now, {
    // Verify that the token is for this Tenant.
    issuer: tenant.id,
    // Verify that this is a reset token based on the audience.
    audience: "reset",
  });

  // Validate that this is indeed a reset token.
  if (!isResetToken(token)) {
    throw new TokenInvalidError(
      tokenString,
      "does not conform to the reset token schema"
    );
  }

  // Unpack some of the token.
  const { sub: userID, rid: resetID } = token;

  // TODO: (wyattjoh) verify that the token has not been revoked.

  // Check to see if this reset id is a valid match against the user.
  const user = await retrieveUser(mongo, tenant.id, userID);
  if (!user) {
    throw new UserNotFoundError(userID);
  }

  // Get the local profile that might contain the reset token.
  const profile = getLocalProfile(user);
  if (!profile) {
    throw new LocalProfileNotSetError();
  }

  // Verify that the reset id matches the current user.
  if (profile.resetID !== resetID) {
    throw new PasswordResetTokenExpired("reset id mismatch");
  }

  // Now that we've verified that the token is valid and it has not expired,
  // checked that the reset id matches the current one set on the user, we can
  // be confident that the passed reset token is valid.
  return { token, user, profile };
}

export async function resetPassword(
  mongo: MongoContext,
  tenant: Tenant,
  signingConfig: JWTSigningConfig,
  tokenString: string,
  password: string,
  now: Date
) {
  // Validate that the password meets the validation requirements.
  validatePassword(password);

  // Verify that the password reset token is valid and unpack it.
  const {
    token: { sub: userID, rid: resetID },
    profile: { passwordID },
  } = await verifyResetTokenString(
    mongo,
    tenant,
    signingConfig,
    tokenString,
    now
  );

  // Perform the password reset operation.
  const user = await resetUserPassword(
    mongo,
    tenant.id,
    userID,
    password,
    passwordID,
    resetID
  );

  // TODO: (wyattjoh) revoke the JTI

  return user;
}
