import React, { useCallback } from "react";
import {
  compose,
  hoistStatics,
  InferableComponentEnhancer,
  wrapDisplayName,
} from "recompose";
import { Environment } from "relay-runtime";

import { Omit } from "coral-framework/types";

import { CoralContext, useCoralContext, withContext } from "../bootstrap";

export interface Mutation<N, I, R, C extends Partial<CoralContext>> {
  name: N;
  commit: (environment: Environment, input: I, context: C) => R;
}

export type MutationInput<
  T extends { variables: { input: { clientMutationId: string } } }
> = Omit<T["variables"]["input"], "clientMutationId">;

export type MutationResponse<
  T extends { response: { [P in U]: any } },
  U extends string | number | symbol
> = Exclude<T["response"][U], null>;

export type MutationResponsePromise<
  T extends { response: { [P in U]: any } },
  U extends string | number | symbol
> = Promise<MutationResponse<T, U>>;

export type MutationProp<
  T extends Mutation<any, any, any, any>
> = T extends Mutation<any, infer I, infer R, any>
  ? Parameters<T["commit"]>[1] extends undefined
    ? () => R
    : keyof Parameters<T["commit"]>[1] extends never
    ? () => R
    : (input: I) => R
  : never;

type RemoveClientMutationID<T> = T extends Promise<infer U>
  ? Promise<
      U extends { clientMutationId: any } ? Omit<U, "clientMutationId"> : U
    >
  : T extends { clientMutationId: any }
  ? Omit<T, "clientMutationId">
  : T;

export function createMutation<
  N extends string,
  I,
  R,
  C extends Partial<CoralContext>
>(
  name: N,
  commit: (environment: Environment, input: I, context: C) => R
  // (cvle) We remove `clientMutationId` from the response, so we don't use it inside our app.
  // It is a Relay implementation detail that is pending for removal.
  // https://github.com/facebook/relay/pull/2349
): Mutation<N, I, RemoveClientMutationID<R>, C> {
  return {
    name,
    commit,
  } as any;
}

/**
 * useMutation is a React Hook that
 * returns a callback to call the mutation.
 */
export function useMutation<I, R, C extends Partial<CoralContext>>(
  mutation: Mutation<any, I, R, C>
): MutationProp<typeof mutation> {
  const context = useCoralContext();
  return useCallback<MutationProp<typeof mutation>>(
    ((input: I) => {
      return mutation.commit(context.relayEnvironment, input, context as C);
    }) as any,
    [context]
  );
}

/**
 * withMutation creates a HOC that injects the mutation as
 * a property.
 *
 * @deprecated use `useMutation` instead
 */
export function withMutation<
  N extends string,
  I,
  R,
  C extends Partial<CoralContext>
>(
  mutation: Mutation<N, I, R, C>
): InferableComponentEnhancer<{ [P in N]: MutationProp<typeof mutation> }> {
  return compose(
    withContext(context => ({ context })),
    hoistStatics((BaseComponent: React.ComponentType<any>) => {
      class WithMutation extends React.Component<{
        context: CoralContext;
      }> {
        public static displayName = wrapDisplayName(
          BaseComponent,
          "withMutation"
        );

        private commit = (input: I) => {
          return mutation.commit(
            this.props.context.relayEnvironment,
            input,
            this.props.context as C
          );
        };

        public render() {
          const { context: _, ...rest } = this.props;
          const inject = {
            [mutation.name]: this.commit,
          };
          return <BaseComponent {...rest} {...inject} />;
        }
      }
      return WithMutation as React.ComponentType<any>;
    })
  );
}
