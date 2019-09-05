import React, { FunctionComponent, useEffect, useState } from "react";

import Spinner from "coral-stream/common/Spinner";
import { Flex } from "coral-ui/components";

interface Props {
  children: React.ReactNode;
}

function callWhenReallyIdle(callback: () => void) {
  let handle: any = null;
  const rIC = (cb: () => void) => {
    if ((window as any).requestIdleCallback) {
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
    if ((window as any).requestIdleCallback) {
      (window as any).cancelIdleCallback(handle);
    } else {
      clearTimeout(handle);
    }
  };
}

/**
 * Show spinner, wait for browser to idle and start rendering.
 */
const SpinnerWhileRendering: FunctionComponent<Props> = props => {
  // In our tests, we don't actually "render", so just skip this.
  if (process.env.NODE_ENV === "test") {
    return <>{props.children}</>;
  }
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    // Ensure window has bee
    return callWhenReallyIdle(() => setHidden(false));
  }, [setHidden]);
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
