import Joi from "joi";
import { isNull } from "lodash";
import { DateTime } from "luxon";
import uuid from "uuid";

import { constructTenantURL } from "coral-server/app/url";
import { Config } from "coral-server/config";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import {
  JWTSigningConfig,
  signString,
  StandardClaims,
  StandardClaimsSchema,
} from "coral-server/services/jwt";

export interface UnsubscribeToken extends Required<StandardClaims> {
  // aud specifies `unsubscribe` as the audience to indicate that this is a
  // unsubscribe token.
  aud: "unsubscribe";
}

const UnsubscribeTokenSchema = StandardClaimsSchema.keys({
  aud: Joi.string().only("unsubscribe"),
});

export function validateUnsubscribeToken(
  token: UnsubscribeToken | object
): Error | null {
  const { error } = Joi.validate(token, UnsubscribeTokenSchema, {
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
    jti: uuid.v4(),
    iss: tenant.id,
    sub: id,
    exp: expiresAt,
    iat: nowSeconds,
    nbf: nowSeconds,
    aud: "unsubscribe",
  };

  // Sign it with the signing config.
  const tokenString = await signString(signingConfig, token);

  // Generate the confirmation url.
  return constructTenantURL(
    config,
    tenant,
    `/account/notifications/unsubscribe#unsubscribeToken=${tokenString}`
  );
}
