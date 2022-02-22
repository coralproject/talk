import { IResolvers } from "@graphql-tools/utils";
import {
  attachDirectiveResolvers,
  SchemaDirectiveVisitor,
} from "apollo-server-express";

import { loadSchema } from "coral-common/graphql";
import auth from "coral-server/graph/directives/auth";
import constraint from "coral-server/graph/directives/constraint";
import rate from "coral-server/graph/directives/rate";
import resolvers from "coral-server/graph/resolvers";

export default function getSchema() {
  const schema = loadSchema(resolvers as IResolvers);

  // Attach the directive resolvers. `attachDirectiveResolvers` will return a
  // copy with the directives applied.
  attachDirectiveResolvers(schema, { auth, rate });

  // Attach the constraint directive.
  SchemaDirectiveVisitor.visitSchemaDirectives(schema, {
    constraint,
  });

  return schema;
}
