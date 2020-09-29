import Joi from "@hapi/joi";
import { container } from "tsyringe";

import { validate } from "coral-server/app/request/body";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { CONFIG, Config } from "coral-server/config";
import {
  AuthenticationError,
  UserForbiddenError,
  UserNotFoundError,
} from "coral-server/errors";
import { retrieveUser, User } from "coral-server/models/user";
import { MailerQueue } from "coral-server/queue/tasks";
import {
  decodeJWT,
  extractTokenFromRequest,
  JWTSigningConfigService,
} from "coral-server/services/jwt";
import { Mongo, MONGO } from "coral-server/services/mongodb";
import { REDIS, Redis } from "coral-server/services/redis";
import {
  confirmEmail,
  sendConfirmationEmail,
  verifyConfirmTokenString,
} from "coral-server/services/users/auth/confirm";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

export interface ConfirmRequestBody {
  userID?: string;
}

export const ConfirmRequestBodySchema = Joi.object().keys({
  userID: Joi.string().optional(),
});

export const confirmRequestHandler = (): RequestHandler<TenantCoralRequest> => {
  // TODO: Replace with DI.
  const config = container.resolve<Config>(CONFIG);
  const mongo = container.resolve<Mongo>(MONGO);
  const redis = container.resolve<Redis>(REDIS);
  const mailerQueue = container.resolve(MailerQueue);
  const signingConfig = container.resolve(JWTSigningConfigService);

  const ipLimiter = new RequestLimiter({
    redis,
    ttl: "10m",
    max: 10,
    prefix: "ip",
    config,
  });
  const userIDLimiter = new RequestLimiter({
    redis,
    ttl: "10m",
    max: 10,
    prefix: "userID",
    config,
  });

  return async (req, res, next) => {
    try {
      // Rate limit based on the IP address and user agent.
      await ipLimiter.test(req, req.ip);

      const { tenant, logger, now } = req.coral;

      // Grab the requesting user.
      const requestingUser = req.user;
      if (!requestingUser) {
        throw new AuthenticationError("no user on request");
      }

      // Store the user's ID that should have a email confirmation email sent.
      let targetUserID: string = requestingUser.id;

      // Get the fields from the body. Validate will throw an error if the body
      // does not conform to the specification.
      const body: ConfirmRequestBody = validate(
        ConfirmRequestBodySchema,
        req.body
      );

      // Now check to see if they have specified a userID in the request.
      if (body.userID) {
        // If the user is an admin user, they can request a confirmation email for
        // another user, so check their role.
        if (requestingUser.role === GQLUSER_ROLE.ADMIN) {
          if (body.userID) {
            targetUserID = body.userID;
          }
        } else {
          throw new UserForbiddenError(
            "attempt to send a confirmation email as a non-admin user",
            "/api/account/confirm",
            "POST",
            requestingUser.id
          );
        }
      }

      await userIDLimiter.test(req, targetUserID);

      const log = logger.child(
        {
          targetUserID,
          requestingUserID: requestingUser.id,
          tenantID: tenant.id,
        },
        true
      );

      // Lookup the user.
      const targetUser = await retrieveUser(mongo, tenant.id, targetUserID);
      if (!targetUser) {
        throw new UserNotFoundError(targetUserID);
      }

      await sendConfirmationEmail(
        mongo,
        mailerQueue,
        tenant,
        config,
        signingConfig,
        // TODO: (wyattjoh) evaluate the use of required here.
        targetUser as Required<User>,
        now
      );

      log.trace("sent confirm email with token");

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};

export const confirmCheckHandler = (): RequestHandler<TenantCoralRequest> => {
  // TODO: Replace with DI.
  const config = container.resolve<Config>(CONFIG);
  const mongo = container.resolve<Mongo>(MONGO);
  const signingConfig = container.resolve(JWTSigningConfigService);
  const redis = container.resolve<Redis>(REDIS);

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

      // TODO: evaluate verifying if the Tenant allows verifications to short circuit.

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
      await verifyConfirmTokenString(
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

export const confirmHandler = (): RequestHandler<TenantCoralRequest> => {
  // TODO: Replace with DI.
  const config = container.resolve<Config>(CONFIG);
  const mongo = container.resolve<Mongo>(MONGO);
  const signingConfig = container.resolve(JWTSigningConfigService);
  const redis = container.resolve<Redis>(REDIS);

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

      const { now, tenant } = req.coral;

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
      await confirmEmail(mongo, tenant, signingConfig, tokenString, now);

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
