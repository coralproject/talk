import { useEffect, useRef } from "react";

/**
 * useEffectAfterMount is a react hook that will run effects
 * except when the component has just been mounted.
 */
export default function useEffectAfterMount(
  effect: React.EffectCallback,
  deps: ReadonlyArray<any>
) {
  const mountedRef = useRef<boolean>(false);
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
