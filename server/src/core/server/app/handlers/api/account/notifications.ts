import { AppOptions } from "coral-server/app";
import { RequestLimiter } from "coral-server/app/request/limiter";
import { updateUserNotificationSettings } from "coral-server/models/user";
import { decodeJWT, extractTokenFromRequest } from "coral-server/services/jwt";
import { verifyUnsubscribeTokenString } from "coral-server/services/notifications/categories/unsubscribe";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

export type UnsubscribeCheckOptions = Pick<
  AppOptions,
  "mongo" | "signingConfig" | "redis" | "config"
>;

export const unsubscribeCheckHandler = ({
  redis,
  mongo,
  signingConfig,
  config,
}: UnsubscribeCheckOptions): RequestHandler<TenantCoralRequest> => {
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
      await verifyUnsubscribeTokenString(
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

export type UnsubscribeOptions = Pick<
  AppOptions,
  "mongo" | "signingConfig" | "redis" | "config"
>;

export const unsubscribeHandler = ({
  redis,
  mongo,
  signingConfig,
  config,
}: UnsubscribeOptions): RequestHandler<TenantCoralRequest> => {
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
      const { user } = await verifyUnsubscribeTokenString(
        mongo,
        tenant,
        signingConfig,
        tokenString,
        now
      );

      // Unsubscribe the user from all notification types.
      await updateUserNotificationSettings(mongo, tenant.id, user.id, {
        onFeatured: false,
        onModeration: false,
        onReply: false,
        onStaffReplies: false,
      });

      return res.sendStatus(204);
    } catch (err) {
      return next(err);
    }
  };
};
