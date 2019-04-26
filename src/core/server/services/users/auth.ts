import Joi from "joi";
import { isNil } from "lodash";
import { DateTime } from "luxon";
import { Db } from "mongodb";
import uuid from "uuid";

import {
  LocalProfileNotSetError,
  PasswordResetExpired,
  TokenInvalidError,
  UserNotFoundError,
} from "talk-server/errors";
import { getLocalProfile } from "talk-server/helpers/users";
import { Tenant } from "talk-server/models/tenant";
import {
  createOrReplaceUserPasswordResetID,
  resetUserPassword,
  retrieveUser,
  User,
} from "talk-server/models/user";
import {
  JWTSigningConfig,
  signString,
  StandardClaims,
  StandardClaimsSchema,
  verifyJWT,
} from "talk-server/services/jwt";
import { validatePassword } from "./helpers";

interface ResetToken extends Required<StandardClaims> {
  // aud specifies `reset` as the audience to indicate that this is a reset
  // token.
  aud: "reset";

  /**
   * rid is the reset ID that is used to prevent replay attacks with the same
   * reset token.
   */
  rid: string;

  /**
   * ruri is the redirect URL to redirect the User to after a successful reset.
   */
  ruri: string;
}

const ResetTokenSchema = StandardClaimsSchema.keys({
  aud: Joi.string().only("reset"),
  rid: Joi.string(),
  ruri: Joi.string().uri(),
});

function isResetToken(token: ResetToken | object): token is ResetToken {
  const { error } = Joi.validate(token, ResetTokenSchema, {
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
 * @param signingConfig signing configuration that will be used to sign the token
 * @param user User to create the password reset URL for
 * @param redirectURI URL to redirect the User to after a successful reset
 * @param now the current time
 */
export async function generateResetURL(
  mongo: Db,
  tenant: Tenant,
  signingConfig: JWTSigningConfig,
  user: User,
  redirectURI: string,
  now: Date = new Date()
) {
  // Generate a reset ID to associate with the user account.
  const resetID = await createOrReplaceUserPasswordResetID(
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
    jti: uuid.v4(),
    iss: tenant.id,
    sub: user.id,
    exp: expiresAt,
    rid: resetID,
    ruri: redirectURI,
    iat: nowSeconds,
    nbf: nowSeconds,
    aud: "reset",
  };

  // Sign it with the signing config.
  const token = await signString(signingConfig, resetToken);

  // Generate and return the reset URL.
  // FIXME: (wyattjoh) generate the reset URL.
  return `https://<your-reset-url>/#resetToken=${token}`;
}

export async function verifyResetTokenString(
  mongo: Db,
  tenant: Tenant,
  signingConfig: JWTSigningConfig,
  tokenString: string,
  now: Date
): Promise<ResetToken> {
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

  // Check to see if this reset id is a valid match against the user.
  const user = await retrieveUser(mongo, tenant.id, userID);
  if (!user) {
    throw new UserNotFoundError(userID);
  }

  // Get the local profile that might contain the reset token.
  const localProfile = getLocalProfile(user);
  if (!localProfile) {
    throw new LocalProfileNotSetError();
  }

  // Verify that the reset id matches the current user.
  if (localProfile.resetID !== resetID) {
    throw new PasswordResetExpired("reset id mismatch");
  }

  // Now that we've verified that the token is valid and it has not expired,
  // checked that the reset id matches the current one set on the user, we can
  // be confident that the passed reset token is valid.
  return token;
}

export async function resetPassword(
  mongo: Db,
  tenant: Tenant,
  signingConfig: JWTSigningConfig,
  tokenString: string,
  password: string,
  now: Date
) {
  // Validate that the password meets the validation requirements.
  validatePassword(password);

  // Verify that the password reset token is valid and unpack it.
  const { sub: userID, rid: resetID } = await verifyResetTokenString(
    mongo,
    tenant,
    signingConfig,
    tokenString,
    now
  );

  // Perform the password reset operation.
  return resetUserPassword(mongo, tenant.id, userID, password, resetID);
}
