import { AppOptions } from "talk-server/app";
import {
  graphqlBatchMiddleware,
  graphqlMiddleware,
} from "talk-server/app/middleware/graphql";
import TenantContext from "talk-server/graph/tenant/context";
import { Request, RequestHandler } from "talk-server/types/express";

export type GraphMiddlewareOptions = Pick<
  AppOptions,
  | "schema"
  | "config"
  | "mongo"
  | "redis"
  | "mailerQueue"
  | "scraperQueue"
  | "signingConfig"
  | "i18n"
>;

export const graphQLHandler = ({
  schema,
  config,
  ...options
}: GraphMiddlewareOptions): RequestHandler =>
  graphqlBatchMiddleware(
    graphqlMiddleware(config, async (req: Request) => {
      if (!req.talk) {
        throw new Error("talk was not set");
      }

      // Pull out some useful properties from Talk.
      const { id, now, tenant, cache } = req.talk;

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
          user: req.user,
          tenantCache: cache.tenant,
        }),
      };
    })
  );
