import shallowEquals from "shallow-equals";

import useEffectAfterMount from "./useEffectAfterMount";
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
  // We use `useEffectAfterMount` to make sure `previous` has an assigned value.
  useEffectAfterMount(() => {
    if (!shallowEquals(deps, previous)) {
      callback();
    }
  }, deps);
}
