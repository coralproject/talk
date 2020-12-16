import { Environment } from "react-relay";

import { LOCAL_ID, lookup } from "coral-framework/lib/relay";

export default function lookupFlattenReplies(
  environment: Environment
): boolean {
  return !!lookup(environment, LOCAL_ID).flattenReplies;
}
