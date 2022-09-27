import React, { ForwardRefRenderFunction, Ref } from "react";

/**
 * withForwardRef provides a property called `forwardRef` using
 * the `React.forwardRef` api.
 */
export default function withForwardRef<P extends { forwardRef?: Ref<any> }>(
  BaseComponent: React.ComponentType<P>
): React.ComponentType<Omit<P, "forwardRef"> & { ref?: P["forwardRef"] }> {
  const forwardRef: ForwardRefRenderFunction<any, P> = (props, ref) => (
    <BaseComponent {...props} forwardRef={ref} />
  );
  return React.forwardRef<any, P>(forwardRef) as any;
}
