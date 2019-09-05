import {
  addResolveFunctionsToSchema,
  attachDirectiveResolvers,
  IResolvers,
} from "graphql-tools";

import { loadSchema } from "coral-common/graphql";
import auth from "coral-server/graph/common/directives/auth";
import resolvers from "coral-server/graph/tenant/resolvers";

export default function getTenantSchema() {
  const schema = loadSchema("tenant", resolvers as IResolvers);

  // Attach the directive resolvers.
  attachDirectiveResolvers(schema, { auth });

  // Attach the GraphQL enum fields.
  addResolveFunctionsToSchema({
    schema,
    resolvers: {},
  });

  return schema;
}
