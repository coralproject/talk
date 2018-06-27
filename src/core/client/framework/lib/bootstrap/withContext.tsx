import * as React from "react";
import { hoistStatics, InferableComponentEnhancer } from "recompose";

import { TalkContext, TalkContextConsumer } from "./TalkContext";

/**
 * withContext is a HOC wrapper around `TalkContextConsumer`.
 * `propsCallback` must be provided which accepts the `TalkContext`
 * and returns the props the should be injected.
 */
function withContext<T>(
  propsCallback: (context: TalkContext) => T
): InferableComponentEnhancer<T> {
  return hoistStatics<T>(
    <U extends T>(WrappedComponent: React.ComponentType<U>) => (props: any) => (
      <TalkContextConsumer>
        {context => <WrappedComponent {...props} {...propsCallback(context)} />}
      </TalkContextConsumer>
    )
  );
}

export default withContext;
