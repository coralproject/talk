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
 * createFetchContainer creates a HOC that
 * injects a property with the name specified in `propName`
 * and the signature (input: I) => Promise<R>. Calling
 * this will start a one off query.
 *
 * @deprecated use `createFetch` instead
 */
function createFetchContainer<T extends string, V, R>(
  propName: T,
  fetch: (
    environment: Environment,
    variables: V,
    context: CoralContext
  ) => Promise<R>
): InferableComponentEnhancer<{ [P in T]: (variables: V) => Promise<R> }> {
  return compose(
    withContext((context) => ({ context })),
    hoistStatics((BaseComponent: React.ComponentType<any>) => {
      class CreateFetchContainer extends React.Component<any> {
        public static displayName = wrapDisplayName(
          BaseComponent,
          "createFetchContainer"
        );

        private fetch = (variables: V) => {
          return fetch(
            this.props.context.relayEnvironment,
            variables,
            this.props.context
          );
        };

        public render() {
          const { context: _, ...rest } = this.props;
          const inject = {
            [propName]: this.fetch,
          };
          return <BaseComponent {...rest} {...inject} />;
        }
      }
      return CreateFetchContainer as React.ComponentClass<any>;
    })
  ) as any;
}

export default createFetchContainer;
