import Joi from "joi";

import { AppOptions } from "talk-server/app";
import { validate } from "talk-server/app/request/body";
import { RequestLimiter } from "talk-server/app/request/limiter";
import { IntegrationDisabled, URLInvalidError } from "talk-server/errors";
import { retrieveUserWithProfile } from "talk-server/models/user";
import { decodeJWT, extractJWTFromRequest } from "talk-server/services/jwt";
import { isURLPermitted } from "talk-server/services/tenant/url";
import {
  generateResetURL,
  resetPassword,
  verifyResetTokenString,
} from "talk-server/services/users/auth";
import { validateEmail } from "talk-server/services/users/helpers";
import { RequestHandler } from "talk-server/types/express";

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
  "mongo" | "signingConfig" | "mailerQueue" | "redis" | "config"
>;

export const forgotHandler = ({
  config,
  redis: client,
  mongo,
  signingConfig,
  mailerQueue,
}: ForgotOptions): RequestHandler => {
  const ipLimiter = new RequestLimiter({
    client,
    ttl: "10m",
    max: 10,
    prefix: "ip",
  });
  const emailLimiter = new RequestLimiter({
    client,
    ttl: "10m",
    max: 1,
    prefix: "email",
  });

  return async (req, res, next) => {
    try {
      // Limit based on the IP address.
      await ipLimiter.test(req, req.ip);

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

      // Validate the email address. This will ensure that if we end up rate
      // limiting based on it, it isn't too long.
      validateEmail(email);

      // Limit based on the email address.
      await emailLimiter.test(req, email);

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
        config,
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
};

export interface ForgotResetBody {
  password: string;
}

export const ForgotResetBodySchema = Joi.object().keys({
  password: Joi.string(),
});

export type ForgotResetOptions = Pick<
  AppOptions,
  "mongo" | "signingConfig" | "mailerQueue" | "redis"
>;

export const forgotResetHandler = ({
  redis: client,
  mongo,
  signingConfig,
}: ForgotResetOptions): RequestHandler => {
  const ipLimiter = new RequestLimiter({
    client,
    ttl: "10m",
    max: 10,
    prefix: "ip",
  });
  const subLimiter = new RequestLimiter({
    client,
    ttl: "5m",
    max: 10,
    prefix: "sub",
  });

  return async (req, res, next) => {
    try {
      // Rate limit based on the IP address and user agent.
      await ipLimiter.test(req, req.ip);

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

      // Decode the token so we can rate limit based on the user's ID.
      const { sub } = decodeJWT(tokenString);
      if (sub) {
        await subLimiter.test(req, sub);
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
};

export type ForgotCheckOptions = Pick<
  AppOptions,
  "mongo" | "signingConfig" | "redis"
>;

export const forgotCheckHandler = ({
  redis: client,
  mongo,
  signingConfig,
}: ForgotCheckOptions): RequestHandler => {
  const ipLimiter = new RequestLimiter({
    client,
    ttl: "10m",
    max: 10,
    prefix: "ip",
  });
  const subLimiter = new RequestLimiter({
    client,
    ttl: "5m",
    max: 10,
    prefix: "sub",
  });

  return async (req, res, next) => {
    try {
      // Rate limit based on the IP address and user agent.
      await ipLimiter.test(req, req.ip);

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

      // Decode the token so we can rate limit based on the user's ID.
      const { sub } = decodeJWT(tokenString);
      if (sub) {
        await subLimiter.test(req, sub);
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
};
