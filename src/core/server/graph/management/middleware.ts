import { GraphQLSchema } from "graphql";
import { Db } from "mongodb";

import { Config } from "talk-server/config";
import { graphqlMiddleware } from "talk-server/graph/common/middleware";

import ManagementContext from "./context";

export default (schema: GraphQLSchema, config: Config, mongo: Db) =>
  graphqlMiddleware(config, async () => ({
    schema,
    context: new ManagementContext({ mongo }),
  }));
