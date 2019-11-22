import {
  attachDirectiveResolvers,
  IResolvers,
  SchemaDirectiveVisitor,
} from "graphql-tools";

import { loadSchema } from "coral-common/graphql";
import auth from "coral-server/graph/common/directives/auth";
import constraint from "coral-server/graph/common/directives/constraint";
import rate from "coral-server/graph/tenant/directives/rate";
import resolvers from "coral-server/graph/tenant/resolvers";

export default function getTenantSchema() {
  const schema = loadSchema("tenant", resolvers as IResolvers);

  // Attach the directive resolvers.
  attachDirectiveResolvers(schema, { auth, rate });

  // Attach the constraint directive.
  SchemaDirectiveVisitor.visitSchemaDirectives(schema, {
    constraint,
  });

  return schema;
}
