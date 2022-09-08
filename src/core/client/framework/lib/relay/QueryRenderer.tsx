import React, { Component } from "react";
import { QueryRenderer } from "react-relay";
import { OperationType } from "relay-runtime";

import NetworkError from "coral-framework/components/NetworkError";
import { PropTypesOf } from "coral-framework/types";

import { CoralContextConsumer } from "../bootstrap/CoralContext";

interface OperationDefaults {
  readonly variables: {};
  readonly response: unknown;
}

// Omit environment as we are passing this from the context.
export type QueryRendererProps<T extends OperationType = OperationDefaults> =
  Omit<PropTypesOf<QueryRenderer<T>>, "environment">;

// Omit environment as we are passing this from the context.
export type QueryRenderData<T extends OperationType = OperationDefaults> =
  Parameters<QueryRendererProps<T>["render"]>[0];

/**
 * CoralQueryRenderer is a wrappper around  Relay's `QueryRenderer`.
 * It supplies the `environment` from the context and has better
 * generics type support.
 */
class CoralQueryRenderer<
  T extends OperationType = OperationDefaults
> extends Component<QueryRendererProps<T>> {
  public render() {
    return (
      <CoralContextConsumer>
        {({ relayEnvironment }) => (
          <QueryRenderer
            environment={relayEnvironment}
            {...this.props}
            render={(args) => {
              if (
                args.error &&
                args.error.name === "RRNLRetryMiddlewareError"
              ) {
                return <NetworkError />;
              }

              return this.props.render(args);
            }}
          />
        )}
      </CoralContextConsumer>
    );
  }
}

export default CoralQueryRenderer;
