import { NextFunction, Request as ExpressRequest, Response } from "express";

import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import TenantCache from "talk-server/services/tenant/cache";

export interface Request extends ExpressRequest {
  user?: User;
  tenant?: Tenant;
  tenantCache: TenantCache;
}

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
