import { NextFunction, Request as ExpressRequest, Response } from "express";

import TenantContext from "talk-server/graph/tenant/context";
import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import TenantCache from "talk-server/services/tenant/cache";

export interface TalkRequest {
  cache?: {
    tenant: TenantCache;
  };
  tenant?: Tenant;
  context?: {
    tenant?: TenantContext;
  };
}

export interface Request extends ExpressRequest {
  talk?: TalkRequest;
  user?: User;
}

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
