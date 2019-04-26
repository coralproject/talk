import { useEffect, useRef } from "react";

/**
 * usePrevious is a react hook that will return the
 * previous value.
 */
export default function usePrevious<T>(value: T): T {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current as T;
}
