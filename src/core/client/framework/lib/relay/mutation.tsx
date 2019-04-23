import React, { useCallback } from "react";
import {
  compose,
  hoistStatics,
  InferableComponentEnhancer,
  wrapDisplayName,
} from "recompose";
import { Environment } from "relay-runtime";

import { Omit } from "talk-framework/types";

import { TalkContext, useTalkContext, withContext } from "../bootstrap";

export interface Mutation<N, I, R> {
  name: N;
  commit: (environment: Environment, input: I, context: TalkContext) => R;
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
  T extends Mutation<any, any, any>
> = T extends Mutation<any, infer I, infer R>
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

export function createMutation<N extends string, I, R>(
  name: N,
  commit: (environment: Environment, input: I, context: TalkContext) => R
  // (cvle) We remove `clientMutationId` from the response, so we don't use it inside our app.
  // It is a Relay implementation detail that is pending for removal.
  // https://github.com/facebook/relay/pull/2349
): Mutation<N, I, RemoveClientMutationID<R>> {
  return {
    name,
    commit,
  } as any;
}

/**
 * useMutation is a React Hook that
 * returns a callback to call the mutation.
 */
export function useMutation<I, R>(
  mutation: Mutation<any, I, R>
): MutationProp<typeof mutation> {
  const context = useTalkContext();
  return useCallback<MutationProp<typeof mutation>>(
    ((input: I) => {
      context.eventEmitter.emit(`mutation.${mutation.name}`, input);
      return mutation.commit(context.relayEnvironment, input, context);
    }) as any,
    [context]
  );
}

/**
 * withMutation creates a HOC that injects the mutation as
 * a property.
 */
export function withMutation<N extends string, I, R>(
  mutation: Mutation<N, I, R>
): InferableComponentEnhancer<{ [P in N]: MutationProp<typeof mutation> }> {
  return compose(
    withContext(context => ({ context })),
    hoistStatics((BaseComponent: React.ComponentType<any>) => {
      class WithMutation extends React.Component<{
        context: TalkContext;
      }> {
        public static displayName = wrapDisplayName(
          BaseComponent,
          "withMutation"
        );

        private commit = (input: I) => {
          this.props.context.eventEmitter.emit(
            `mutation.${mutation.name}`,
            input
          );
          return mutation.commit(
            this.props.context.relayEnvironment,
            input,
            this.props.context
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
