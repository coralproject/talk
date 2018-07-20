import { NextFunction, RequestHandler, Response } from "express";
import { Db } from "mongodb";
import passport, { Authenticator } from "passport";

import {
  createJWTStrategy,
  JWTSigningConfig,
  SigningTokenOptions,
  signTokenString,
} from "talk-server/app/middleware/passport/jwt";
import { createLocalStrategy } from "talk-server/app/middleware/passport/local";
import { createOIDCStrategy } from "talk-server/app/middleware/passport/oidc";
import { User } from "talk-server/models/user";
import { Request } from "talk-server/types/express";

export type VerifyCallback = (
  err?: Error | null,
  user?: User | null,
  info?: { message: string }
) => void;

export interface PassportOptions {
  db: Db;
  signingConfig: JWTSigningConfig;
}

export function createPassport({
  db,
  signingConfig,
}: PassportOptions): passport.Authenticator {
  // Create the authenticator.
  const auth = new Authenticator();

  // Use the OIDC Strategy.
  auth.use(createOIDCStrategy({ db }));

  // Use the LocalStrategy.
  auth.use(createLocalStrategy({ db }));

  // Use the JWTStrategy.
  auth.use(createJWTStrategy({ db, signingConfig }));

  return auth;
}

export async function handleSuccessfulLogin(
  user: User,
  signingConfig: JWTSigningConfig,
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // Grab the tenant from the request.
    const { tenant } = req;

    const options: SigningTokenOptions = {};

    if (tenant) {
      // Attach the tenant's id to the issued token as a `iss` claim.
      options.issuer = tenant.id;

      // TODO: (wyattjoh) evaluate the possibility when we have multiple
      // integrations per type to use the integration id as the audience.
    }

    // Grab the token.
    const token = await signTokenString(signingConfig, user, options);

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
 * wrapAuthz will wrap a authenticators authenticate method with one that
 * will return a valid login token for a valid login by a compatible strategy.
 *
 * @param authenticator the base authenticator instance
 * @param signingConfig used to sign the tokens that are issued.
 * @param name the name of the authenticator to use
 * @param options any options to be passed to the authenticate call
 */
export const wrapAuthz = (
  authenticator: passport.Authenticator,
  signingConfig: JWTSigningConfig,
  name: string,
  options?: any
): RequestHandler => (req: Request, res, next) =>
  authenticator.authenticate(
    name,
    { ...options, session: false },
    (err: Error | null, user: User | null) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        // TODO: (wyattjoh) replace with better error.
        return next(new Error("no user on request"));
      }

      handleSuccessfulLogin(user, signingConfig, req, res, next);
    }
  )(req, res, next);
