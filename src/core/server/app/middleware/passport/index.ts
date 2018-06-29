import { Db } from "mongodb";
import passport, { Authenticator } from "passport";

import { NextFunction, Response } from "express";
import OIDCStrategy, {
  Token,
  VerifyCallback,
} from "talk-server/app/middleware/passport/oidc";
import { GQLUSER_ROLE } from "talk-server/graph/tenant/schema/__generated__/types";
import { Tenant } from "talk-server/models/tenant";
import { create, retrieveWithProfile, User } from "talk-server/models/user";
import { Request } from "talk-server/types/express";

export interface PassportOptions {
  db: Db;
}

async function verifyOIDC(
  db: Db,
  tenant: Tenant,
  { iss, sub, email, email_verified }: Token,
  done: VerifyCallback
) {
  try {
    // Construct the profile that will be used to query for the user.
    const profile = {
      type: "oidc",
      provider: iss,
      id: sub,
    };

    // Try to lookup user given their id provided in the `sub` claim.
    let user = await retrieveWithProfile(db, tenant.id, profile);
    if (!user) {
      // FIXME: implement rules.

      // Create the new user, as one didn't exist before!
      user = await create(db, tenant.id, {
        username: null,
        role: GQLUSER_ROLE.COMMENTER,
        email,
        email_verified,
        profiles: [profile],
      });
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

export function createPassport({
  db,
}: PassportOptions): passport.Authenticator {
  // Create the authenticator.
  const auth = new Authenticator();

  // Process the OIDC Strategy.
  auth.use(new OIDCStrategy({ db }, verifyOIDC.bind(null, db)));

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
