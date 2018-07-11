import * as React from "react";
import {
  compose,
  hoistStatics,
  InferableComponentEnhancer,
  wrapDisplayName,
} from "recompose";
import { Environment } from "relay-runtime";

import { withContext } from "../bootstrap";

/**
 * createMutationContainer creates a HOC that
 * injects a property with the name specified in `propName`
 * and the signature (input: I) => Promise<R>. Calling
 * this will call the specified `commit` callback with
 * the Relay `environment` provided by the context.
 */
function createMutationContainer<T extends string, I, R>(
  propName: T,
  commit: (environment: Environment, input: I) => Promise<R>
): InferableComponentEnhancer<{ [P in T]: (input: I) => Promise<R> }> {
  return compose(
    withContext(({ relayEnvironment }) => ({ relayEnvironment })),
    hoistStatics((WrappedComponent: React.ComponentType<any>) => {
      class CreateMutationContainer extends React.Component<any> {
        public static displayName = wrapDisplayName(
          WrappedComponent,
          "createMutationContainer"
        );

        private commit = (input: I) => {
          return commit(this.props.relayEnvironment, input);
        };

        public render() {
          const { relayEnvironment: _, ...rest } = this.props;
          const inject = {
            [propName]: this.commit,
          };
          return <WrappedComponent {...rest} {...inject} />;
        }
      }
      return CreateMutationContainer as React.ComponentType<any>;
    })
  );
}

export default createMutationContainer;
