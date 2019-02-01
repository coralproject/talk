import { RequestHandler } from "express-jwt";
import { Db } from "mongodb";

import { Config } from "talk-server/config";
import TenantContext from "talk-server/graph/tenant/context";
import { TaskQueue } from "talk-server/queue";
import { I18n } from "talk-server/services/i18n";
import { JWTSigningConfig } from "talk-server/services/jwt";
import { AugmentedRedis } from "talk-server/services/redis";
import { Request } from "talk-server/types/express";

export interface TenantContextMiddlewareOptions {
  mongo: Db;
  redis: AugmentedRedis;
  queue: TaskQueue;
  config: Config;
  signingConfig: JWTSigningConfig;
  i18n: I18n;
}

export const tenantContext = ({
  mongo,
  redis,
  queue,
  config,
  signingConfig,
  i18n,
}: TenantContextMiddlewareOptions): RequestHandler => (
  req: Request,
  res,
  next
) => {
  if (!req.talk) {
    return next(new Error("talk was not set"));
  }

  const { tenant, cache } = req.talk;

  if (!cache) {
    return next(new Error("cache was not set"));
  }

  if (!tenant) {
    return next(new Error("tenant was not set"));
  }

  req.talk.context = {
    tenant: new TenantContext({
      req,
      config,
      mongo,
      redis,
      tenant,
      user: req.user,
      tenantCache: cache.tenant,
      queue,
      signingConfig,
      i18n,
    }),
  };

  next();
};
