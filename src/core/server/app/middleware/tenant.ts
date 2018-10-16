import { RequestHandler } from "express";

import { TenantNotFoundErr } from "talk-server/errors";
import TenantCache from "talk-server/services/tenant/cache";
import { Request } from "talk-server/types/express";

export interface MiddlewareOptions {
  cache: TenantCache;
}

export default ({ cache }: MiddlewareOptions): RequestHandler => async (
  req: Request,
  res,
  next
) => {
  try {
    // Attach the tenant to the request.
    const tenant = await cache.retrieveByDomain(req.hostname);
    if (!tenant) {
      return next(new TenantNotFoundErr());
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
