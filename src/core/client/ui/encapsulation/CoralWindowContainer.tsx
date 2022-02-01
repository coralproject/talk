import React, { FunctionComponent } from "react";

import { withForwardRef } from "../hocs";
import DivWithWindowBreakpointClasses from "./DivWithWindowBreakpointClasses";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  forwardRef: React.Ref<HTMLDivElement>;
};

/**
 * Coral Container for an App rendered into regular DOM.
 * Sets `id="coral"` and adds breakpoint classNames.
 */
const CoralWindowContainer: FunctionComponent<Props> = ({
  forwardRef,
  ...rest
}) => {
  return (
    <DivWithWindowBreakpointClasses ref={forwardRef} {...rest} id="coral" />
  );
};

const enhanced = withForwardRef(CoralWindowContainer);
export default enhanced;
