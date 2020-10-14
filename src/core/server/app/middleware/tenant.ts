import { v1 as uuid } from "uuid";

import { TenantNotFoundError } from "coral-server/errors";
import logger from "coral-server/logger";
import { TenantCache } from "coral-server/services/tenant/cache";
import { RequestHandler } from "coral-server/types/express";

interface Options {
  cache: TenantCache;
  passNoTenant?: boolean;
}

export const tenantMiddleware = ({
  cache,
  passNoTenant = false,
}: Options): RequestHandler => async (req, res, next) => {
  try {
    if (!req.coral) {
      const id = uuid();

      // Write the ID on the request.
      res.set("X-Trace-ID", id);

      // The only call to `new Date()` as a part of the request process. This
      // is passed around the request to ensure constant-time actions.
      const now = new Date();

      // Set Coral on the request.
      req.coral = {
        id,
        now,
        cache: {
          // Attach the tenant cache to the request.
          tenant: cache,
        },
        logger: logger.child({ context: "http", contextID: id }, true),
      };
    }

    // Attach the tenant to the request.
    const tenant = await cache.retrieveByDomain(req.hostname);
    if (!tenant) {
      if (passNoTenant) {
        return next();
      }

      return next(new TenantNotFoundError(req.hostname));
    }

    // Augment the logger with the tenantID.
    req.coral.logger = req.coral.logger.child({ tenantID: tenant.id }, true);

    // Attach the tenant to the request.
    req.coral.tenant = tenant;

    // Attach the tenant's language to the request.
    res.setHeader("Content-Language", tenant.locale);

    // Attach the tenant to the view locals.
    res.locals.tenant = tenant;

    next();
  } catch (err) {
    next(err);
  }
};
