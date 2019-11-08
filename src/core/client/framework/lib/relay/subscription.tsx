import React, { useCallback } from "react";
import { InferableComponentEnhancer } from "recompose";
import { Disposable, Environment } from "relay-runtime";

import { CoralContext, useCoralContext } from "../bootstrap";

export type SubscriptionVariables<
  T extends { variables: any }
> = T["variables"];
export interface Subscription<N, V> {
  name: N;
  subscribe: (
    environment: Environment,
    variables: V,
    context: CoralContext
  ) => Disposable;
}

export type SubscriptionProp<
  T extends Subscription<any, any>
> = T extends Subscription<any, infer V>
  ? Parameters<T["subscribe"]>[1] extends undefined
    ? () => Disposable
    : keyof Parameters<T["subscribe"]>[1] extends never
    ? () => Disposable
    : (variables: V) => Disposable
  : never;

export function createSubscription<N extends string, V>(
  name: N,
  subscribe: (
    environment: Environment,
    variables: V,
    context: CoralContext
  ) => Disposable
): Subscription<N, V> {
  return {
    name,
    subscribe,
  };
}

/**
 * useSubscription is a React Hook that
 * returns a callback to subscribes to a Subscription.
 */
export function useSubscription<V>(
  subscription: Subscription<any, V>
): SubscriptionProp<typeof subscription> {
  const context = useCoralContext();
  return useCallback<SubscriptionProp<typeof subscription>>(
    ((variables: V) => {
      return subscription.subscribe(
        context.relayEnvironment,
        variables,
        context
      );
    }) as any,
    [context]
  );
}

/**
 * withSubscription creates a HOC that injects the subscription as
 * a property.
 *
 * @deprecated use `useFetch` instead
 */
export function withSubscription<N extends string, V, R>(
  subscription: Subscription<N, V>
): InferableComponentEnhancer<
  { [P in N]: SubscriptionProp<typeof subscription> }
> {
  return (BaseComponent: React.ComponentType<any>) => {
    {
      const sub = useSubscription(subscription);
      return function WithSubscription(props) {
        const finalProps = {
          ...props,
          [subscription.name]: sub,
        };
        return <BaseComponent {...finalProps} />;
      };
    }
  };
}

/**
 * Combines disposables into one.
 */
export function combineDisposables(...disposables: Disposable[]): Disposable {
  return {
    dispose: () => {
      disposables.forEach(d => d.dispose());
    },
  };
}
