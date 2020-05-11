import React, { useCallback, useEffect, useState } from "react";
import { fetchQuery as relayFetchQuery } from "react-relay";
import {
  compose,
  hoistStatics,
  InferableComponentEnhancer,
  wrapDisplayName,
} from "recompose";
import {
  CacheConfig,
  Environment,
  GraphQLTaggedNode,
  Variables,
} from "relay-runtime";

import { CoralContext, useCoralContext, withContext } from "../bootstrap";

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
      // TODO: (cvle) These events are deprecated.
      context.eventEmitter.emit(`fetch.${fetch.name}`, variables);
      return fetch.fetch(context.relayEnvironment, variables, context);
    }) as any,
    [context]
  );
}

export function useImmediateFetch<V extends {}, R>(
  fetch: Fetch<any, V, Promise<R>>,
  variables: V
) {
  const fetcher = useFetch(fetch);
  const [state, setState] = useState<R | null>(null);

  useEffect(() => {
    async function doTheFetch() {
      const value = await fetcher(variables);

      // TODO: Maybe we don't need this timeout?
      setTimeout(() => {
        setState(value);
      }, 100 + 50 * Math.random());
    }

    doTheFetch();
  }, Object.values(variables));

  return state;
}

/**
 * withFetch creates a HOC that injects the fetch as
 * a property.
 *
 * @deprecated use `useFetch` instead
 */
export function withFetch<N extends string, V, R>(
  fetch: Fetch<N, V, R>
): InferableComponentEnhancer<{ [P in N]: FetchProp<typeof fetch> }> {
  return compose(
    withContext((context) => ({ context })),
    hoistStatics((BaseComponent: React.ComponentType<any>) => {
      class WithFetch extends React.Component<{
        context: CoralContext;
      }> {
        public static displayName = wrapDisplayName(BaseComponent, "withFetch");

        private fetch = (variables: V) => {
          // TODO: (cvle) These events are deprecated.
          this.props.context.eventEmitter.emit(
            `fetch.${fetch.name}`,
            variables
          );
          return fetch.fetch(
            this.props.context.relayEnvironment,
            variables,
            this.props.context
          );
        };

        public render() {
          const { context: _, ...rest } = this.props;
          const inject = {
            [fetch.name]: this.fetch,
          };
          return <BaseComponent {...rest} {...inject} />;
        }
      }
      return WithFetch as React.ComponentClass<any>;
    })
  ) as any;
}
