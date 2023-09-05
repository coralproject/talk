import { UserForbiddenError } from "coral-server/errors";
import { RequestHandler } from "coral-server/types/express";

export const loggedInMiddleware: RequestHandler = (req, res, next) => {
  if (!req.user) {
    return next(
      new UserForbiddenError(
        "user is not logged in",
        req.originalUrl,
        req.method
      )
    );
  }

  return next();
};
