import { NextFunction, Response } from "express";

import TenantCache from "talk-server/services/tenant/cache";
import { Request } from "talk-server/types/express";

export interface MiddlewareOptions {
  cache: TenantCache;
}

export default (options: MiddlewareOptions) => async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { cache } = options;

    // Attach the tenant to the request.
    const tenant = await cache.retrieveByDomain(req.hostname);
    if (!tenant) {
      // TODO: send a http.StatusNotFound?
      return next(new Error("tenant not found"));
    }

    // Attach the tenant cache to the request.
    req.tenantCache = cache;

    // Attach the tenant to the request.
    req.tenant = tenant;

    // Attach the tenant to the view locals.
    res.locals.tenant = tenant;

    next();
  } catch (err) {
    next(err);
  }
};
