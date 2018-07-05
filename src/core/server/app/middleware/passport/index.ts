import { NextFunction, Response } from "express";
import { Db } from "mongodb";
import passport, { Authenticator } from "passport";

import { createLocalStrategy } from "talk-server/app/middleware/passport/local";
import { createOIDCStrategy } from "talk-server/app/middleware/passport/oidc";
import { User } from "talk-server/models/user";
import { Request } from "talk-server/types/express";

export type VerifyCallback = (
  err?: Error | null,
  user?: User | null,
  info?: object
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

export const authenticate = (
  authenticator: passport.Authenticator,
  name: string
) => (req: Request, res: Response, next: NextFunction) =>
  authenticator.authenticate(
    name,
    { session: false },
    (err: Error | null, user: User | null) => {
      if (err) {
        // TODO: wrap error?
        return next(err);
      }

      // Set the cache control headers.
      res.header(
        "Cache-Control",
        "private, no-cache, no-store, must-revalidate"
      );
      res.header("Expires", "-1");
      res.header("Pragma", "no-cache");

      // Send back the details!
      res.json({ user });
    }
  )(req, res, next);
