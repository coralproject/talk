import { IncomingMessage } from "http";
import { Redis } from "ioredis";
import Joi from "joi";
import jwt, { KeyFunction, SignOptions, VerifyOptions } from "jsonwebtoken";
import { DateTime } from "luxon";
import { Bearer, BearerOptions } from "permit";
import { v4 as uuid } from "uuid";

import { DEFAULT_SESSION_DURATION } from "coral-common/constants";
import {
  AuthenticationError,
  JWTRevokedError,
  TokenInvalidError,
} from "coral-server/errors";
import { Auth } from "coral-server/models/settings";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { Request } from "coral-server/types/express";

/**
 * The following Header Parameter names for use in JWSs are registered
 * in the IANA "JSON Web Signature and Encryption Header Parameters"
 * registry established by Section 9.1, with meanings as defined in the
 * subsections below.
 *
 * As indicated by the common registry, JWSs and JWEs share a common
 * Header Parameter space; when a parameter is used by both
 * specifications, its usage must be compatible between the
 * specifications.
 *
 * https://tools.ietf.org/html/rfc7515#section-4.1
 */
export interface StandardHeader {
  /**
   * The "kid" (key ID) Header Parameter is a hint indicating which key
   * was used to secure the JWS.  This parameter allows originators to
   * explicitly signal a change of key to recipients.  The structure of
   * the "kid" value is unspecified.  Its value MUST be a case-sensitive
   * string.  Use of this Header Parameter is OPTIONAL.
   *
   * When used with a JWK, the "kid" value is used to match a JWK "kid"
   * parameter value.
   *
   * https://tools.ietf.org/html/rfc7515#section-4.1.4
   */
  kid?: string;
}

/**
 * The following Claim Names are registered in the IANA "JSON Web Token
 * Claims" registry established by Section 10.1.  None of the claims
 * defined below are intended to be mandatory to use or implement in all
 * cases, but rather they provide a starting point for a set of useful,
 * interoperable claims.  Applications using JWTs should define which
 * specific claims they use and when they are required or optional.  All
 * the names are short because a core goal of JWTs is for the
 * representation to be compact.
 *
 * https://tools.ietf.org/html/rfc7519#section-4.1
 */
export interface StandardClaims {
  /**
   * The "jti" (JWT ID) claim provides a unique identifier for the JWT. The
   * identifier value MUST be assigned in a manner that ensures that there is a
   * negligible probability that the same value will be accidentally assigned to
   * a different data object; if the application uses multiple issuers,
   * collisions MUST be prevented among values produced by different issuers as
   * well.  The "jti" claim can be used to prevent the JWT from being replayed.
   * The "jti" value is a case- sensitive string.  Use of this claim is
   * OPTIONAL.
   *
   * https://tools.ietf.org/html/rfc7519#section-4.1.7
   */
  jti?: string;

  /**
   * The "aud" (audience) claim identifies the recipients that the JWT is
   * intended for.  Each principal intended to process the JWT MUST
   * identify itself with a value in the audience claim.  If the principal
   * processing the claim does not identify itself with a value in the
   * "aud" claim when this claim is present, then the JWT MUST be
   * rejected.  In the general case, the "aud" value is an array of case-
   * sensitive strings, each containing a StringOrURI value.  In the
   * special case when the JWT has one audience, the "aud" value MAY be a
   * single case-sensitive string containing a StringOrURI value.  The
   * interpretation of audience values is generally application specific.
   * Use of this claim is OPTIONAL.
   *
   * https://tools.ietf.org/html/rfc7519#section-4.1.3
   */
  aud?: string;

  /**
   * The "sub" (subject) claim identifies the principal that is the
   * subject of the JWT. The claims in a JWT are normally statements
   * about the subject. The subject value MUST either be scoped to be
   * locally unique in the context of the issuer or be globally unique.
   * The processing of this claim is generally application specific. The
   * "sub" value is a case-sensitive string containing a StringOrURI
   * value. Use of this claim is OPTIONAL.
   *
   * https://tools.ietf.org/html/rfc7519#section-4.1.2
   */
  sub?: string;

  /**
   * The "iss" (issuer) claim identifies the principal that issued the
   * JWT. The processing of this claim is generally application specific.
   * The "iss" value is a case-sensitive string containing a StringOrURI
   * value. Use of this claim is OPTIONAL.
   *
   * https://tools.ietf.org/html/rfc7519#section-4.1.2
   */
  iss?: string;

  /**
   * The "exp" (expiration time) claim identifies the expiration time on
   * or after which the JWT MUST NOT be accepted for processing.  The
   * processing of the "exp" claim requires that the current date/time
   * MUST be before the expiration date/time listed in the "exp" claim.
   * Implementers MAY provide for some small leeway, usually no more than
   * a few minutes, to account for clock skew.  Its value MUST be a number
   * containing a NumericDate value.  Use of this claim is OPTIONAL.
   *
   * https://tools.ietf.org/html/rfc7519#section-4.1.4
   */
  exp?: number;

