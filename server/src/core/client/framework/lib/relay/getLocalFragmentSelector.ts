import { GraphQLTaggedNode } from "react-relay";
import { ReaderFragment, SingularReaderSelector } from "relay-runtime";

import { LOCAL_ID, LOCAL_TYPE } from "./";
import { resolveModule } from "./helpers";

/**
 * Turn a fragment on `Local` to a `SingularReaderSelector`.
 */
export default function getLocalFragmentSelector(
  fragmentSpec: GraphQLTaggedNode
) {
  const fragment = resolveModule(fragmentSpec as ReaderFragment);
  if (fragment.kind !== "Fragment") {
    throw new Error("Expected fragment");
  }
  if (fragment.type !== LOCAL_TYPE) {
    throw new Error(`Type must be "Local" in "Fragment ${fragment.name}"`);
  }

  // TODO: (cvle) This is part is still hacky.
  // Waiting for a solution to https://github.com/facebook/relay/issues/2997.
  const selector: SingularReaderSelector = {
    kind: undefined as any,
    owner: undefined as any,
    dataID: LOCAL_ID,
    node: {
      type: fragment.type,
      kind: fragment.kind,
      name: fragment.name,
      metadata: fragment.metadata,
      selections: fragment.selections,
      argumentDefinitions: [],
    },
    variables: {},
  };

  return selector;
}
