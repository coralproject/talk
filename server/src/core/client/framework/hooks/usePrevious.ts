import { useEffect, useRef } from "react";

/**
 * usePrevious is a react hook that will return the
 * previous value.
 */
export default function usePrevious<T>(value: T): T | undefined;
export default function usePrevious<T, U>(value: T, initialValue: U): T | U;
export default function usePrevious<T, U>(
  value: T,
  initialValue?: U
): T | U | undefined {
  const ref = useRef<T | U | undefined>(initialValue);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current as T;
}