  /**
   *  The "nbf" (not before) claim identifies the time before which the JWT
   * MUST NOT be accepted for processing.  The processing of the "nbf"
   * claim requires that the current date/time MUST be after or equal to
   * the not-before date/time listed in the "nbf" claim.  Implementers MAY
   * provide for some small leeway, usually no more than a few minutes, to
   * account for clock skew.  Its value MUST be a number containing a
   * NumericDate value.  Use of this claim is OPTIONAL.
   *
   * https://tools.ietf.org/html/rfc7519#section-4.1.5
   */
  nbf?: number;

  /**
   * The "iat" (issued at) claim identifies the time at which the JWT was
   * issued.  This claim can be used to determine the age of the JWT.  Its
   * value MUST be a number containing a NumericDate value.  Use of this
   * claim is OPTIONAL.
   *
   * https://tools.ietf.org/html/rfc7519#section-4.1.6
   */
  iat?: number;
}

export const StandardClaimsSchema = Joi.object().keys({
  jti: Joi.string(),
  aud: Joi.string(),
  sub: Joi.string(),
  iss: Joi.string(),
  exp: Joi.number(),
  nbf: Joi.number(),
  iat: Joi.number(),
});

export enum AsymmetricSigningAlgorithm {
  RS256 = "RS256",
  RS384 = "RS384",
  RS512 = "RS512",
  ES256 = "ES256",
  ES384 = "ES384",
  ES512 = "ES512",
}

export enum SymmetricSigningAlgorithm {
  HS256 = "HS256",
  HS384 = "HS384",
  HS512 = "HS512",
}

export type JWTSigningAlgorithm =
  | AsymmetricSigningAlgorithm
  | SymmetricSigningAlgorithm;

export interface JWTSigningConfig {
  secret: Buffer | string;
  algorithm: JWTSigningAlgorithm;
}

export interface JWTVerifyingConfig {
  secret: Buffer | string | KeyFunction;
  algorithm: JWTSigningAlgorithm;
}

export function dateToSeconds(date: Date): number {
  return Math.round(DateTime.fromJSDate(date).toSeconds());
}

export function createAsymmetricSigningConfig(
  algorithm: AsymmetricSigningAlgorithm,
  secret: string
): JWTSigningConfig {
  return {
    // Secrets have their newlines encoded with newline literals.
    secret: Buffer.from(secret.replace(/\\n/g, "\n"), "utf8"),
    algorithm,
  };
}

export function createSymmetricSigningConfig(
  algorithm: SymmetricSigningAlgorithm,
  secret: string
): JWTSigningConfig {
  return {
    secret,
    algorithm,
  };
}

function isSymmetricSigningAlgorithm(
  algorithm: string | SymmetricSigningAlgorithm
): algorithm is SymmetricSigningAlgorithm {
  return algorithm in SymmetricSigningAlgorithm;
}

function isAsymmetricSigningAlgorithm(
  algorithm: string | AsymmetricSigningAlgorithm
): algorithm is AsymmetricSigningAlgorithm {
  return algorithm in AsymmetricSigningAlgorithm;
}

/**
 * Parses the config and provides the signing config.
 */
export function createJWTSigningConfig(
  secret: string,
  algorithm: string = SymmetricSigningAlgorithm.HS256
): JWTSigningConfig {
  if (isSymmetricSigningAlgorithm(algorithm)) {
    return createSymmetricSigningConfig(algorithm, secret);
  } else if (isAsymmetricSigningAlgorithm(algorithm)) {
    return createAsymmetricSigningConfig(algorithm, secret);
  }

  throw new AuthenticationError(`invalid algorithm=${algorithm} specified`);
}

export type SigningTokenOptions = Pick<
  SignOptions,
  "jwtid" | "audience" | "issuer" | "expiresIn" | "notBefore"
>;

export const signTokenString = async (
  { algorithm, secret }: JWTSigningConfig,
  user: Pick<User, "id">,
  tenant: Pick<Tenant, "id"> & {
    auth: Pick<Auth, "sessionDuration">;
  },
  options: SigningTokenOptions = {},
  now = new Date()
) =>
  jwt.sign(
    {
      iat: dateToSeconds(now),
    },
    secret,
    {
      jwtid: uuid(),
      expiresIn: tenant.auth.sessionDuration || DEFAULT_SESSION_DURATION,
      ...options,
      issuer: tenant.id,
      subject: user.id,
      algorithm,
    }
  );

export const signPATString = async (
  { algorithm, secret }: JWTSigningConfig,
  user: User,
  options: SigningTokenOptions,
  now = new Date()
) =>
  jwt.sign({ pat: true, iat: dateToSeconds(now) }, secret, {
    ...options,
    subject: user.id,
    algorithm,
  });

export async function signString<T extends {}>(
  { algorithm, secret }: JWTSigningConfig,
  payload: T,
  options: Omit<SignOptions, "algorithm"> = {}
) {
  return jwt.sign(payload, secret, { ...options, algorithm });
}

