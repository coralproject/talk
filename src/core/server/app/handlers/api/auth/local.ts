import Joi from "joi";

import { AppOptions } from "talk-server/app";
import {
  handleLogout,
  handleSuccessfulLogin,
} from "talk-server/app/middleware/passport";
import { validate } from "talk-server/app/request/body";
import { IntegrationDisabled, URLInvalidError } from "talk-server/errors";
import { GQLUSER_ROLE } from "talk-server/graph/tenant/schema/__generated__/types";
import { LocalProfile, retrieveUserWithProfile } from "talk-server/models/user";
import { extractJWTFromRequest } from "talk-server/services/jwt";
import { isURLPermitted } from "talk-server/services/tenant/url";
import { insert } from "talk-server/services/users";
import {
  generateResetURL,
  resetPassword,
  verifyResetTokenString,
} from "talk-server/services/users/auth";
import { RequestHandler } from "talk-server/types/express";

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

export type SignupOptions = Pick<
  AppOptions,
  "mongo" | "signingConfig" | "mailerQueue"
>;

export const signupHandler = ({
  mongo,
  signingConfig,
  mailerQueue,
}: SignupOptions): RequestHandler => async (req, res, next) => {
  try {
    // TODO: rate limit based on the IP address and user agent.

    // Tenant is guaranteed at this point.
    const tenant = req.talk!.tenant!;
    const now = req.talk!.now;

    // Check to ensure that the local integration has been enabled.
    if (!tenant.auth.integrations.local.enabled) {
      throw new IntegrationDisabled("local");
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
    const user = await insert(
      mongo,
      mailerQueue,
      tenant,
      {
        email,
        username,
        profiles: [profile],
        // New users signing up via local auth will have the commenter role to
        // start with.
        role: GQLUSER_ROLE.COMMENTER,
      },
      now
    );

    // Send off to the passport handler.
    return handleSuccessfulLogin(user, signingConfig, req, res, next);
  } catch (err) {
    return next(err);
  }
};

export type LogoutOptions = Pick<AppOptions, "redis">;

export const logoutHandler = ({
  redis,
}: LogoutOptions): RequestHandler => async (req, res, next) => {
  try {
    // Tenant is guaranteed at this point.
    const tenant = req.talk!.tenant!;

    // Check to ensure that the local integration has been enabled.
    if (!tenant.auth.integrations.local.enabled) {
      throw new IntegrationDisabled("local");
    }

    // Get the user on the request.
    const user = req.user;
    if (!user) {
      // If a user is already logged out, then there's no need to do it again!
      return res.sendStatus(204);
    }

    // Delegate to the logout handler.
    return handleLogout(redis, req, res);
  } catch (err) {
    return next(err);
  }
};

export interface ForgotBody {
  email: string;
  redirectURI: string;
}

export const ForgotBodySchema = Joi.object().keys({
  email: Joi.string()
    .trim()
    .lowercase()
    .email(),
  redirectURI: Joi.string().uri(),
});

export type ForgotOptions = Pick<
  AppOptions,
  "mongo" | "signingConfig" | "mailerQueue"
>;

export const forgotHandler = ({
  mongo,
  signingConfig,
  mailerQueue,
}: ForgotOptions): RequestHandler => async (req, res, next) => {
  try {
    // TODO: rate limit based on the IP address and user agent.
    // TODO: rate limit based on the email address.

    // Tenant is guaranteed at this point.
    const talk = req.talk!;
    const tenant = talk.tenant!;

    // Check to ensure that the local integration has been enabled.
    if (!tenant.auth.integrations.local.enabled) {
      throw new IntegrationDisabled("local");
    }

    // Get the fields from the body. Validate will throw an error if the body
    // does not conform to the specification.
    const { email, redirectURI }: ForgotBody = validate(
      ForgotBodySchema,
      req.body
    );

    // Validate the redirectURI is within the tenant scope. We also need to
    // validate against the tenant's domain to ensure that if the redirect uri
    // provided is for an internal route (such as the administrative login
    // versus an article page).
    if (!isURLPermitted(tenant, redirectURI, true)) {
      throw new URLInvalidError({
        url: redirectURI,
        tenantDomain: tenant.domain,
        tenantDomains: tenant.domains,
      });
    }

    const log = talk.logger.child({
      email,
      tenantID: tenant.id,
      redirectURI,
    });

    // Lookup the user.
    const user = await retrieveUserWithProfile(mongo, tenant.id, {
      id: email,
      type: "local",
    });
    if (!user) {
      // No user, therefore we don't have to send anything!.
      // TODO: (wyattjoh) delay the response to avoid timing attacks.
      log.warn("attempted password forgot for user that wasn't found");
      return res.sendStatus(204);
    }

    // Prepare the email content to send to the user.
    const resetURL = await generateResetURL(
      mongo,
      tenant,
      signingConfig,
      user,
      redirectURI,
      req.talk!.now
    );

    // Add the email to the processing queue.
    await mailerQueue.add({
      template: {
        name: "forgot-password",
        context: {
          resetURL,
          // TODO: (wyattjoh) possibly reevaluate the use of a required username.
          username: user.username!,
          organizationName: tenant.organization.name,
          organizationURL: tenant.organization.url,
        },
      },
      tenantID: tenant.id,
      message: {
        to: email,
      },
    });

    log.trace("sent forgotten password email with token");

    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};

export interface ForgotResetBody {
  password: string;
}

export const ForgotResetBodySchema = Joi.object().keys({
  password: Joi.string(),
});

export type ForgotResetOptions = Pick<
  AppOptions,
  "mongo" | "signingConfig" | "mailerQueue"
>;

export const forgotResetHandler = ({
  mongo,
  signingConfig,
  mailerQueue,
}: ForgotResetOptions): RequestHandler => async (req, res, next) => {
  try {
    // TODO: rate limit based on the IP address and user agent.
    // TODO: rate limit based on the `sub` + `iss` claims.

    // Tenant is guaranteed at this point.
    const talk = req.talk!;
    const tenant = talk.tenant!;

    // Check to ensure that the local integration has been enabled.
    if (!tenant.auth.integrations.local.enabled) {
      throw new IntegrationDisabled("local");
    }

    // Get the fields from the body. Validate will throw an error if the body
    // does not conform to the specification.
    const { password }: ForgotResetBody = validate(
      ForgotResetBodySchema,
      req.body
    );

    // Grab the token from the request.
    const tokenString = extractJWTFromRequest(req, true);
    if (!tokenString) {
      return res.sendStatus(400);
    }

    // Execute the reset.
    await resetPassword(
      mongo,
      tenant,
      signingConfig,
      tokenString,
      password,
      talk.now
    );

    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};

export type ForgotCheckOptions = Pick<AppOptions, "mongo" | "signingConfig">;

export const forgotCheckHandler = ({
  mongo,
  signingConfig,
}: ForgotCheckOptions): RequestHandler => async (req, res, next) => {
  try {
    // TODO: rate limit based on the IP address and user agent.
    // TODO: rate limit based on the `sub` + `iss` claims.

    // Tenant is guaranteed at this point.
    const talk = req.talk!;
    const tenant = talk.tenant!;

    // Check to ensure that the local integration has been enabled.
    if (!tenant.auth.integrations.local.enabled) {
      throw new IntegrationDisabled("local");
    }

    // Grab the token from the request.
    const tokenString = extractJWTFromRequest(req, true);
    if (!tokenString) {
      return res.sendStatus(400);
    }

    // Verify the token.
    await verifyResetTokenString(
      mongo,
      tenant,
      signingConfig,
      tokenString,
      talk.now
    );

    return res.sendStatus(204);
  } catch (err) {
    return next(err);
  }
};
