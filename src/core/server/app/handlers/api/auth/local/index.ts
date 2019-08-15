import { AppOptions } from "coral-server/app";
import { handleLogout } from "coral-server/app/middleware/passport";
import { RequestHandler } from "coral-server/types/express";

export * from "./forgot";
export * from "./signup";

export type LogoutOptions = Pick<AppOptions, "redis">;

export const logoutHandler = ({
  redis,
}: LogoutOptions): RequestHandler => async (req, res, next) => {
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
