import { RequestHandler } from "express-jwt";
import { Redis } from "ioredis";
import { Db } from "mongodb";

import { InternalErr } from "talk-server/errors";
import TenantContext from "talk-server/graph/tenant/context";
import { TaskQueue } from "talk-server/services/queue";
import { Request } from "talk-server/types/express";

export interface TenantContextMiddlewareOptions {
  mongo: Db;
  redis: Redis;
  queue: TaskQueue;
}

export const tenantContext = ({
  mongo,
  redis,
  queue,
}: TenantContextMiddlewareOptions): RequestHandler => (
  req: Request,
  res,
  next
) => {
  if (!req.talk) {
    return next(new InternalErr("talk was not set"));
  }

  const { tenant, cache } = req.talk;

  if (!cache) {
    return next(new InternalErr("cache was not set"));
  }

  if (!tenant) {
    return next(new InternalErr("tenant was not set"));
  }

  req.talk.context = {
    tenant: new TenantContext({
      req,
      mongo,
      redis,
      tenant,
      user: req.user,
      tenantCache: cache.tenant,
      queue,
    }),
  };

  next();
};
