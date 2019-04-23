import { NextFunction, Request as ExpressRequest, Response } from "express";

import { Tenant } from "talk-server/models/tenant";
import { User } from "talk-server/models/user";
import TenantCache from "talk-server/services/tenant/cache";

export interface TalkRequest {
  id: string;
  now: Date;
  cache?: {
    tenant: TenantCache;
  };
  tenant?: Tenant;
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
