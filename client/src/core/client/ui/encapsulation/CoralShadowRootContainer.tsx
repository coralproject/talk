import React, { FunctionComponent } from "react";

import { useUIContext } from "../components/v2/UIContext/UIContext";
import { withForwardRef } from "../hocs";
import DivWithShadowBreakpointClasses from "./DivWithShadowBreakpointClasses";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  forwardRef: React.Ref<HTMLDivElement>;
};

/**
 * Coral Entrypoint Container rendered into the Shadow DOM.
 * It's basically a div that sets `id="coral"`
 * and adds breakpoint classNames.
 * It also sets the `dir` attribute for RTL support inside the Shadow DOM,
 * since [dir="rtl"] selectors from postcss-rtlcss need an ancestor with
 * the dir attribute within the same shadow tree.
 */
const CoralShadowRootContainer: FunctionComponent<Props> = ({
  forwardRef,
  ...rest
}) => {
  const { dir } = useUIContext();
  return (
    <DivWithShadowBreakpointClasses
      ref={forwardRef}
      {...rest}
      id="coral"
      dir={dir}
      // exclude Coral from snippets
      data-nosnippet
    />
  );
};

const enhanced = withForwardRef(CoralShadowRootContainer);
export default enhanced;
