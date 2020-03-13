import { CookieOptions, NextFunction, RequestHandler, Response } from "express";
import { Redis } from "ioredis";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { DateTime } from "luxon";
import passport, { Authenticator } from "passport";

import { stringifyQuery } from "coral-common/utils";
import { AppOptions } from "coral-server/app";
import FacebookStrategy from "coral-server/app/middleware/passport/strategies/facebook";
import GoogleStrategy from "coral-server/app/middleware/passport/strategies/google";
import { JWTStrategy } from "coral-server/app/middleware/passport/strategies/jwt";
import { createLocalStrategy } from "coral-server/app/middleware/passport/strategies/local";
import OIDCStrategy from "coral-server/app/middleware/passport/strategies/oidc";
import { validate } from "coral-server/app/request/body";
import { AuthenticationError } from "coral-server/errors";
import { User } from "coral-server/models/user";
import {
  COOKIE_NAME,
  extractTokenFromRequest,
  JWTSigningConfig,
  revokeJWT,
  signTokenString,
} from "coral-server/services/jwt";
import { Request } from "coral-server/types/express";

export type VerifyCallback = (
  err?: Error | null,
  user?: User | null,
  info?: { message: string }
) => void;

export type PassportOptions = Pick<
  AppOptions,
  "mongo" | "redis" | "config" | "tenantCache" | "signingConfig"
>;

export function createPassport(
  options: PassportOptions
): passport.Authenticator {
  // Create the authenticator.
  const auth = new Authenticator();

  // Use the LocalStrategy.
  auth.use(createLocalStrategy(options));

  // Use the OIDC Strategy.
  auth.use(new OIDCStrategy(options));

  // Use the SSOStrategy.
  auth.use(new JWTStrategy(options));

  // Use the FacebookStrategy.
  auth.use(new FacebookStrategy(options));

  // Use the GoogleStrategy.
  auth.use(new GoogleStrategy(options));

  return auth;
}

interface LogoutToken {
  jti?: string;
  exp?: number;
}

const LogoutTokenSchema = Joi.object()
  .keys({
    jti: Joi.string().default(undefined),
    exp: Joi.number().default(undefined),
  })
  .optionalKeys(["jti", "exp"]);

export async function handleLogout(redis: Redis, req: Request, res: Response) {
  // Extract the token from the request.
  const token = extractTokenFromRequest(req);
  if (!token) {
    // No token on the request, indicate that this was successful.
    return res.sendStatus(204);
  }

  // Coral is guaranteed at this point.
  const { now } = req.coral!;

  // Decode the token.
  const decoded = jwt.decode(token, {});
  if (!decoded) {
    // Invalid token on request, indicate that this was successful.
    return res.sendStatus(204);
  }

  // Grab the JTI from the decoded token.
  const { jti, exp }: LogoutToken = validate(LogoutTokenSchema, decoded);
  if (jti && exp) {
    // Invalidate the token, the expiry is in the future and it needs to be
    // revoked.
    await revokeJWT(redis, jti, exp, now);
  }

  // Clear the cookie.
  res.clearCookie(COOKIE_NAME, generateCookieOptions(req, new Date(0)));

  return res.sendStatus(204);
}

export async function handleSuccessfulLogin(
  user: User,
  signingConfig: JWTSigningConfig,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Coral is guaranteed at this point.
    const coral = req.coral!;

    // Tenant is guaranteed at this point.
    const tenant = coral.tenant!;

    // Compute the expiry date.
    const expiresIn = DateTime.fromJSDate(coral.now).plus({
      seconds: tenant.auth.sessionDuration,
    });

    // Grab the token.
    const token = await signTokenString(
      signingConfig,
      user,
      tenant,
      {},
      coral.now
    );

    // Set the cache control headers.
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
    res.cookie(
      COOKIE_NAME,
      token,
      generateCookieOptions(req, expiresIn.toJSDate())
    );

    // Send back the details!
    res.json({ token });
  } catch (err) {
    return next(err);
  }
}

