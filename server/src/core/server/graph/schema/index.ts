import { attachDirectiveResolvers } from "@graphql-tools/schema";
import { IResolvers, SchemaDirectiveVisitor } from "@graphql-tools/utils";

import { loadSchema } from "coral-common/graphql";
import auth from "coral-server/graph/directives/auth";
import constraint from "coral-server/graph/directives/constraint";
import rate from "coral-server/graph/directives/rate";
import resolvers from "coral-server/graph/resolvers";

export default function getSchema() {
  let schema = loadSchema(resolvers as IResolvers);

  // Attach the directive resolvers. `attachDirectiveResolvers` will return a
  // copy with the directives applied.
  schema = attachDirectiveResolvers(schema, { auth, rate });

  // Attach the constraint directive.
  SchemaDirectiveVisitor.visitSchemaDirectives(schema, {
    constraint,
  });

  return schema;
}
