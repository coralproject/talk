import { decodeJWT, JWTSigningConfigService } from "coral-server/services/jwt";
import { MONGO, Mongo } from "coral-server/services/mongodb";
import { Redis, REDIS } from "coral-server/services/redis";
import {
  redeemDownloadToken,
  sendUserDownload,
} from "coral-server/services/users/download";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";
import { container } from "tsyringe";

export const userDownloadHandler = (): RequestHandler<TenantCoralRequest> => {
  // TODO: Replace with DI.
  const mongo = container.resolve<Mongo>(MONGO);
  const signingConfig = container.resolve(JWTSigningConfigService);
  const redis = container.resolve<Redis>(REDIS);

  return async (req, res, next) => {
    const { tenant, now } = req.coral;
    const { token } = req.query;

    const { sub: userID } = decodeJWT(token);
    if (!userID) {
      return res.sendStatus(400);
    }

    try {
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