const generateCookieOptions = (
  req: Request,
  expiresIn: Date
): CookieOptions => ({
  path: "/api",
  httpOnly: true,
  secure: req.secure,
  // Chrome will ignore `SameSite: None` when not used in a secure context
  // anyways, so don't bother setting `None` when we're not secure. The only
  // time we aren't behind HTTPS is when we're testing/in development where the
  // the setting for `SameSite: Lax` would be OK.
  sameSite: req.secure ? "None" : "Lax",
  expires: expiresIn,
});

function redirectWithHash(
  res: Response,
  path: string,
  hash: Record<string, any>
) {
  res.redirect(`${path}${stringifyQuery(hash, "#")}`);
}

export async function handleOAuth2Callback(
  err: Error | null,
  user: User | null,
  signingConfig: JWTSigningConfig,
  req: Request,
  res: Response
) {
  const path = "/embed/auth/callback";
  if (!user) {
    if (!err) {
      // TODO: (wyattjoh) replace with better error
      err = new Error("user not on request");
    }

    return redirectWithHash(res, path, { error: err.message });
  }

  try {
    // Tenant is guaranteed at this point.
    const coral = req.coral!;
    const tenant = coral.tenant!;

    // Compute the expiry date.
    const expiresIn = DateTime.fromJSDate(coral.now).plus({
      seconds: tenant.auth.sessionDuration,
    });

    // Grab the token.
    const accessToken = await signTokenString(
      signingConfig,
      user,
      tenant,
      {},
      coral.now
    );
    res.cookie(
      COOKIE_NAME,
      accessToken,
      generateCookieOptions(req, expiresIn.toJSDate())
    );

    // Send back the details!
    return redirectWithHash(res, path, { accessToken });
  } catch (e) {
    return redirectWithHash(res, path, { error: e.message });
  }
}

/**
 * wrapCallbackAuthn will wrap a authenticators authenticate method with one that
 * will render a redirect script for a valid login by a compatible strategy.
 *
 * @param authenticator the base authenticator instance
 * @param signingConfig used to sign the tokens that are issued.
 * @param name the name of the authenticator to use
 * @param options any options to be passed to the authenticate call
 */
export const wrapOAuth2Authn = (
  authenticator: passport.Authenticator,
  signingConfig: JWTSigningConfig,
  name: string,
  options?: any
): RequestHandler => (req: Request, res, next) =>
  authenticator.authenticate(
    name,
    { ...options, session: false },
    async (err: Error | null, user: User | null) => {
      try {
        await handleOAuth2Callback(err, user, signingConfig, req, res);
      } catch (e) {
        return next(e);
      }
    }
  )(req, res, next);

/**
 * wrapAuthn will wrap a authenticators authenticate method with one that
 * will return a valid login token for a valid login by a compatible strategy.
 *
 * @param authenticator the base authenticator instance
 * @param signingConfig used to sign the tokens that are issued.
 * @param name the name of the authenticator to use
 * @param options any options to be passed to the authenticate call
 */
export const wrapAuthn = (
  authenticator: passport.Authenticator,
  signingConfig: JWTSigningConfig,
  name: string,
  options?: any
): RequestHandler => (req: Request, res, next) =>
  authenticator.authenticate(
    name,
    { ...options, session: false },
    async (err: Error | null, user: User | null) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new AuthenticationError("user not on request"));
      }

      try {
        // Pass the login off to be signed.
        await handleSuccessfulLogin(user, signingConfig, req, res, next);
      } catch (e) {
        return next(e);
      }
    }
  )(req, res, next);

/**
 * authenticate will wrap the authenticator to forward any error to the error
 * handler from ExpressJS.
 *
 * @param authenticator the authenticator to use
 */
export const authenticate = (
  authenticator: passport.Authenticator
): RequestHandler => (req, res, next) =>
  authenticator.authenticate(
    "jwt",
    { session: false },
    (err: Error | null, user: User | null) => {
      if (err) {
        return next(err);
      }

      // Attach the user to the request.
      if (user) {
        req.user = user;
      }

      return next();
    }
  )(req, res, next);
