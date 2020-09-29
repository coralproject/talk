import Joi from "@hapi/joi";
import { Strategy } from "passport-local";
import { inject, singleton } from "tsyringe";

import { VerifyCallback } from "coral-server/app/middleware/passport";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { CONFIG, Config } from "coral-server/config";
import { InvalidCredentialsError } from "coral-server/errors";
import {
  retrieveUserWithProfile,
  verifyUserPassword,
} from "coral-server/models/user";
import { Mongo, MONGO } from "coral-server/services/mongodb";
import { REDIS, Redis } from "coral-server/services/redis";
import { Request, TenantCoralRequest } from "coral-server/types/express";

@singleton()
export default class LocalStrategy extends Strategy {
  private readonly ipLimiter: RequestLimiter;
  private readonly emailLimiter: RequestLimiter;

  constructor(
    @inject(MONGO) private readonly mongo: Mongo,
    @inject(CONFIG) config: Config,
    @inject(REDIS) redis: Redis
  ) {
    super(
      {
        usernameField: "email",
        passwordField: "password",
        session: false,
        passReqToCallback: true,
      },
      (req, email, password, done) =>
        this.verify(req as Request<TenantCoralRequest>, email, password, done)
    );

    this.ipLimiter = new RequestLimiter({
      redis,
      ttl: "10m",
      max: 10,
      prefix: "ip",
      config,
    });
    this.emailLimiter = new RequestLimiter({
      redis,
      ttl: "10m",
      max: 10,
      prefix: "email",
      config,
    });
  }

  public async verify(
    req: Request<TenantCoralRequest>,
    emailInput: string,
    passwordInput: string,
    done: VerifyCallback
  ) {
    try {
      // Validate that the email address and password are reasonable.
      const email = Joi.attempt(
        emailInput,
        Joi.string().trim().lowercase().email()
      );
      const password = Joi.attempt(passwordInput, Joi.string());

      await this.ipLimiter.test(req, req.ip);
      await this.emailLimiter.test(req, email);

      const { tenant } = req.coral;

      // Get the user from the database.
      const user = await retrieveUserWithProfile(this.mongo, tenant.id, {
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
  }
}
