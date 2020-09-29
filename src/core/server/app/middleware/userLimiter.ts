import { container } from "tsyringe";

import { RequestLimiter } from "coral-server/app/request/limiter";
import { CONFIG, Config } from "coral-server/config";
import { Redis, REDIS } from "coral-server/services/redis";
import { RequestHandler } from "coral-server/types/express";

export const userLimiterMiddleware = (): RequestHandler => {
  // TODO: Replace with DI.
  const config = container.resolve<Config>(CONFIG);
  const redis = container.resolve<Redis>(REDIS);

  const limiter = new RequestLimiter({
    redis,
    ttl: "1m",
    max: 5,
    prefix: "userID",
    config,
  });

  return async (req, res, next) => {
    if (!req.user) {
      return next();
    }

    limiter
      .test(req, req.user.id)
      .then(() => next())
      .catch((err) => next(err));
  };
};
