import { AppOptions } from "coral-server/app";
import { handleLogout } from "coral-server/app/middleware/passport";
import { IntegrationDisabled } from "coral-server/errors";
import { RequestHandler } from "coral-server/types/express";

export * from "./signup";
export * from "./forgot";

export type LogoutOptions = Pick<AppOptions, "redis">;

export const logoutHandler = ({
  redis,
}: LogoutOptions): RequestHandler => async (req, res, next) => {
  try {
    // Tenant is guaranteed at this point.
    const tenant = req.coral!.tenant!;

    // Check to ensure that the local integration has been enabled.
    if (!tenant.auth.integrations.local.enabled) {
      throw new IntegrationDisabled("local");
    }

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
