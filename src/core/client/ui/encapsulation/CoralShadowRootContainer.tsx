import React, { FunctionComponent } from "react";

import { withForwardRef } from "../hocs";
import DivWithShadowBreakpointClasses from "./DivWithShadowBreakpointClasses";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  forwardRef: React.Ref<HTMLDivElement>;
};

/**
 * Coral Container for an App rendered into the shadow DOM.
 * Sets `id="coral"` and adds breakpoint classNames.
 */
const CoralShadowRootContainer: FunctionComponent<Props> = ({
  forwardRef,
  ...rest
}) => {
  return (
    <DivWithShadowBreakpointClasses ref={forwardRef} {...rest} id="coral" />
  );
};

const enhanced = withForwardRef(CoralShadowRootContainer);
export default enhanced;
