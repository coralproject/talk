import {
  createPaginationContainer,
  FragmentOrRegularProp,
  GraphQLTaggedNode,
  RelayPaginationProp,
} from "react-relay";
import {
  InferableComponentEnhancerWithProps,
  wrapDisplayName,
} from "recompose";
import { PageInfo, Variables } from "relay-runtime";

import { resolveModule, resolveModuleObject } from "./helpers";
import { FragmentKeysNoLocal } from "./types";

interface ConnectionData {
  edges?: ReadonlyArray<any> | null;
  pageInfo?: Partial<PageInfo> | null;
}

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
    props: Omit<P, "relay">,
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
  > =>
  (component: React.ComponentType<any>) => {
    const result = createPaginationContainer(
      component,
      resolveModuleObject(fragmentSpec),
      {
        ...connectionConfig,
        query: resolveModule(connectionConfig.query),
      }
    );
    result.displayName = wrapDisplayName(component, "Relay");
    return result as any;
  };
