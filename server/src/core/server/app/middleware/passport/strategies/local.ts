import { Redis } from "ioredis";
import Joi from "joi";
import { Strategy as LocalStrategy } from "passport-local";

import { VerifyCallback } from "coral-server/app/middleware/passport";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { Config } from "coral-server/config";
import { MongoContext } from "coral-server/data/context";
import { InvalidCredentialsError } from "coral-server/errors";
import {
  retrieveUserWithProfile,
  verifyUserPassword,
} from "coral-server/models/user";
import { Request, TenantCoralRequest } from "coral-server/types/express";

const verifyFactory =
  (
    mongo: MongoContext,
    ipLimiter: RequestLimiter,
    emailLimiter: RequestLimiter
  ) =>
  async (
    req: Request<TenantCoralRequest>,
    emailInput: string,
    passwordInput: string,
    done: VerifyCallback
  ) => {
    try {
      // Validate that the email address and password are reasonable.
      const email: string = Joi.attempt(
        emailInput,
        Joi.string().trim().lowercase().email()
      );
      const password: string = Joi.attempt(passwordInput, Joi.string());

      await ipLimiter.test(req, req.ip);
      await emailLimiter.test(req, email);

      const { tenant } = req.coral;

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
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      return done(err);
    }
  };

export interface LocalStrategyOptions {
  mongo: MongoContext;
  redis: Redis;
  config: Config;
}

export function createLocalStrategy({
  mongo,
  redis,
  config,
}: LocalStrategyOptions) {
  const ipLimiter = new RequestLimiter({
    redis,
    ttl: "10m",
    max: 10,
    prefix: "ip",
    config,
  });
  const emailLimiter = new RequestLimiter({
    redis,
    ttl: "10m",
    max: 10,
    prefix: "email",
    config,
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
