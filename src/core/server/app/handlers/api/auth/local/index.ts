import { container } from "tsyringe";

import { handleLogout } from "coral-server/app/middleware/passport";
import { Redis, REDIS } from "coral-server/services/redis";
import { RequestHandler, TenantCoralRequest } from "coral-server/types/express";

export * from "./forgot";
export * from "./signup";
export * from "./link";

export const logoutHandler = (): RequestHandler<TenantCoralRequest> => {
  const redis = container.resolve<Redis>(REDIS);

  return async (req, res, next) => {
    try {
      // Get the user on the request.
      const user = req.user;
      if (!user) {
        // If a user is already logged out, then there's no need to do it again!
        return res.sendStatus(204);
      }

      // Delegate to the logout handler.
      return handleLogout(redis, req, res);
    } catch (err) {
      return next(err);
    }
  };
};
