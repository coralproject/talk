import { useEffect, useState } from "react";

import convWidth2ClassName from "../helpers/convWidth2ClassName";
import onShadowRootWidthChange from "./onShadowRootWidthChange";
import useShadowRoot from "./useShadowRoot";

/**
 * Return classNames that represents current breakpoint status
 * on the shadow root width. E.g. it returns classes like:
 *   - `coral-width-gt-<breakpoint>`
 *   - `coral-width-gte-<breakpoint>`
 *   - `coral-width-lt-<breakpoint>`
 *   - `coral-width-lte-<breakpoint>`
 */
export default function useShadowRootBreakpointClasses() {
  const shadowRoot = useShadowRoot();
  const [className, setClassName] = useState<string | null>(null);
  useEffect(() => {
    if (!shadowRoot) {
      return;
    }
    return onShadowRootWidthChange(shadowRoot, (width) => {
      const newClassName = convWidth2ClassName(width);
      if (className !== newClassName) {
        setClassName(newClassName);
      }
    });
  }, [shadowRoot, className]);
  if (className !== null) {
    return className;
  }
  return "";
}
