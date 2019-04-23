import uuid from "uuid/v1";

import { TenantNotFoundError } from "talk-server/errors";
import logger from "talk-server/logger";
import TenantCache from "talk-server/services/tenant/cache";
import { RequestHandler } from "talk-server/types/express";

export interface MiddlewareOptions {
  cache: TenantCache;
  passNoTenant?: boolean;
}

export const tenantMiddleware = ({
  cache,
  passNoTenant = false,
}: MiddlewareOptions): RequestHandler => async (req, res, next) => {
  try {
    if (!req.talk) {
      const id = uuid();

      // Write the ID on the request.
      res.set("X-Trace-ID", id);

      // The only call to `new Date()` as a part of the request process. This
      // is passed around the request to ensure constant-time actions.
      const now = new Date();

      // Set Talk on the request.
      req.talk = { id, now, logger: logger.child({ traceID: id }) };
    }

    // Set the Talk Tenant Cache on the request.
    if (!req.talk.cache) {
      req.talk.cache = {
        // Attach the tenant cache to the request.
        tenant: cache,
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

    // Attach the tenant to the request.
    req.talk.tenant = tenant;

    // Attach the tenant's language to the request.
    res.setHeader("Content-Language", tenant.locale);

    // Attach the tenant to the view locals.
    res.locals.tenant = tenant;

    next();
  } catch (err) {
    next(err);
  }
};
