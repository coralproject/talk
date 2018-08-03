import { Db } from "mongodb";
import { Strategy as LocalStrategy } from "passport-local";

import { VerifyCallback } from "talk-server/app/middleware/passport";
import {
  retrieveUserWithProfile,
  verifyUserPassword,
} from "talk-server/models/user";
import { Request } from "talk-server/types/express";

const verifyFactory = (db: Db) => async (
  req: Request,
  email: string,
  password: string,
  done: VerifyCallback
) => {
  try {
    // TODO: rate limit based on the IP address and user agent.

    // The tenant is guaranteed at this point.
    const tenant = req.tenant!;

    // Get the user from the database.
    const user = await retrieveUserWithProfile(db, tenant.id, {
      id: email,
      type: "local",
    });
    if (!user) {
      // The user didn't exist.
      return done(null, null);
    }

    // Verify the password.
    const passwordVerified = await verifyUserPassword(user, password);
    if (!passwordVerified) {
      // TODO: return better error
      return done(new Error("invalid password"));
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

export interface LocalStrategyOptions {
  db: Db;
}

export function createLocalStrategy({ db }: LocalStrategyOptions) {
  return new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
      passReqToCallback: true,
    },
    verifyFactory(db)
  );
}
