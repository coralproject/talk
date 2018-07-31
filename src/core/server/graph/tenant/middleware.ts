import { GraphQLSchema } from "graphql";
import { Redis } from "ioredis";
import { Db } from "mongodb";

import { Config } from "talk-server/config";
import { graphqlMiddleware } from "talk-server/graph/common/middleware";
import { TaskQueue } from "talk-server/services/queue";
import { Request } from "talk-server/types/express";

import TenantContext from "./context";

export interface TenantGraphQLMiddlewareOptions {
  schema: GraphQLSchema;
  config: Config;
  mongo: Db;
  redis: Redis;
  queue: TaskQueue;
}

export default async ({
  schema,
  config,
  mongo,
  redis,
  queue,
}: TenantGraphQLMiddlewareOptions) => {
  return graphqlMiddleware(config, async (req: Request) => {
    // Load the tenant and user from the request.
    const { tenant, user, tenantCache } = req;

    // Return the graph options.
    return {
      schema,
      context: new TenantContext({
        req,
        mongo,
        redis,
        tenant: tenant!,
        user,
        tenantCache,
        queue,
      }),
    };
  });
};
