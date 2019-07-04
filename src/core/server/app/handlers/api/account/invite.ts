import Joi from "joi";

import { AppOptions } from "coral-server/app";
import { validate } from "coral-server/app/request/body";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { decodeJWT, extractTokenFromRequest } from "coral-server/services/jwt";
import {
  redeem,
  verifyInviteTokenString,
} from "coral-server/services/users/auth/invite";
import { RequestHandler } from "coral-server/types/express";

export type InviteCheckOptions = Pick<
  AppOptions,
  "mongo" | "signingConfig" | "redis" | "config"
>;

export const inviteCheckHandler = ({
  redis,
  signingConfig,
  mongo,
  config,
}: InviteCheckOptions): RequestHandler => {
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

      // Tenant is guaranteed at this point.
      const coral = req.coral!;
      const tenant = coral.tenant!;

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
      await verifyInviteTokenString(
        mongo,
        tenant,
        signingConfig,
        tokenString,
        coral.now
      );

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};

export interface InviteBody {
  username: string;
  password: string;
}

export const InviteBodySchema = Joi.object().keys({
  username: Joi.string().trim(),
  password: Joi.string(),
});

export type InviteOptions = Pick<
  AppOptions,
  "mongo" | "signingConfig" | "redis" | "config"
>;

export const inviteHandler = ({
  redis,
  mongo,
  signingConfig,
  config,
}: InviteOptions): RequestHandler => {
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

      // Tenant is guaranteed at this point.
      const coral = req.coral!;
      const tenant = coral.tenant!;

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

      // Get the fields from the body. Validate will throw an error if the body
      // does not conform to the specification.
      const { username, password }: InviteBody = validate(
        InviteBodySchema,
        req.body
      );

      // Redeem the invite to create the new user.
      await redeem(
        mongo,
        tenant,
        signingConfig,
        tokenString,
        { username, password },
        coral.now
      );

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
