import React, { Ref } from "react";

// TODO: ForwardRef API is not supported in enzymes shallow rendering
// https://github.com/airbnb/enzyme/issues/1553
// As for now we do props passing instead until full React16 support lands in
// enzyme.

/**
 * withForwardRef provides a property called `forwardRef` using
 * the `React.forwardRef` api.
 */
/*
function withForwardRef<P extends { ref?: Ref<any>; forwardRef?: Ref<any> }>(
  BaseComponent: React.ComponentType<P>
): React.ComponentType<Omit<P, "forwardRef">> {
  const forwardRef: RefForwardingComponent<any, P> = (props, ref) => (
    <BaseComponent {...props} forwardRef={ref} />
  );
  return React.forwardRef<any, P>(forwardRef);
}

// TODO: workaround, add bug link.
export default withForwardRef as <
  P extends { ref?: Ref<any>; forwardRef?: Ref<any> }
>(
  BaseComponent: React.ComponentType<P>
) => React.ComponentType<P>;

*/

// Stub, currently doesn't do anything except adding types.
export default function withForwardRef<P extends { forwardRef?: Ref<any> }>(
  BaseComponent: React.ComponentType<P>
): React.ComponentType<P> {
  return BaseComponent;
}
