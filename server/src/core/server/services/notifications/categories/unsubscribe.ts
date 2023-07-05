import Joi from "joi";
import { isNull } from "lodash";
import { DateTime } from "luxon";
import { v4 as uuid } from "uuid";

import { constructTenantURL } from "coral-server/app/url";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { TokenInvalidError, UserNotFoundError } from "coral-server/errors";
import { Tenant } from "coral-server/models/tenant";
import { retrieveUser, User } from "coral-server/models/user";
import {
  JWTSigningConfig,
  signString,
  StandardClaims,
  StandardClaimsSchema,
  verifyJWT,
} from "coral-server/services/jwt";

export interface UnsubscribeToken extends Required<StandardClaims> {
  // aud specifies `unsubscribe` as the audience to indicate that this is a
  // unsubscribe token.
  aud: "unsubscribe";
}

const UnsubscribeTokenSchema = StandardClaimsSchema.keys({
  aud: Joi.string().valid("unsubscribe"),
});

export function validateUnsubscribeToken(
  token: UnsubscribeToken | object
): Error | null {
  const { error } = UnsubscribeTokenSchema.validate(token, {
    presence: "required",
  });
  return error || null;
}

export function isUnsubscribeToken(
  token: UnsubscribeToken | object
): token is UnsubscribeToken {
  return isNull(validateUnsubscribeToken(token));
}

export async function generateUnsubscribeURL(
  tenant: Tenant,
  config: Config,
  signingConfig: JWTSigningConfig,
  user: Pick<User, "id">,
  now: Date
) {
  // Pull some stuff out of the user.
  const { id } = user;

  // Change the JS Date to a DateTime for ease of use.
  const nowDate = DateTime.fromJSDate(now);
  const nowSeconds = Math.round(nowDate.toSeconds());

  // The expiry of this token is linked as 1 week after issuance.
  const expiresAt = Math.round(nowDate.plus({ weeks: 1 }).toSeconds());

  // Generate a token.
  const token: UnsubscribeToken = {
    jti: uuid(),
    iss: tenant.id,
    sub: id,
    exp: expiresAt,
    iat: nowSeconds,
    nbf: nowSeconds,
    aud: "unsubscribe",
  };

  // Sign it with the signing config.
  const tokenString = await signString(signingConfig, token);

  // Generate the unsubscribe url.
  return constructTenantURL(
    config,
    tenant,
    `/account/notifications/unsubscribe#unsubscribeToken=${tokenString}`
  );
}

export async function verifyUnsubscribeTokenString(
  mongo: MongoContext,
  tenant: Tenant,
  signingConfig: JWTSigningConfig,
  tokenString: string,
  now: Date
) {
  const token = verifyJWT(tokenString, signingConfig, now, {
    // Verify that the token is for this Tenant.
    issuer: tenant.id,
    // Verify that this is a unsubscribe token based on the audience.
    audience: "unsubscribe",
  });

  // Validate that this is indeed a unsubscribe token.
  if (!isUnsubscribeToken(token)) {
    // TODO: (wyattjoh) look into a way of pulling the error into this one
    throw new TokenInvalidError(
      tokenString,
      "does not conform to the unsubscribe token schema"
    );
  }

  // Unpack some of the token.
  const { sub: userID, iss } = token;

  // TODO: (wyattjoh) verify that the token has not been revoked.

  // Check to see if this unsubscribe token has already verified this email.
  const user = await retrieveUser(mongo, tenant.id, userID);
  if (!user) {
    throw new UserNotFoundError(userID);
  }

  if (iss !== tenant.id) {
    throw new TokenInvalidError(tokenString, "invalid tenant");
  }

  // Now that we've verified that the token is valid, we're good to go!
  return { token, user };
}
