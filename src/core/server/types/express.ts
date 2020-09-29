import { NextFunction, Request as ExpressRequest, Response } from "express";

import { RequireProperty } from "coral-common/types";
import { Logger } from "coral-server/logger";
import { PersistedQuery } from "coral-server/models/queries";
import { Tenant } from "coral-server/models/tenant";
import { User } from "coral-server/models/user";
import { ErrorReporter } from "coral-server/services/errors";

export interface CoralRequest {
  id: string;
  now: Date;
  tenant?: Tenant;
  logger: Logger;

  /**
   * persisted is the query that was persisted on the request from the persisted
   * query middleware. This can't be moved into a plugin because currently
   * Apollo does not have a hook that runs before it validates a query that's
   * executing.
   */
  persisted?: PersistedQuery;

  reporter?: ErrorReporter;
}

export type TenantCoralRequest = RequireProperty<CoralRequest, "tenant">;

export interface Request<T = CoralRequest> extends ExpressRequest {
  coral: T;
  user?: User;
}

export type RequestHandler<T = CoralRequest> = (
  req: Request<T>,
  res: Response,
  next: NextFunction
) => void;

export type ErrorRequestHandler = (
  err: Error,
  req: Request<CoralRequest>,
  res: Response,
  next: NextFunction
) => void;
