import * as React from "react";
import {
  compose,
  hoistStatics,
  InferableComponentEnhancer,
  wrapDisplayName,
} from "recompose";
import { Environment } from "relay-runtime";
import { Omit } from "talk-framework/types";

import { TalkContext, withContext } from "../bootstrap";

export type MutationInput<
  T extends { variables: { input: { clientMutationId: string } } }
> = Omit<T["variables"]["input"], "clientMutationId">;

export type MutationResponse<
  T extends { response: { [P in U]: any } },
  U extends string
> = Exclude<T["response"][U], null>;

export type MutationResponsePromise<
  T extends { response: { [P in U]: any } },
  U extends string
> = Promise<MutationResponse<T, U>>;

/**
 * createMutationContainer creates a HOC that
 * injects a property with the name specified in `propName`
 * and the signature (input: I) => Promise<R>. Calling
 * this will call the specified `commit` callback with
 * the Relay `environment` provided by the context.
 */
function createMutationContainer<T extends string, I, R>(
  propName: T,
  commit: (
    environment: Environment,
    input: I,
    context: TalkContext
  ) => Promise<R>
): InferableComponentEnhancer<{ [P in T]: (input: I) => Promise<R> }> {
  return compose(
    withContext(context => ({ context })),
    hoistStatics((BaseComponent: React.ComponentType<any>) => {
      class CreateMutationContainer extends React.Component<{
        context: TalkContext;
      }> {
        public static displayName = wrapDisplayName(
          BaseComponent,
          "createMutationContainer"
        );

        private commit = (input: I) => {
          this.props.context.eventEmitter.emit(`mutation.${propName}`, input);
          return commit(
            this.props.context.relayEnvironment,
            input,
            this.props.context
          );
        };

        public render() {
          const { context: _, ...rest } = this.props;
          const inject = {
            [propName]: this.commit,
          };
          return <BaseComponent {...rest} {...inject} />;
        }
      }
      return CreateMutationContainer as React.ComponentType<any>;
    })
  );
}

export default createMutationContainer;
