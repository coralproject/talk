import RelayModernEnvironment from "relay-runtime/lib/store/RelayModernEnvironment";

import { LOCAL_ID, lookup } from "coral-framework/lib/relay";

export default function lookupFlattenReplies(
  environment: RelayModernEnvironment
): boolean {
  return !!lookup(environment, LOCAL_ID).flattenReplies;
}
