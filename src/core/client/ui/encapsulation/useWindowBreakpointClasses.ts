import { useEffect, useState } from "react";

import { useUIContext } from "coral-ui/components/v2";

import convWidth2ClassName from "../helpers/convWidth2ClassName";

/**
 * Return classNames that represents current breakpoint status
 * on the window width. E.g. it returns classes like:
 *   - `coral-width-gt-<breakpoint>`
 *   - `coral-width-gte-<breakpoint>`
 *   - `coral-width-lt-<breakpoint>`
 *   - `coral-width-lte-<breakpoint>`
 */
export default function useWindowBreakpointClasses() {
  const { renderWindow: window } = useUIContext();
  const [className, setClassName] = useState<string | null>(
    convWidth2ClassName(window.innerWidth)
  );
  useEffect(() => {
    const callback = () => {
      const newClassName = convWidth2ClassName(window.innerWidth);
      if (className !== newClassName) {
        setClassName(newClassName);
      }
    };
    window.addEventListener("resize", callback);
    return () => {
      window.removeEventListener("resize", callback);
    };
  }, [className, window]);
  return className;
}
