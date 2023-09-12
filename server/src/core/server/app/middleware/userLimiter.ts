import { Redis } from "ioredis";

import { RequestLimiter } from "coral-server/app/request/limiter";
import { Config } from "coral-server/config";
import { RequestHandler } from "coral-server/types/express";

interface Options {
  redis: Redis;
  config: Config;
}

export const userLimiterMiddleware = ({
  redis,
  config,
}: Options): RequestHandler => {
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
