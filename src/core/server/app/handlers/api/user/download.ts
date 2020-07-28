import { AppOptions } from "coral-server/app";
import { decodeJWT } from "coral-server/services/jwt";
import {
  redeemDownloadToken,
  sendUserDownload,
} from "coral-server/services/users/download";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

type AdminDownloadOptions = Pick<
  AppOptions,
  "mongo" | "redis" | "signingConfig"
>;

export const userDownloadHandler = ({
  mongo,
  redis,
  signingConfig,
}: AdminDownloadOptions): RequestHandler<TenantCoralRequest> => {
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
