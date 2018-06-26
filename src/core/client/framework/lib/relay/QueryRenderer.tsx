import React, { Component } from "react";
import { QueryRenderer } from "react-relay";
import { CacheConfig, GraphQLTaggedNode, RerunParam } from "relay-runtime";

import { TalkContextConsumer } from "../bootstrap/TalkContext";

// Taken from relay types and added Generic support for Variables and Response
export interface QueryRendererProps<V, R> {
  cacheConfig?: CacheConfig;
  query?: GraphQLTaggedNode | null;
  render(readyState: ReadyState<R>): React.ReactElement<any> | undefined | null;
  variables: V;
  rerunParamExperimental?: RerunParam;
}

// Taken from relay types and added Generic support for Variables and Response
export interface ReadyState<R> {
  error: Error | undefined | null;
  props: R | undefined | null;
  retry?(): void;
}

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