// NOTE: disabled cookie support due to ITP/First Party Cookie bugs
// /**
//  * COOKIE_NAME is the name of the authorization cookie used by Coral.
//  */
// export const COOKIE_NAME = "authorization";

/**
 * isExpressRequest will check to see if this is a Request or an
 * IncomingMessage.
 *
 * @param req a request to test if it is an Express Request or not.
 */
export function isExpressRequest(
  req: Request | IncomingMessage
): req is Request {
  // Only Express Request objects contain an `app` field.
  if (typeof (req as Request).app === "undefined") {
    return false;
  }

  return true;
}

// NOTE: disabled cookie support due to ITP/First Party Cookie bugs
// /**
//  * extractJWTFromRequestCookie will parse the cookies off of the request if it
//  * can.
//  *
//  * @param req the incoming request possibly containing a cookie
//  */
// function extractJWTFromRequestCookie(
//   req: Request | IncomingMessage
// ): string | null {
//   if (!isExpressRequest(req)) {
//     // Grab the cookie header.
//     const header = req.headers.cookie;
//     if (typeof header !== "string" || header.length === 0) {
//       return null;
//     }

//     // Parse the cookies from that header.
//     const cookies = cookie.parse(header);
//     return cookies[COOKIE_NAME] || null;
//   }

//   return req.cookies && req.cookies[COOKIE_NAME]
//     ? req.cookies[COOKIE_NAME]
//     : null;
// }

/**
 *
 * @param req the request to extract the JWT from
 * @param excludeQuery when true, does not pull from the query params
 */
function extractJWTFromRequestHeaders(
  req: Request | IncomingMessage,
  excludeQuery = false
) {
  const options: BearerOptions = {
    basic: "password",
  };

  if (!excludeQuery) {
    options.query = "accessToken";
  }

  const permit = new Bearer(options);

  return permit.check(req) || null;
}

/**
 * extractJWTFromRequest will extract the token from the request if it can find
 * it. It will try to extract the token from the headers.
 *
 * @param req the request to extract the JWT from
 * @param excludeQuery when true, does not pull from the query params
 */
export function extractTokenFromRequest(
  req: Request | IncomingMessage,
  excludeQuery = false
): string | null {
  // NOTE: disabled cookie support due to ITP/First Party Cookie bugs
  // return extractJWTFromRequestHeaders(req, excludeQuery)|| extractJWTFromRequestCookie(req)
  return extractJWTFromRequestHeaders(req, excludeQuery);
}

function generateJTIRevokedKey(jti: string) {
  // jtir: JTI Revoked namespace.
  return `jtir:${jti}`;
}

/**
 * revokeJWT will place the token into a blacklist until it expires.
 *
 * @param redis the Redis instance to revoke the JWT with
 * @param jti the JTI claim of the JWT token being revoked
 * @param exp time that the token expired at
 * @param now the current date
 */
export async function revokeJWT(
  redis: Redis,
  jti: string,
  exp: number,
  now = new Date()
) {
  const validFor = Math.round(
    DateTime.fromSeconds(exp).diff(DateTime.fromJSDate(now), "seconds").seconds
  );

  if (validFor > 0) {
    await redis.setex(
      generateJTIRevokedKey(jti),
      validFor,
      Math.round(DateTime.fromJSDate(now).toSeconds())
    );
  }
}

/**
 * isJWTRevoked will check to see if the given token referenced by the JWT has
 * been revoked or not.
 *
 * @param redis the Redis instance to check to see if the token was revoked
 * @param jti the JTI claim of the JWT token being tested
 */
export async function isJWTRevoked(redis: Redis, jti: string) {
  const expiredAtString = await redis.get(generateJTIRevokedKey(jti));
  if (expiredAtString) {
    return true;
  }

  return false;
}

/**
 * checkJWTRevoked will test the JWT's JTI to see if it's revoked, if it is, it
 * will throw an error.
 *
 * @param redis the Redis instance to check to see if the token was revoked
 * @param jti the JTI claim of the JWT token being tested
 */
export async function checkJWTRevoked(redis: Redis, jti: string) {
  if (await isJWTRevoked(redis, jti)) {
    throw new JWTRevokedError(jti);
  }
}

export function verifyJWT(
  tokenString: string,
  { algorithm, secret }: JWTVerifyingConfig,
  now: Date,
  options: Omit<VerifyOptions, "algorithms" | "clockTimestamp"> = {}
) {
  try {
    return jwt.verify(tokenString, secret, {
      ...options,
      algorithms: [algorithm],
      clockTimestamp: Math.floor(now.getTime() / 1000),
    }) as object;
  } catch (err) {
    throw new TokenInvalidError(
      tokenString,
      "token validation error",
      undefined,
      err
    );
  }
}

export function decodeJWT(tokenString: string) {
  try {
    return jwt.decode(tokenString, {}) as StandardClaims;
  } catch (err) {
    throw new TokenInvalidError(
      tokenString,
      "token validation error",
      undefined,
      err
    );
  }
}
