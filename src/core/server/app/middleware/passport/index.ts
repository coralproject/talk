import Joi from "@hapi/joi";
import { NextFunction, Response } from "express";
import { Redis } from "ioredis";
import jwt from "jsonwebtoken";
import { container } from "tsyringe";

import { stringifyQuery } from "coral-common/utils";
import { validate } from "coral-server/app/request/body";
import { AuthenticationError } from "coral-server/errors";
import { User } from "coral-server/models/user";
import {
  extractTokenFromRequest,
  JWTSigningConfigService,
  revokeJWT,
  SigningConfig,
  signTokenString,
} from "coral-server/services/jwt";
import {
  Request,
  RequestHandler,
  TenantCoralRequest,
} from "coral-server/types/express";

import { AuthenticatorService } from "./service";

export type VerifyCallback = (
  err?: Error | null,
  user?: User | null,
  info?: { message: string }
) => void;

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
  signingConfig: SigningConfig,
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
  req: Request<TenantCoralRequest>,
  res: Response
) {
  const signingConfig = container.resolve(JWTSigningConfigService);

  const path = "/embed/auth/callback";
  if (!user) {
    if (!err) {
      // TODO: (wyattjoh) replace with better error
      err = new Error("user not on request");
    }

    return redirectWithHash(res, path, { error: err.message });
  }

  try {
    const { tenant, now } = req.coral;

    // Grab the token.
    const accessToken = await signTokenString(
      signingConfig,
      user,
      tenant,
      {},
      now
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
  name: string,
  options?: any
): RequestHandler<TenantCoralRequest> => {
  const authenticator = container.resolve(AuthenticatorService);

  return (req, res, next) =>
    authenticator.authenticate(
      name,
      { ...options, session: false },
      async (err: Error | null, user: User | null) => {
        try {
          await handleOAuth2Callback(err, user, req, res);
        } catch (e) {
          return next(e);
        }
      }
    )(req, res, next);
};

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
  name: string,
  options?: any
): RequestHandler<TenantCoralRequest> => {
  const authenticator = container.resolve(AuthenticatorService);
  const signingConfig = container.resolve(JWTSigningConfigService);

  return (req, res, next) =>
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
};

/**
 * authenticate will wrap the authenticator to forward any error to the error
 * handler from ExpressJS.
 *
 * @param authenticator the authenticator to use
 */
export const authenticate = (): RequestHandler<TenantCoralRequest> => {
  const authenticator = container.resolve(AuthenticatorService);

  return (req, res, next) =>
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
};
