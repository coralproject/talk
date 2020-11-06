import { NextFunction, Response } from "express";
import { Redis } from "ioredis";
import Joi from "joi";
import jwt from "jsonwebtoken";
import passport, { Authenticator } from "passport";

import { AppOptions } from "coral-server/app";
import { JWTStrategy } from "coral-server/app/middleware/passport/strategies/jwt";
import { createLocalStrategy } from "coral-server/app/middleware/passport/strategies/local";
import { validate } from "coral-server/app/request/body";
import { AuthenticationError } from "coral-server/errors";
import { User } from "coral-server/models/user";
import {
  extractTokenFromRequest,
  JWTSigningConfig,
  revokeJWT,
  signTokenString,
} from "coral-server/services/jwt";
import {
  Request,
  RequestHandler,
  TenantCoralRequest,
} from "coral-server/types/express";

export type VerifyCallback = (
  err?: Error | null,
  user?: User | null,
  info?: { message: string }
) => void;

type Options = Pick<
  AppOptions,
  "mongo" | "redis" | "config" | "tenantCache" | "signingConfig"
>;

export function createPassport(options: Options): passport.Authenticator {
  // Create the authenticator.
  const auth = new Authenticator();

  // Use the LocalStrategy.
  auth.use(createLocalStrategy(options));

  // Use the SSOStrategy.
  auth.use(new JWTStrategy(options));

  return auth;
}

interface LogoutToken {
  jti?: string;
  exp?: number;
}

const LogoutTokenSchema = Joi.object().keys({
  jti: Joi.string().optional(),
  exp: Joi.number().optional(),
});

export async function handleLogout(
  redis: Redis,
  req: Request<TenantCoralRequest>,
  res: Response
) {
  // Extract the token from the request.
  const token = extractTokenFromRequest(req);
  if (!token) {
    // No token on the request, indicate that this was successful.
    return res.sendStatus(204);
  }

  const { now } = req.coral;

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

  // NOTE: disabled cookie support due to ITP/First Party Cookie bugs
  // // Clear the cookie.
  // res.clearCookie(COOKIE_NAME, generateCookieOptions(req, new Date(0)));

  return res.sendStatus(204);
}

export async function handleSuccessfulLogin(
  user: User,
  signingConfig: JWTSigningConfig,
  req: Request<TenantCoralRequest>,
  res: Response,
  next: NextFunction
) {
  try {
    const { tenant, now } = req.coral;

    // Grab the token.
    const token = await signTokenString(signingConfig, user, tenant, {}, now);

    // Set the cache control headers.
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");

    // Send back the details!
    res.json({ token });
  } catch (err) {
    return next(err);
  }
}

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
): RequestHandler<TenantCoralRequest> => (req, res, next) =>
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
): RequestHandler<TenantCoralRequest> => (req, res, next) =>
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
