import React, { FunctionComponent, useEffect, useState } from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap/CoralContext";
import { Flex, Spinner } from "coral-ui/components/v2";

interface Props {
  children: React.ReactNode;
}

function callWhenReallyIdle(window: Window, callback: () => void) {
  const supportsIdleCallbacks =
    (window as any).requestIdleCallback && (window as any).cancelIdleCallback;

  let handle: any = null;
  const rIC = (cb: () => void) => {
    if (supportsIdleCallbacks) {
      handle = (window as any).requestIdleCallback(cb, { timeout: 300 });
    } else {
      handle = setTimeout(cb, 0);
    }
  };

  // Call `requestIdleCallback` multiple times to ensure
  // that the browser is really idelling.
  const times = 5;
  let chained = callback;
  for (let i = 0; i <= times; i++) {
    const cur = chained;
    chained = () => rIC(cur);
  }
  chained();

  return () => {
    if (supportsIdleCallbacks) {
      (window as any).cancelIdleCallback(handle);
    } else {
      clearTimeout(handle);
    }
  };
}

/**
 * Show spinner, wait for browser to idle and start rendering.
 */
const SpinnerWhileRendering: FunctionComponent<Props> = (props) => {
  const [hidden, setHidden] = useState(true);
  const { window } = useCoralContext();
  useEffect(() => {
    // Ensure window has bee
    return callWhenReallyIdle(window, () => setHidden(false));
  }, [setHidden, window]);
  return (
    <>
      {hidden && (
        <Flex justifyContent="center">
          <Spinner />
        </Flex>
      )}
      {!hidden && props.children}
    </>
  );
};

export default SpinnerWhileRendering;
