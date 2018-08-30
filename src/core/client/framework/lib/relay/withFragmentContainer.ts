import {
  _RefType,
  createFragmentContainer,
  FragmentOrRegularProp,
  GraphQLTaggedNode,
} from "react-relay";
import { InferableComponentEnhancerWithProps } from "recompose";
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
> => (component: React.ComponentType<any>) =>
  createFragmentContainer(component, fragmentSpec) as any;
