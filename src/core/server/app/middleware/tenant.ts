import TenantCache from "talk-server/services/tenant/cache";
import { RequestHandler } from "talk-server/types/express";

export interface MiddlewareOptions {
  cache: TenantCache;
}

export const tenantMiddleware = ({
  cache,
}: MiddlewareOptions): RequestHandler => async (req, res, next) => {
  try {
    // Attach the tenant to the request.
    const tenant = await cache.retrieveByDomain(req.hostname);
    if (!tenant) {
      // TODO: send a http.StatusNotFound?
      return next(new Error("tenant not found"));
    }

    // Set Talk on the request.
    req.talk = {
      cache: {
        // Attach the tenant cache to the request.
        tenant: cache,
      },
      // Attach the tenant to the request.
      tenant,
    };

    // Attach the tenant to the view locals.
    res.locals.tenant = tenant;

    next();
  } catch (err) {
    next(err);
  }
};
