import { GraphQLTaggedNode } from "react-relay";
import { Environment } from "relay-runtime";

import { OmitFragments } from "coral-framework/testHelpers/removeFragmentRefs";

import getLocalFragmentSelector from "./getLocalFragmentSelector";

/**
 * waitForLocalState will resolve when condition callback returns true.
 * `Local` state is read using the fragment and passed through the callback
 * which is called once at the start and whenever the state included in the
 * fragment changes.
 */
export default function waitForLocalState<T>(
  environment: Environment,
  fragmentSpec: GraphQLTaggedNode,
  condition: (data: OmitFragments<T>) => boolean
): Promise<OmitFragments<T>> {
  const selector = getLocalFragmentSelector(fragmentSpec);

  // Create an operation descriptor for the query
  return new Promise((resolve, reject) => {
    const snapshot = environment.lookup(selector);
    if (condition(snapshot.data as any as T)) {
      resolve(snapshot.data as any as T);
    }
    const subscription = environment.subscribe(snapshot, (update) => {
      if (condition(update.data as any as T)) {
        subscription.dispose();
        resolve(update.data as any as T);
      }
    });
  });
}
