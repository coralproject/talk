import React, { ComponentType, FunctionComponent } from "react";

// TODO: (cvle) This currently a workaround to hide ForwardRef from
// enzyme which does not support it well yet.
export default function hideForwardRef(component: ComponentType) {
  const wrapped: FunctionComponent = (props: any) =>
    React.createElement(component, props);
  wrapped.displayName = component.displayName;
  return wrapped;
}
