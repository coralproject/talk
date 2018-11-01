import { GraphQLSchema } from "graphql";
import { Db } from "mongodb";

import { Config } from "talk-common/config";
import { graphqlMiddleware } from "talk-server/graph/common/middleware";
import { Request } from "talk-server/types/express";

import ManagementContext from "./context";

export default (schema: GraphQLSchema, config: Config, mongo: Db) =>
  graphqlMiddleware(config, async (req: Request) => ({
    schema,
    context: new ManagementContext({ req, mongo, config }),
  }));
