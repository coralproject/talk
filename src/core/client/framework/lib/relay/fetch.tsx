import { isUndefined } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { fetchQuery as relayFetchQuery } from "react-relay";
import {
  CacheConfig,
  Environment,
  GraphQLTaggedNode,
  Variables,
} from "relay-runtime";

import { CoralContext, useCoralContext } from "../bootstrap";

export interface Fetch<N, V, R> {
  name: N;
  fetch: (environment: Environment, variables: V, context: CoralContext) => R;
}

export type FetchVariables<T extends { variables: any }> = T["variables"];
export type FetchProp<T extends Fetch<any, any, any>> = T extends Fetch<
  any,
  infer V,
  infer R
>
  ? Parameters<T["fetch"]>[1] extends undefined
    ? () => R
    : keyof Parameters<T["fetch"]>[1] extends never
    ? () => R
    : (variables: V) => R
  : never;

export function createFetch<N extends string, V, R>(
  name: N,
  fetch: (environment: Environment, variables: V, context: CoralContext) => R
): Fetch<N, V, R> {
  return {
    name,
    fetch,
  } as any;
}

export async function fetchQuery<T extends { response: any }>(
  environment: Environment,
  taggedNode: GraphQLTaggedNode,
  variables: Variables,
  cacheConfig?: CacheConfig
): Promise<T["response"]> {
  return relayFetchQuery(environment, taggedNode, variables, cacheConfig);
}

/**
 * useFetch is a React Hook that
 * returns a callback to call the fetch.
 */
export function useFetch<V, R>(
  fetch: Fetch<any, V, R>
): FetchProp<typeof fetch> {
  const context = useCoralContext();
  return useCallback<FetchProp<typeof fetch>>(
    ((variables: V) => {
      // TODO: (cvle) Naming of these events are deprecated.
      context.eventEmitter.emit(`fetch.${fetch.name}`, variables);
      return fetch.fetch(context.relayEnvironment, variables, context);
    }) as any,
    [context]
  );
}

export function useImmediateFetch<V extends {}, R>(
  fetch: Fetch<any, V, Promise<R>>,
  variables: V,
  refetch?: any
): [R | null, boolean] {
  const fetcher = useFetch(fetch);
  const [state, setState] = useState<{ data: R | null; loading: boolean }>({
    data: null,
    loading: false,
  });

  useEffect(() => {
    let aborted = false;

    async function doTheFetch() {
      // Update the state by setting loading to true.
      setState((s) => ({ ...s, loading: true }));

      try {
        // Perform the fetch.
        const data = await fetcher(variables);
        if (aborted) {
          // If we've aborted, we're either unmounting or a variable has changed,
          // so don't bother finishing updating the state because another
          // request is about to occur.
          return;
        }

        // Update the state with the data.
        setState({ data, loading: false });
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error("could not perform fetch", err);

        setState({ data: null, loading: false });
      }
    }

    void doTheFetch();

    return () => {
      aborted = true;
    };
  }, Object.values(variables).concat(isUndefined(refetch) ? [] : [refetch]));

  return [state.data, state.loading];
}
