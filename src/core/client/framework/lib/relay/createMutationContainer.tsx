import React from "react";
import {
  compose,
  hoistStatics,
  InferableComponentEnhancer,
  wrapDisplayName,
} from "recompose";
import { Environment } from "relay-runtime";

import { CoralContext, withContext } from "../bootstrap";

/**
 * createMutationContainer creates a HOC that
 * injects a property with the name specified in `propName`
 * and the signature (input: I) => Promise<R>. Calling
 * this will call the specified `commit` callback with
 * the Relay `environment` provided by the context.
 *
 * @deprecated use `createMutation` instead
 */
function createMutationContainer<T extends string, I, R>(
  propName: T,
  commit: (
    environment: Environment,
    input: I,
    context: CoralContext
  ) => Promise<R>
): InferableComponentEnhancer<{ [P in T]: (input: I) => Promise<R> }> {
  return compose(
    withContext((context) => ({ context })),
    hoistStatics((BaseComponent: React.ComponentType<any>) => {
      class CreateMutationContainer extends React.Component<{
        context: CoralContext;
      }> {
        public static displayName = wrapDisplayName(
          BaseComponent,
          "createMutationContainer"
        );

        private commit = (input: I) => {
          // TODO: (cvle) Naming of these events are deprecated.
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
      return CreateMutationContainer as React.ComponentClass<any>;
    })
  ) as any;
}

export default createMutationContainer;
