import { GraphQLSchema } from "graphql";
import {
  attachDirectiveResolvers,
  IResolvers,
  SchemaDirectiveVisitor,
} from "graphql-tools";
import { singleton } from "tsyringe";

import { loadSchema } from "coral-common/graphql";
import auth from "coral-server/graph/directives/auth";
import constraint from "coral-server/graph/directives/constraint";
import rate from "coral-server/graph/directives/rate";
import resolvers from "coral-server/graph/resolvers";

@singleton()
export default class SchemaService {
  public readonly schema: GraphQLSchema = loadSchema({
    resolvers: resolvers as IResolvers,
  });

  constructor() {
    // Attach the directive resolvers.
    attachDirectiveResolvers(this.schema, { auth, rate });

    // Attach the constraint directive.
    SchemaDirectiveVisitor.visitSchemaDirectives(this.schema, {
      constraint,
    });
  }
}
