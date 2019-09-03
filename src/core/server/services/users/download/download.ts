import Joi from "joi";
import { isNull } from "lodash";
import { DateTime } from "luxon";
import { Db } from "mongodb";
import uuid from "uuid";

import { constructTenantURL } from "coral-server/app/url";
import { Config } from "coral-server/config";
import { TokenInvalidError, UserNotFoundError } from "coral-server/errors";
import { Tenant } from "coral-server/models/tenant";
import { retrieveUser } from "coral-server/models/user";
import {
  JWTSigningConfig,
  signString,
  StandardClaims,
  StandardClaimsSchema,
  verifyJWT,
} from "coral-server/services/jwt";

interface DownloadToken extends Required<StandardClaims> {
  aud: "download";
}

const DownloadTokenSchema = StandardClaimsSchema.keys({
  aud: Joi.string().only("download"),
});

export async function generateDownloadToken(
  userID: string,
  tenant: Tenant,
  config: Config,
  signingConfig: JWTSigningConfig,
  now: Date
) {
  const nowDate = DateTime.fromJSDate(now);
  const nowSeconds = Math.round(nowDate.toSeconds());
  const expiresAt = Math.round(nowDate.plus({ weeks: 2 }).toSeconds());

  const downloadToken: DownloadToken = {
    jti: uuid.v4(),
    iss: tenant.id,
    sub: userID,
    exp: expiresAt,
    iat: nowSeconds,
    nbf: nowSeconds,
    aud: "download",
  };

  return await signString(signingConfig, downloadToken);
}

export async function generateDownloadLink(
  userID: string,
  tenant: Tenant,
  config: Config,
  signingConfig: JWTSigningConfig,
  now: Date
) {
  const token = await generateDownloadToken(
    userID,
    tenant,
    config,
    signingConfig,
    now
  );

  return constructTenantURL(
    config,
    tenant,
    `/account/download#downloadToken=${token}`
  );
}

export async function generateAdminDownloadLink(
  userID: string,
  tenant: Tenant,
  config: Config,
  signingConfig: JWTSigningConfig,
  now: Date
) {
  const token = await generateDownloadToken(
    userID,
    tenant,
    config,
    signingConfig,
    now
  );

  return constructTenantURL(
    config,
    tenant,
    `/api/account/download?token=${token}`
  );
}

export function validateDownloadToken(
  token: DownloadToken | object
): Error | null {
  const { error } = Joi.validate(token, DownloadTokenSchema, {
    presence: "required",
  });
  return error || null;
}

export function isDownloadToken(
  token: DownloadToken | object
): token is DownloadToken {
  return isNull(validateDownloadToken(token));
}

export async function verifyDownloadTokenString(
  mongo: Db,
  tenant: Tenant,
  signingConfig: JWTSigningConfig,
  tokenString: string,
  now: Date
) {
  const token = verifyJWT(tokenString, signingConfig, now, {
    issuer: tenant.id,
    audience: "download",
  });

  if (!isDownloadToken(token)) {
    throw new TokenInvalidError(
      tokenString,
      "does not conform to the download token schema"
    );
  }

  const { sub: userID, iss } = token;

  const user = await retrieveUser(mongo, tenant.id, userID);
  if (!user) {
    throw new UserNotFoundError(userID);
  }

  if (iss !== tenant.id) {
    throw new TokenInvalidError(tokenString, "invalid tenant");
  }

  return { token, user };
}
