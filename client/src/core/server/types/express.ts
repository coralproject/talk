import { NextFunction, Request as ExpressRequest, Response } from "express";

import { RequireProperty } from "coral-common/types";
import { Logger } from "coral-server/logger";
import { PersistedQuery } from "coral-server/models/queries";
import { Site } from "coral-server/models/site";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { TenantCache } from "coral-server/services/tenant/cache";

export interface CoralRequest {
  id: string;
  now: Date;
  cache: {
    tenant: TenantCache;
  };
  tenant?: Tenant;
  site?: Site;
  persisted?: PersistedQuery;
  logger: Logger;
}

export type TenantCoralRequest = RequireProperty<CoralRequest, "tenant">;

export interface Request<T = CoralRequest> extends ExpressRequest {
  coral: T;
  user?: User;
}

export type RequestHandler<T = CoralRequest, V = void> = (
  req: Request<T>,
  res: Response,
  next: NextFunction
) => V;

export type ErrorRequestHandler = (
  err: Error,
  req: Request<CoralRequest>,
  res: Response,
  next: NextFunction
) => void;
