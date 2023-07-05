import { UserForbiddenError } from "coral-server/errors";
import { RequestHandler } from "coral-server/types/express";

import { GQLUSER_ROLE } from "coral-server/graph/schema/__generated__/types";

export const roleMiddleware =
  (roles: GQLUSER_ROLE[]): RequestHandler =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new UserForbiddenError(
          "user does not have sufficient privileges",
          req.originalUrl,
          req.method
        )
      );
    }
    return next();
  };
