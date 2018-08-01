import { GraphQLSchema } from "graphql";
import { Db } from "mongodb";

import { Config } from "talk-server/config";
import { graphqlMiddleware } from "talk-server/graph/common/middleware";

import Context from "./context";

export default (schema: GraphQLSchema, config: Config, db: Db) =>
  graphqlMiddleware(config, async () => ({
    schema,
    context: new Context({ db }),
  }));
