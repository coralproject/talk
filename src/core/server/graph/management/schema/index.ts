import { IResolvers } from "graphql-tools";

import { loadSchema } from "talk-common/graphql";
import resolvers from "talk-server/graph/management/resolvers";

export default function getManagementSchema() {
  return loadSchema("management", resolvers as IResolvers);
}
