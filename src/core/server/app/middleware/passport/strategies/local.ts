import { Db } from "mongodb";
import { Strategy as LocalStrategy } from "passport-local";

import { Redis } from "ioredis";
import { VerifyCallback } from "talk-server/app/middleware/passport";
import { RequestLimiter } from "talk-server/app/request/limiter";
import { InvalidCredentialsError } from "talk-server/errors";
import {
  retrieveUserWithProfile,
  verifyUserPassword,
} from "talk-server/models/user";
import { Request } from "talk-server/types/express";

const verifyFactory = (
  mongo: Db,
  ipLimiter: RequestLimiter,
  emailLimiter: RequestLimiter
) => async (
  req: Request,
  email: string,
  password: string,
  done: VerifyCallback
) => {
  try {
    await ipLimiter.test(req, req.ip);
    await emailLimiter.test(req, email);

    // The tenant is guaranteed at this point.
    const tenant = req.talk!.tenant!;

    // Get the user from the database.
    const user = await retrieveUserWithProfile(mongo, tenant.id, {
      id: email,
      type: "local",
    });
    if (!user) {
      // The user didn't exist.
      return done(new InvalidCredentialsError("user not found"));
    }

    // Verify the password.
    const passwordVerified = await verifyUserPassword(user, password);
    if (!passwordVerified) {
      return done(new InvalidCredentialsError("invalid password"));
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

export interface LocalStrategyOptions {
  mongo: Db;
  redis: Redis;
}

export function createLocalStrategy({
  mongo,
  redis: client,
}: LocalStrategyOptions) {
  const ipLimiter = new RequestLimiter({
    client,
    ttl: "10m",
    max: 10,
    prefix: "ip",
  });
  const emailLimiter = new RequestLimiter({
    client,
    ttl: "10m",
    max: 10,
    prefix: "email",
  });

  return new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      session: false,
      passReqToCallback: true,
    },
    verifyFactory(mongo, ipLimiter, emailLimiter)
  );
}
