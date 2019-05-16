import {
  addResolveFunctionsToSchema,
  attachDirectiveResolvers,
  IEnumResolver,
  IResolvers,
} from "graphql-tools";

import { loadSchema } from "coral-common/graphql";
import auth from "coral-server/graph/common/directives/auth";
import resolvers from "coral-server/graph/tenant/resolvers";
import { LOCALES } from "coral-server/graph/tenant/resolvers/LOCALES";

export default function getTenantSchema() {
  const schema = loadSchema("tenant", resolvers as IResolvers);

  // Attach the directive resolvers.
  attachDirectiveResolvers(schema, { auth });

  // Attach the GraphQL enum fields.
  addResolveFunctionsToSchema({
    schema,
    resolvers: {
      // For some reason, the resolver doesn't quite work without coercing the
      // type.
      LOCALES: LOCALES as IEnumResolver,
    },
  });

  return schema;
}
