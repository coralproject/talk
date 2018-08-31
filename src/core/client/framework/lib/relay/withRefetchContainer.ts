import {
  createRefetchContainer,
  FragmentOrRegularProp,
  GraphQLTaggedNode,
  RelayRefetchProp,
} from "react-relay";
import {
  InferableComponentEnhancerWithProps,
  wrapDisplayName,
} from "recompose";

import hideForwardRef from "./hideForwardRef";
import { FragmentKeysNoLocal } from "./types";

/**
 * withRefetchContainer is a curried version of `createRefetchContainers`
 * from Relay.
 */
export default <T>(
  fragmentSpec: { [P in FragmentKeysNoLocal<T>]: GraphQLTaggedNode } & {
    _?: never;
  },
  refetchQuery: GraphQLTaggedNode
): InferableComponentEnhancerWithProps<
  { [P in FragmentKeysNoLocal<T>]: T[P] } & { relay: RelayRefetchProp },
  { [P in FragmentKeysNoLocal<T>]: FragmentOrRegularProp<T[P]> }
> => (component: React.ComponentType<any>) => {
  const result = createRefetchContainer(component, fragmentSpec, refetchQuery);
  result.displayName = wrapDisplayName(component, "Relay");
  // TODO: (cvle) We wrap this currently to hide the ForwardRef which is not
  // well supported yet in enzyme.
  return hideForwardRef(result) as any;
};
