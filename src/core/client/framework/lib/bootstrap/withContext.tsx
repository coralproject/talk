import React from "react";
import { hoistStatics, wrapDisplayName } from "recompose";

import { Omit } from "talk-ui/types";
import { TalkContext, TalkContextConsumer } from "./TalkContext";

// Injects props and removes them from the prop requirements.
// Will not pass through the injected props if they are passed in during
// render. Also adds new prop requirements from TNeedsProps.
type InferableComponentEnhancerWithProps<TInjectedProps> = <
  P extends TInjectedProps
>(
  component: React.ComponentType<P>
) => React.ComponentType<Omit<P, keyof TInjectedProps>>;

/**
 * withContext is a HOC wrapper around `TalkContextConsumer`.
 * `propsCallback` must be provided which accepts the `TalkContext`
 * and returns the props the should be injected.
 */
function withContext<T>(
  propsCallback: (context: TalkContext) => T
): InferableComponentEnhancerWithProps<T> {
  return hoistStatics<T>(
    <U extends T>(WrappedComponent: React.ComponentType<U>) => {
      const Component: React.StatelessComponent<any> = props => (
        <TalkContextConsumer>
          {context => (
            <WrappedComponent {...props} {...propsCallback(context)} />
          )}
        </TalkContextConsumer>
      );
      Component.displayName = wrapDisplayName(WrappedComponent, "withContext");
      return Component;
    }
  ) as any;
}

export default withContext;
