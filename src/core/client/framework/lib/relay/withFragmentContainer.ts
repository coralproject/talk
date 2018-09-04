import {
  _RefType,
  createFragmentContainer,
  FragmentOrRegularProp,
  GraphQLTaggedNode,
} from "react-relay";
import { InferableComponentEnhancerWithProps } from "recompose";
import { wrapDisplayName } from "recompose";

import hideForwardRef from "./hideForwardRef";
import { FragmentKeysNoLocal } from "./types";

/**
 * withFragmentContainer is a curried version of `createFragmentContainers`
 * from Relay.
 */
export default <T>(
  fragmentSpec: { [P in FragmentKeysNoLocal<T>]: GraphQLTaggedNode } & {
    _?: never;
  }
): InferableComponentEnhancerWithProps<
  { [P in FragmentKeysNoLocal<T>]: T[P] },
  { [P in FragmentKeysNoLocal<T>]: FragmentOrRegularProp<T[P]> }
> => (component: React.ComponentType<any>) => {
  const result = createFragmentContainer(component, fragmentSpec);
  result.displayName = wrapDisplayName(component, "Relay");
  // TODO: (cvle) We wrap this currently to hide the ForwardRef which is not
  // well supported yet in enzyme.
  return hideForwardRef(result) as any;
};
