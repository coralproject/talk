import { loadSchema } from "talk-common/graphql";
import resolvers from "talk-server/graph/tenant/resolvers";

export default function getTenantSchema() {
  return loadSchema("tenant", resolvers);
}
