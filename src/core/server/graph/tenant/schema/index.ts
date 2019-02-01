import {
  addResolveFunctionsToSchema,
  attachDirectiveResolvers,
  IEnumResolver,
  IResolvers,
} from "graphql-tools";

import { loadSchema } from "talk-common/graphql";
import auth from "talk-server/graph/common/directives/auth";
import resolvers from "talk-server/graph/tenant/resolvers";
import { LOCALES } from "talk-server/graph/tenant/resolvers/LOCALES";

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
