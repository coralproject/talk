import { GraphQLSchema } from "graphql";
import { Redis } from "ioredis";
import { Db } from "mongodb";

import { Config } from "talk-common/config";
import { graphqlMiddleware } from "talk-server/graph/common/middleware";
import { Request } from "talk-server/types/express";

import TenantContext from "./context";

export interface TenantGraphQLMiddlewareOptions {
  schema: GraphQLSchema;
  config: Config;
  mongo: Db;
  redis: Redis;
}

export default async ({
  schema,
  config,
  mongo,
  redis,
}: TenantGraphQLMiddlewareOptions) => {
  return graphqlMiddleware(config, async (req: Request) => {
    // Load the tenant and user from the request.
    const { tenant, user, tenantCache } = req;

    // Return the graph options.
    return {
      schema,
      context: new TenantContext({
        mongo,
        redis,
        tenant: tenant!,
        user,
        tenantCache,
      }),
    };
  });
};
