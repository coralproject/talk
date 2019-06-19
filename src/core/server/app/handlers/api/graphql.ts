import { AppOptions } from "coral-server/app";
import {
  graphqlBatchMiddleware,
  graphqlMiddleware,
} from "coral-server/app/middleware/graphql";
import TenantContext from "coral-server/graph/tenant/context";
import { Request, RequestHandler } from "coral-server/types/express";

export type GraphMiddlewareOptions = Pick<
  AppOptions,
  | "config"
  | "i18n"
  | "mailerQueue"
  | "mongo"
  | "redis"
  | "schema"
  | "scraperQueue"
  | "signingConfig"
  | "pubsub"
>;

export const graphQLHandler = ({
  schema,
  config,
  ...options
}: GraphMiddlewareOptions): RequestHandler =>
  graphqlBatchMiddleware(
    graphqlMiddleware(config, async (req: Request) => {
      if (!req.coral) {
        throw new Error("coral was not set");
      }

      // Pull out some useful properties from Coral.
      const { id, now, tenant, cache, logger } = req.coral;

      if (!cache) {
        throw new Error("cache was not set");
      }

      if (!tenant) {
        throw new Error("tenant was not set");
      }

      return {
        schema,
        context: new TenantContext({
          ...options,
          id,
          now,
          req,
          config,
          tenant,
          logger,
          user: req.user,
          tenantCache: cache.tenant,
        }),
      };
    })
  );
