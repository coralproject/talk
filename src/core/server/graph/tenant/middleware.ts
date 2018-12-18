import { GraphQLSchema } from "graphql";
// import { graphqlBatchHTTPWrapper } from "react-relay-network-layer";

import { graphqlBatchMiddleware } from "talk-server/app/middleware/graphqlBatch";
import { Config } from "talk-server/config";
import { graphqlMiddleware } from "talk-server/graph/common/middleware";
import { Request } from "talk-server/types/express";

export interface TenantGraphQLMiddlewareOptions {
  schema: GraphQLSchema;
  config: Config;
}

export default async ({ schema, config }: TenantGraphQLMiddlewareOptions) =>
  graphqlBatchMiddleware(
    graphqlMiddleware(config, async (req: Request) => {
      if (!req.talk) {
        throw new Error("talk was not set");
      }

      const { context } = req.talk;
      if (!context) {
        throw new Error("context was not set");
      }

      const { tenant } = context;
      if (!tenant) {
        throw new Error("tenant was not set");
      }

      // Return the graph options.
      return {
        schema,
        context: tenant,
      };
    })
  );
