import React, { Ref, RefForwardingComponent } from "react";
import { Omit } from "recompose";

/**
 * withForwardRef provides a property called `forwardRef` using
 * the `React.forwardRef` api.
 */
export default function withForwardRef<P extends { forwardRef?: Ref<any> }>(
  BaseComponent: React.ComponentType<P>
): React.ComponentType<Omit<P, "forwardRef"> & { ref?: P["forwardRef"] }> {
  const forwardRef: RefForwardingComponent<any, P> = (props, ref) => (
    <BaseComponent {...props} forwardRef={ref} />
  );
  return React.forwardRef<any, P>(forwardRef) as any;
}

/*
// Stub, currently doesn't do anything except adding types.
export default function withForwardRef<P extends { forwardRef?: Ref<any> }>(
  BaseComponent: React.ComponentType<P>
): React.ComponentType<P> {
  return BaseComponent;
}
*/
