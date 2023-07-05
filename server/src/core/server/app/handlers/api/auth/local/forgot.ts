import Joi from "joi";

import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { IntegrationDisabled } from "coral-server/errors";
import { hasEnabledAuthIntegration } from "coral-server/models/tenant";
import { retrieveUserWithProfile } from "coral-server/models/user";
import { decodeJWT, extractTokenFromRequest } from "coral-server/services/jwt";
import {
  generateResetURL,
  resetPassword,
  verifyResetTokenString,
} from "coral-server/services/users/auth";
import { validateEmail } from "coral-server/services/users/helpers";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

export interface ForgotBody {
  email: string;
}

export const ForgotBodySchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().email(),
});

export type ForgotOptions = Pick<
  AppOptions,
  "mongo" | "signingConfig" | "mailerQueue" | "redis" | "config"
>;

export const forgotHandler = ({
  config,
  redis,
  mongo,
  signingConfig,
  mailerQueue,
}: ForgotOptions): RequestHandler<TenantCoralRequest> => {
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
    max: 1,
    prefix: "email",
    config,
  });

  return async (req, res, next) => {
    try {
      // Limit based on the IP address.
      await ipLimiter.test(req, req.ip);

      const { tenant, logger, now } = req.coral;

      // Check to ensure that the local integration has been enabled.
      if (!hasEnabledAuthIntegration(config, tenant, "local")) {
        throw new IntegrationDisabled("local");
      }

      // Get the fields from the body. Validate will throw an error if the body
      // does not conform to the specification.
      const { email }: ForgotBody = validate(ForgotBodySchema, req.body);

      // Validate the email address. This will ensure that if we end up rate
      // limiting based on it, it isn't too long.
      validateEmail(email);

      // Limit based on the email address.
      await emailLimiter.test(req, email);

      const log = logger.child(
        {
          email,
          tenantID: tenant.id,
        },
        true
      );

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
        now
      );

      // Add the email to the processing queue.
      await mailerQueue.add({
        template: {
          name: "account-notification/forgot-password",
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
  "mongo" | "signingConfig" | "mailerQueue" | "redis" | "config"
>;

export const forgotResetHandler = ({
  redis,
  mongo,
  signingConfig,
  config,
}: ForgotResetOptions): RequestHandler<TenantCoralRequest> => {
  const ipLimiter = new RequestLimiter({
    redis,
    ttl: "10m",
    max: 10,
    prefix: "ip",
    config,
  });
  const subLimiter = new RequestLimiter({
    redis,
    ttl: "5m",
    max: 10,
    prefix: "sub",
    config,
  });

  return async (req, res, next) => {
    try {
      // Rate limit based on the IP address and user agent.
      await ipLimiter.test(req, req.ip);

      const { tenant, now } = req.coral;

      // Check to ensure that the local integration has been enabled.
      if (!hasEnabledAuthIntegration(config, tenant, "local")) {
        throw new IntegrationDisabled("local");
      }

      // Get the fields from the body. Validate will throw an error if the body
      // does not conform to the specification.
      const { password }: ForgotResetBody = validate(
        ForgotResetBodySchema,
        req.body
      );

      // Grab the token from the request.
      const tokenString = extractTokenFromRequest(req, true);
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
        now
      );

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};

export type ForgotCheckOptions = Pick<
  AppOptions,
  "mongo" | "signingConfig" | "redis" | "config"
>;

export const forgotCheckHandler = ({
  redis,
  mongo,
  signingConfig,
  config,
}: ForgotCheckOptions): RequestHandler<TenantCoralRequest> => {
  const ipLimiter = new RequestLimiter({
    redis,
    ttl: "10m",
    max: 100,
    prefix: "ip",
    config,
  });
  const subLimiter = new RequestLimiter({
    redis,
    ttl: "5m",
    max: 100,
    prefix: "sub",
    config,
  });

  return async (req, res, next) => {
    try {
      // Rate limit based on the IP address and user agent.
      await ipLimiter.test(req, req.ip);

      const { tenant, now } = req.coral;

      // Check to ensure that the local integration has been enabled.
      if (!hasEnabledAuthIntegration(config, tenant, "local")) {
        throw new IntegrationDisabled("local");
      }

      // Grab the token from the request.
      const tokenString = extractTokenFromRequest(req, true);
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
        now
      );

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
