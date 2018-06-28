import { IResolvers } from "graphql-tools";

import loadSchema from "talk-server/graph/common/schema";
import resolvers from "talk-server/graph/management/resolvers";

export default function getManagementSchema() {
  return loadSchema("management", resolvers as IResolvers);
}
