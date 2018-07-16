import {
  InferableComponentEnhancerWithProps,
  withPropsOnChange,
} from "recompose";

/**
 * withForwardRef provides a property called `forwardRef` using
 * the `React.forwardRef` api.
 */
function withForwardRef<T>(): InferableComponentEnhancerWithProps<
  { forwardRef: any },
  {}
> {
  return WrappedComponent => {
    return React.forwardRef((props, ref) => (
      ref as button={ref} className="FancyButton">
        {props.children}
      </button>
    ));
  };
}

export default withForwardRef;
