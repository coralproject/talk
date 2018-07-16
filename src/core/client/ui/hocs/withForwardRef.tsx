import React from "react";
import {
  InferableComponentEnhancerWithProps,
  withPropsOnChange,
} from "recompose";

/**
 * withForwardRef provides a property called `forwardRef` using
 * the `React.forwardRef` api.
 */
function withForwardRef<T>(): InferableComponentEnhancerWithProps<
  { forwardRef: Ref<any> },
  {}
> {
  return WrappedComponent => {
    return React.forwardRef((props, ref) => (
      <WrappedComponent forwardRef={ref} />
    ));
  };
}

export default withForwardRef;
