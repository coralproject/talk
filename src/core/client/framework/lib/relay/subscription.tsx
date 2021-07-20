import React, { useCallback } from "react";
import { InferableComponentEnhancer } from "recompose";
import {
  Disposable,
  Environment,
  GraphQLSubscriptionConfig,
  requestSubscription as requestSubscriptionRelay,
} from "relay-runtime";

import { CoralContext, useCoralContext } from "../bootstrap";
import { resolveModule } from "./helpers";

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

export function requestSubscription<TSubscriptionPayload>(
  environment: Environment,
  // tslint:disable-next-line no-unnecessary-generics
  config: GraphQLSubscriptionConfig<TSubscriptionPayload>
): Disposable {
  return requestSubscriptionRelay(environment, {
    ...config,
    subscription: resolveModule(config.subscription),
  });
}

/**
 * useSubscription is a React Hook that
 * returns a callback to subscribes to a Subscription.
 */
export function useSubscription<V>(
  subscription: Subscription<any, V>
): SubscriptionProp<typeof subscription> {
  const context = useCoralContext();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback<SubscriptionProp<typeof subscription>>(
    ((variables: V) => {
      // TODO: (cvle) These events are deprecated.
      context.eventEmitter.emit(`subscription.${subscription.name}`, variables);
      return subscription.subscribe(
        context.relayEnvironment,
        variables,
        context
      );
    }) as any,
    [context, subscription]
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
      return function WithSubscription(props: any) {
        const finalProps = {
          ...props,
          [subscription.name]: sub,
        };
        return <BaseComponent {...finalProps} />;
      } as any;
    }
  };
}

/**
 * Combines disposables into one.
 */
export function combineDisposables(...disposables: Disposable[]): Disposable {
  return {
    dispose: () => {
      disposables.forEach((d) => d.dispose());
    },
  };
}
