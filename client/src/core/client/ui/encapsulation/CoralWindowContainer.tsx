import React, { FunctionComponent } from "react";

import { withForwardRef } from "../hocs";
import DivWithWindowBreakpointClasses from "./DivWithWindowBreakpointClasses";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  forwardRef: React.Ref<HTMLDivElement>;
};

/**
 * Coral Entrypoint Container rendered into regular DOM.
 * It's basically a div that sets `id="coral"`
 * and adds breakpoint classNames.
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
