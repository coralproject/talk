import { RequestHandler } from "express";
import { Db } from "mongodb";
import passport, { Authenticator } from "passport";

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
}

export function createPassport({
  db,
}: PassportOptions): passport.Authenticator {
  // Create the authenticator.
  const auth = new Authenticator();

  // Use the OIDC Strategy.
  auth.use(createOIDCStrategy({ db }));

  // Use the LocalStrategy.
  auth.use(createLocalStrategy({ db }));

  return auth;
}

export const handle = (
  err: Error | null,
  user: User | null
): RequestHandler => (req: Request, res, next) => {
  if (err) {
    // TODO: wrap error?
    return next(err);
  }

  // Set the cache control headers.
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");

  // Send back the details!

  // TODO: return the token instead of the user.
  res.json({ user });
};

export const authenticate = (
  authenticator: passport.Authenticator,
  name: string,
  options?: any
): RequestHandler => (req: Request, res, next) =>
  authenticator.authenticate(
    name,
    { ...options, session: false },
    (err: Error | null, user: User | null) => handle(err, user)(req, res, next)
  )(req, res, next);
