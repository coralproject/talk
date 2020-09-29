import Joi from "@hapi/joi";

import { validate } from "coral-server/app/request/body";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { CONFIG, Config } from "coral-server/config";

import {
  decodeJWT,
  extractTokenFromRequest,
  JWTSigningConfigService,
} from "coral-server/services/jwt";
import { MONGO, Mongo } from "coral-server/services/mongodb";
import { REDIS, Redis } from "coral-server/services/redis";
import {
  redeemDownloadToken,
  sendUserDownload,
  verifyDownloadTokenString,
} from "coral-server/services/users/download";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";
import { container } from "tsyringe";

const USER_ID_LIMITER_TTL = "1d";

export interface AccountDownloadBody {
  token: string;
}

export const AccountDownloadBodySchema = Joi.object().keys({
  token: Joi.string().trim(),
});

export const accountDownloadHandler = (): RequestHandler<
  TenantCoralRequest
> => {
  // TODO: Replace with DI.
  const config = container.resolve<Config>(CONFIG);
  const mongo = container.resolve<Mongo>(MONGO);
  const signingConfig = container.resolve(JWTSigningConfigService);
  const redis = container.resolve<Redis>(REDIS);

  const userIDLimiter = new RequestLimiter({
    redis,
    ttl: USER_ID_LIMITER_TTL,
    max: 1,
    prefix: "userID",
    config,
  });

  return async (req, res, next) => {
    try {
      const { tenant, now } = req.coral;

      // Get the fields from the body. Validate will throw an error if the body
      // does not conform to the specification.
      const { token }: AccountDownloadBody = validate(
        AccountDownloadBodySchema,
        req.body
      );

      // Decode the token so we can rate limit based on the user's ID.
      const { sub: userID } = decodeJWT(token);
      if (!userID) {
        return res.sendStatus(400);
      }

      await userIDLimiter.test(req, userID);

      const {
        token: { iat },
        user,
      } = await redeemDownloadToken(
        mongo,
        redis,
        tenant,
        signingConfig,
        token,
        now
      );

      // Only load comments since this download token was issued.
      const latestContentDate = new Date(iat * 1000);

      // Send the export down the response.
      await sendUserDownload(res, mongo, tenant, user, latestContentDate);

      return;
    } catch (err) {
      return next(err);
    }
  };
};

export const accountDownloadCheckHandler = (): RequestHandler<
  TenantCoralRequest
> => {
  // TODO: Replace with DI.
  const config = container.resolve<Config>(CONFIG);
  const mongo = container.resolve<Mongo>(MONGO);
  const signingConfig = container.resolve(JWTSigningConfigService);
  const redis = container.resolve<Redis>(REDIS);

  const userIDLimiter = new RequestLimiter({
    redis,
    ttl: "10m",
    max: 10,
    prefix: "userID",
    config,
  });

  return async (req, res, next) => {
    try {
      const { tenant, now } = req.coral;

      const tokenString = extractTokenFromRequest(req, true);
      if (!tokenString) {
        return res.sendStatus(400);
      }

      const { sub: userID } = decodeJWT(tokenString);
      if (!userID) {
        return res.sendStatus(400);
      }

      await userIDLimiter.test(req, userID);

      await verifyDownloadTokenString(
        mongo,
        redis,
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
