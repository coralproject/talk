import { Environment } from "relay-runtime";

import { GQLQuery } from "coral-common/schema";
import { lookup } from "coral-framework/lib/relay";

export default function isLoggedIn(environment: Environment) {
  return Boolean(lookup<GQLQuery>(environment, "client:root")?.viewer);
}
