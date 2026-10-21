import { AppOptions } from "coral-server/app";
import { handleLogout } from "coral-server/app/middleware/passport";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import {
  Request,
  RequestHandler,
  TenantCoralRequest,
} from "coral-server/types/express";

export * from "./forgot";
export * from "./signup";
export * from "./link";

export type LogoutOptions = Pick<AppOptions, "redis"> & {
  /**
   * revokeAtproto ends the user's atproto session, if they have one. It must
   * not throw.
   */
  revokeAtproto?: (req: Request, tenant: Tenant, user: User) => Promise<void>;
};

export const logoutHandler =
  ({
    redis,
    revokeAtproto,
  }: LogoutOptions): RequestHandler<TenantCoralRequest> =>
  async (req, res, next) => {
    try {
      // Get the user on the request.
      const user = req.user;
      if (!user) {
        // If a user is already logged out, then there's no need to do it again!
        return res.sendStatus(204);
      }

      // End their atproto session too, so signing in again starts a new
      // authorization. This doesn't wait for their authorization server.
      if (revokeAtproto) {
        void revokeAtproto(req, req.coral.tenant, user);
      }

      // Delegate to the logout handler.
      return handleLogout(redis, req, res);
    } catch (err) {
      return next(err);
    }
  };
