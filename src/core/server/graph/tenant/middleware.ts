import { GraphQLSchema } from "graphql";
import { Db } from "mongodb";

import { Config } from "talk-server/config";
import { graphqlMiddleware } from "talk-server/graph/common/middleware";
import { Request } from "talk-server/types/express";

import TenantContext from "./context";

export default async (schema: GraphQLSchema, config: Config, db: Db) => {
  return graphqlMiddleware(config, async (req: Request) => {
    // Load the tenant and user from the request.
    const { tenant, user } = req;

    // Return the graph options.
    return {
      schema,
      context: new TenantContext({ db, tenant: tenant!, user }),
    };
  });
};
