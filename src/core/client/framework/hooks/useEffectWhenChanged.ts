import { useEffect } from "react";
import equals from "shallow-equals";

import usePrevious from "./usePrevious";

/**
 * useEffectWhenChanged is a react hook that will run effects
 * when value changed.
 */
export default function useEffectWhenChanged(
  callback: () => void,
  deps: ReadonlyArray<any>
) {
  const previous = usePrevious(deps);
  useEffect(() => {
    if (!equals(deps, previous)) {
      callback();
    }
  }, deps);
}
