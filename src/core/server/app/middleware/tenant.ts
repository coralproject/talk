import { NextFunction, Response } from "express";
import { Db } from "mongodb";

import { retrieveTenantByDomain } from "talk-server/models/tenant";
import { Request } from "talk-server/types/express";

export interface MiddlewareOptions {
  db: Db;
}

export default (options: MiddlewareOptions) => async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // TODO: replace with shared synced cache instead of direct db access.
    const tenant = await retrieveTenantByDomain(options.db, req.hostname);
    if (!tenant) {
      // TODO: send a http.StatusNotFound?
      return next(new Error("tenant not found"));
    }

    // Attach the tenant to the request.
    req.tenant = tenant;

    next();
  } catch (err) {
    next(err);
  }
};
