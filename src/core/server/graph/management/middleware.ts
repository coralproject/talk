import { GraphQLSchema } from "graphql";
import { Db } from "mongodb";

import { Config } from "talk-server/config";
import { graphqlMiddleware } from "talk-server/graph/common/middleware";
import { Request } from "talk-server/types/express";

import { I18n } from "talk-server/services/i18n";
import ManagementContext from "./context";

export interface ManagementGraphQLMiddlewareOptions {
  schema: GraphQLSchema;
  config: Config;
  mongo: Db;
  i18n: I18n;
}

export default ({
  schema,
  config,
  mongo,
  i18n,
}: ManagementGraphQLMiddlewareOptions) =>
  graphqlMiddleware(config, async (req: Request) => ({
    schema,
    context: new ManagementContext({ req, mongo, config, i18n }),
  }));
