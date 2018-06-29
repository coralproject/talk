import { attachDirectiveResolvers, IResolvers } from "graphql-tools";

import auth from "talk-server/graph/common/directives/auth";
import loadSchema from "talk-server/graph/common/schema";
import resolvers from "talk-server/graph/tenant/resolvers";

export default function getTenantSchema() {
  const schema = loadSchema("tenant", resolvers as IResolvers);

  // Attach the directive resolvers.
  attachDirectiveResolvers(schema, { auth });

  return schema;
}
