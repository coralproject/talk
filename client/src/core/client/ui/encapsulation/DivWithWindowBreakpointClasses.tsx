import cn from "classnames";
import React, { FunctionComponent } from "react";

import { withForwardRef } from "../hocs";
import useWindowBreakpointClasses from "./useWindowBreakpointClasses";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  forwardRef: React.Ref<HTMLDivElement>;
};

/**
 * Div with applied breakpoint classNames according to the viewport.
 */
const DivWithWindowBreakpointClasses: FunctionComponent<Props> = ({
  forwardRef,
  className,
  ...rest
}) => {
  const breakpointClasses = useWindowBreakpointClasses();
  return (
    <div
      {...rest}
      ref={forwardRef}
      className={cn(className, breakpointClasses)}
    />
  );
};

const enhanced = withForwardRef(DivWithWindowBreakpointClasses);
export default enhanced;
