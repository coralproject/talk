import * as React from "react";
import {
  hoistStatics,
  InferableComponentEnhancer,
  wrapDisplayName,
} from "recompose";

/**
 * withContext is a HOC wrapper around `TalkContextConsumer`.
 * `propsCallback` must be provided which accepts the `TalkContext`
 * and returns the props the should be injected.
 */
function createContextHOC<Context>(
  displayName: string,
  Consumer: React.ComponentType<React.ConsumerProps<Context>>
) {
  return function withContext<T>(
    propsCallback: (context: Context) => T
  ): InferableComponentEnhancer<T> {
    return hoistStatics<T>(
      <U extends T>(WrappedComponent: React.ComponentType<U>) => {
        const Component: React.StatelessComponent<any> = props => (
          <Consumer>
            {context => (
              <WrappedComponent {...props} {...propsCallback(context)} />
            )}
          </Consumer>
        );
        Component.displayName = wrapDisplayName(WrappedComponent, displayName);
        return Component;
      }
    );
  };
}

export default createContextHOC;
