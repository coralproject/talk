import { GraphQLSchema } from "graphql";
import { Db } from "mongodb";

import {
  graphqlBatchMiddleware,
  graphqlMiddleware,
} from "talk-server/app/middleware/graphql";
import { Config } from "talk-server/config";
import TenantContext from "talk-server/graph/tenant/context";
import { TaskQueue } from "talk-server/queue";
import { I18n } from "talk-server/services/i18n";
import { JWTSigningConfig } from "talk-server/services/jwt";
import { AugmentedRedis } from "talk-server/services/redis";
import { Request, RequestHandler } from "talk-server/types/express";

export interface GraphMiddlewareOptions {
  schema: GraphQLSchema;
  config: Config;
  mongo: Db;
  redis: AugmentedRedis;
  queue: TaskQueue;
  signingConfig: JWTSigningConfig;
  i18n: I18n;
}

export const graphQLHandler = ({
  schema,
  config,
  mongo,
  redis,
  queue,
  signingConfig,
  i18n,
}: GraphMiddlewareOptions): RequestHandler =>
  graphqlBatchMiddleware(
    graphqlMiddleware(config, async (req: Request) => {
      if (!req.talk) {
        throw new Error("talk was not set");
      }

      const { tenant, cache } = req.talk;

      if (!cache) {
        throw new Error("cache was not set");
      }

      if (!tenant) {
        throw new Error("tenant was not set");
      }

      return {
        schema,
        context: new TenantContext({
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
    })
  );
