import {
  ConnectionData,
  createPaginationContainer,
  FragmentOrRegularProp,
  GraphQLTaggedNode,
  RelayPaginationProp,
} from "react-relay";
import {
  InferableComponentEnhancerWithProps,
  wrapDisplayName,
} from "recompose";
import { Variables } from "relay-runtime";

import hideForwardRef from "./hideForwardRef";
import { FragmentKeysNoLocal } from "./types";

// TODO: (cvle) at some point we might switch these to stock react-relay typings
// when they become versatile enough.
export type FragmentVariablesGetter<V extends Variables = Variables> = (
  prevVars: V,
  totalCount: number
) => V;

export interface ConnectionConfig<
  P,
  V extends Variables = Variables,
  F extends Variables = Variables
> {
  direction?: "backward" | "forward";
  getConnectionFromProps?(props: P): ConnectionData | undefined | null;
  getFragmentVariables?: FragmentVariablesGetter<F>;
  getVariables(
    props: P,
    paginationInfo: { count: number; cursor?: string },
    fragmentVariables: F
  ): V;
  query: GraphQLTaggedNode;
}

/**
 * withPaginationContainer is a curried version of `createPaginationContainers`
 * from Relay.
 */
export default <T, QueryVariables, FragmentVariables>(
  fragmentSpec: { [P in FragmentKeysNoLocal<T>]: GraphQLTaggedNode } & {
    _?: never;
  },
  connectionConfig: ConnectionConfig<T, QueryVariables, FragmentVariables>
): InferableComponentEnhancerWithProps<
  { [P in FragmentKeysNoLocal<T>]: T[P] } & { relay: RelayPaginationProp },
  { [P in FragmentKeysNoLocal<T>]: FragmentOrRegularProp<T[P]> }
> => (component: React.ComponentType<any>) => {
  const result = createPaginationContainer(
    component,
    fragmentSpec,
    connectionConfig
  );
  result.displayName = wrapDisplayName(component, "Relay");
  // TODO: (cvle) We wrap this currently to hide the ForwardRef which is not
  // well supported yet in enzyme.
  return hideForwardRef(result) as any;
};
