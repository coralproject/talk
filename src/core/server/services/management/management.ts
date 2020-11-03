import Joi from "joi";
import { isNull } from "lodash";

import { TokenInvalidError } from "coral-server/errors";

import {
  JWTSigningConfig,
  StandardClaims,
  StandardClaimsSchema,
  verifyJWT,
} from "../jwt";

export interface InstallationToken
  extends Required<Pick<StandardClaims, "iat" | "exp" | "sub">> {
  // aud specifies `installation` as the audience to indicate that this is a
  // installation token.
  aud: "installation";
}

const InstallationTokenSchema = StandardClaimsSchema.keys({
  aud: Joi.string().valid("installation"),
}).fork(["iat", "exp", "sub", "aud"], (s) => s.required());

export function validateInstallationToken(
  token: InstallationToken | object
): Error | null {
  const { error } = InstallationTokenSchema.validate(token);
  return error || null;
}

export function isInstallationToken(
  token: InstallationToken | object
): token is InstallationToken {
  return isNull(validateInstallationToken(token));
}

export async function verifyInstallationTokenString(
  signingConfig: JWTSigningConfig,
  tokenString: string,
  now: Date
) {
  const token = verifyJWT(tokenString, signingConfig, now, {
    // Verify that this is a installation token based on the audience.
    audience: "installation",
  });

  // Validate that this is indeed a installation token.
  if (!isInstallationToken(token)) {
    // TODO: (wyattjoh) look into a way of pulling the error into this one
    throw new TokenInvalidError(
      tokenString,
      "does not conform to the installation token schema"
    );
  }

  // Now that we've verified that the token is valid, we're good to go!
  return { token };
}
