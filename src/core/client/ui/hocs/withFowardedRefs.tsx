import React from "react";

export function forwardRef(
  WrappedComponent: React.ComponentType
): React.RefForwardingComponent<any, any> {
  return React.forwardRef((props, ref) => {
    return <WrappedComponent {...props} forwardedRef={ref} />;
  });
}
