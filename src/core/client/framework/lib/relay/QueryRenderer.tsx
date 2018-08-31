import React, { Component } from "react";
import {
  QueryRenderer,
  QueryRendererProps as QueryRendererPropsOrig,
} from "react-relay";
import { OperationBase, OperationDefaults } from "relay-runtime";

import { Omit } from "talk-framework/types";

import { TalkContextConsumer } from "../bootstrap/TalkContext";

// Omit environment as we are passing this from the context.
export type QueryRendererProps<
  T extends OperationBase = OperationDefaults
> = Omit<QueryRendererPropsOrig<T>, "environment">;

/**
 * TalkQueryRenderer is a wrappper around  Relay's `QueryRenderer`.
 * It supplies the `environment` from the context and has better
 * generics type support.
 */
class TalkQueryRenderer<
  T extends OperationBase = OperationDefaults
> extends Component<QueryRendererProps<T>> {
  public render() {
    return (
      <TalkContextConsumer>
        {({ relayEnvironment }) => (
          <QueryRenderer environment={relayEnvironment} {...this.props} />
        )}
      </TalkContextConsumer>
    );
  }
}

export default TalkQueryRenderer;
