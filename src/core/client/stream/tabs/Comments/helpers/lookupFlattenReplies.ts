import { Environment } from "react-relay";

import { LOCAL_ID, lookup } from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG } from "coral-framework/schema";

export default function lookupFlattenReplies(environment: Environment) {
  return lookup(environment, LOCAL_ID).staticConfig.featureFlags.includes(
    GQLFEATURE_FLAG.FLATTEN_REPLIES
  );
}
