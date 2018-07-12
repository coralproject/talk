import React, { Component } from "react";
import {
  QueryRenderer,
  QueryRendererProps as QueryRendererPropsOrig,
} from "react-relay";

import { Omit } from "talk-framework/types";

import { TalkContextConsumer } from "../bootstrap/TalkContext";

// Omit environment as we are passing this from the context.
export type QueryRendererProps<V, R> = Omit<
  QueryRendererPropsOrig<V, R>,
  "environment"
>;

/**
 * TalkQueryRenderer is a wrappper around  Relay's `QueryRenderer`.
 * It supplies the `environment` from the context and has better
 * generics type support.
 */
class TalkQueryRenderer<V, R> extends Component<QueryRendererProps<V, R>> {
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
