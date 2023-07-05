import {
  createFragmentContainer,
  FragmentOrRegularProp,
  GraphQLTaggedNode,
} from "react-relay";
import {
  InferableComponentEnhancerWithProps,
  wrapDisplayName,
} from "recompose";

import { resolveModuleObject } from "./helpers";
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
  > =>
  (component: React.ComponentType<any>) => {
    const result = createFragmentContainer(
      component,
      resolveModuleObject(fragmentSpec)
    );
    result.displayName = wrapDisplayName(component, "Relay");
    return result as any;
  };
