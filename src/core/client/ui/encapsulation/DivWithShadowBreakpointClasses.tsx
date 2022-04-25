import cn from "classnames";
import React, { FunctionComponent } from "react";

import { withForwardRef } from "../hocs";
import useShadowRootBreakpointClasses from "./useShadowRootBreakpointClasses";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  forwardRef: React.Ref<HTMLDivElement>;
};

/**
 * Div with applied breakpoint classNames according to the shadow root.
 */
const DivWithShadowBreakpointClasses: FunctionComponent<Props> = ({
  forwardRef,
  className,
  ...rest
}) => {
  const breakpointClasses = useShadowRootBreakpointClasses();
  return (
    <div
      {...rest}
      ref={forwardRef}
      className={cn(className, breakpointClasses)}
    />
  );
};

const enhanced = withForwardRef(DivWithShadowBreakpointClasses);
export default enhanced;
