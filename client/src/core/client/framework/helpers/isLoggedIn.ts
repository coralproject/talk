import { Environment } from "relay-runtime";

import { lookup } from "coral-framework/lib/relay";
import { GQLQuery } from "coral-framework/schema";

export default function isLoggedIn(environment: Environment) {
  return Boolean(lookup<GQLQuery>(environment, "client:root")?.viewer);
}
