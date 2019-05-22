import React, { Component } from "react";
import {
  QueryRenderer,
  QueryRendererProps as QueryRendererPropsOrig,
} from "react-relay";
import { OperationBase, OperationDefaults } from "relay-runtime";

import { Omit } from "coral-framework/types";

import { CoralContextConsumer } from "../bootstrap/CoralContext";

// Omit environment as we are passing this from the context.
export type QueryRendererProps<
  T extends OperationBase = OperationDefaults
> = Omit<QueryRendererPropsOrig<T>, "environment">;

/**
 * CoralQueryRenderer is a wrappper around  Relay's `QueryRenderer`.
 * It supplies the `environment` from the context and has better
 * generics type support.
 */
class CoralQueryRenderer<
  T extends OperationBase = OperationDefaults
> extends Component<QueryRendererProps<T>> {
  public render() {
    return (
      <CoralContextConsumer>
        {({ relayEnvironment }) => (
          <QueryRenderer environment={relayEnvironment} {...this.props} />
        )}
      </CoralContextConsumer>
    );
  }
}

export default CoralQueryRenderer;
