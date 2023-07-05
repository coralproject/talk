import { EffectCallback, useEffect, useRef } from "react";

/**
 * useEffectAtUnmount is a react hook that will run effects
 * except when the component has just been mounted.
 */
export default function useEffectAtUnmount(effect: EffectCallback) {
  const callbackRef = useRef<EffectCallback>(effect);
  callbackRef.current = effect;
  useEffect(() => {
    return () => {
      callbackRef.current();
    };
  }, []);
}
