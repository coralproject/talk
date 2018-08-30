import {
  ConnectionConfig,
  createPaginationContainer,
  FragmentOrRegularProp,
  GraphQLTaggedNode,
  RelayPaginationProp,
} from "react-relay";
import { InferableComponentEnhancerWithProps } from "recompose";
import { FragmentKeysNoLocal } from "./types";

/**
 * withPaginationContainer is a curried version of `createPaginationContainers`
 * from Relay.
 */
export default <T, FragmentVariables, QueryVariables>(
  fragmentSpec: { [P in FragmentKeysNoLocal<T>]: GraphQLTaggedNode } & {
    _?: never;
  },
  connectionConfig: ConnectionConfig<T, FragmentVariables, QueryVariables>
): InferableComponentEnhancerWithProps<
  { [P in FragmentKeysNoLocal<T>]: T[P] } & { relay: RelayPaginationProp },
  { [P in FragmentKeysNoLocal<T>]: FragmentOrRegularProp<T[P]> }
> => (component: React.ComponentType<any>) =>
  createPaginationContainer(component, fragmentSpec, connectionConfig) as any;
