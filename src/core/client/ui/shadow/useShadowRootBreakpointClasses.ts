import breakpoints from "coral-ui/theme/breakpoints";
import { useEffect, useState } from "react";

import onShadowRootWidthChange from "./onShadowRootWidthChange";
import useShadowRoot from "./useShadowRoot";

function convWidth2ClassName(width: number | null) {
  if (width === null) {
    return "";
  }
  // Not yet fully loaded.
  if (width < 10) {
    return "";
  }
  const result: string[] = [];
  const keys = Object.keys(breakpoints);
  keys.forEach((key: keyof typeof breakpoints) => {
    const bpWidth = breakpoints[key];
    if (width > bpWidth) {
      result.push(`coral-width-gt-${key}`);
    }
    if (width >= bpWidth) {
      result.push(`coral-width-gte-${key}`);
    }
    if (width < bpWidth) {
      result.push(`coral-width-lt-${key}`);
    }
    if (width <= bpWidth) {
      result.push(`coral-width-lte-${key}`);
    }
  });
  return result.join(" ");
}

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
