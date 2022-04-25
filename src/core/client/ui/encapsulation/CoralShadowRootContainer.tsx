import React, { FunctionComponent } from "react";

import { withForwardRef } from "../hocs";
import DivWithShadowBreakpointClasses from "./DivWithShadowBreakpointClasses";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  forwardRef: React.Ref<HTMLDivElement>;
};

/**
 * Coral Entrypoint Container rendered into the Shadow DOM.
 * It's basically a div that sets `id="coral"`
 * and adds breakpoint classNames.
 */
const CoralShadowRootContainer: FunctionComponent<Props> = ({
  forwardRef,
  ...rest
}) => {
  return (
    <DivWithShadowBreakpointClasses
      ref={forwardRef}
      {...rest}
      id="coral"
      // exclude Coral from snippets
      data-nosnippet
    />
  );
};

const enhanced = withForwardRef(CoralShadowRootContainer);
export default enhanced;
