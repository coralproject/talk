import { RequestHandler } from "express";
import { Redis } from "ioredis";
import Joi from "joi";
import { Db } from "mongodb";

import {
  handleLogout,
  handleSuccessfulLogin,
} from "talk-server/app/middleware/passport";
import { validate } from "talk-server/app/request/body";
import { GQLUSER_ROLE } from "talk-server/graph/tenant/schema/__generated__/types";
import { LocalProfile } from "talk-server/models/user";
import { JWTSigningConfig } from "talk-server/services/jwt";
import { upsert } from "talk-server/services/users";
import { Request } from "talk-server/types/express";

export interface SignupBody {
  username: string;
  password: string;
  email: string;
}

export const SignupBodySchema = Joi.object().keys({
  username: Joi.string().trim(),
  password: Joi.string(),
  email: Joi.string()
    .trim()
    .lowercase()
    .email(),
});

export interface SignupOptions {
  db: Db;
  signingConfig: JWTSigningConfig;
}

export const signupHandler = (options: SignupOptions): RequestHandler => async (
  req: Request,
  res,
  next
) => {
  try {
    // TODO: rate limit based on the IP address and user agent.

    // Tenant is guaranteed at this point.
    const tenant = req.talk!.tenant!;

    // Check to ensure that the local integration has been enabled.
    if (!tenant.auth.integrations.local.enabled) {
      // TODO: replace with better error.
      return next(new Error("integration is disabled"));
    }

    if (!tenant.auth.integrations.local.allowRegistration) {
      // TODO: replace with better error.
      return next(new Error("registration is disabled"));
    }

    // Get the fields from the body. Validate will throw an error if the body
    // does not conform to the specification.
    const { username, password, email }: SignupBody = validate(
      SignupBodySchema,
      req.body
    );

    // Configure with profile.
    const profile: LocalProfile = {
      id: email,
      type: "local",
      password,
    };

    // Create the new user.
    const user = await upsert(options.db, tenant, {
      email,
      username,
      profiles: [profile],
      // New users signing up via local auth will have the commenter role to
      // start with.
      role: GQLUSER_ROLE.COMMENTER,
    });

    // Send off to the passport handler.
    return handleSuccessfulLogin(user, options.signingConfig, req, res, next);
  } catch (err) {
    return next(err);
  }
};

export interface LogoutOptions {
  redis: Redis;
}

export const logoutHandler = (options: LogoutOptions): RequestHandler => async (
  req: Request,
  res,
  next
) => {
  try {
    // TODO: rate limit based on the IP address and user agent.

    // Tenant is guaranteed at this point.
    const tenant = req.talk!.tenant!;

    // Check to ensure that the local integration has been enabled.
    if (!tenant.auth.integrations.local.enabled) {
      // TODO: replace with better error.
      return next(new Error("integration is disabled"));
    }

    // Get the user on the request.
    const user = req.user;
    if (!user) {
      return next(
        new Error("cannot logout when there is no user on the request")
      );
    }

    // Delegate to the logout handler.
    return handleLogout(options.redis, req, res);
  } catch (err) {
    return next(err);
  }
};
