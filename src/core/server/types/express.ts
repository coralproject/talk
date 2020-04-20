import { NextFunction, Request as ExpressRequest, Response } from "express";

import { Logger } from "coral-server/logger";
import { PersistedQuery } from "coral-server/models/queries";
import { Site } from "coral-server/models/site";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { TenantCache } from "coral-server/services/tenant/cache";

export interface CoralRequest {
  id: string;
  now: Date;
  cache?: {
    tenant: TenantCache;
  };
  tenant?: Tenant;
  persisted?: PersistedQuery;
  logger: Logger;
}

export interface Request extends ExpressRequest {
  coral?: CoralRequest;
  user?: User;
  site?: Site;
}

export type RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

export type ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => void;
