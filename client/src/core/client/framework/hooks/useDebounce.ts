import { useLayoutEffect, useMemo, useRef, useState } from "react";

const useDebounce = (callback: (...args: any[]) => void, delay: number) => {
  const callbackRef = useRef(callback);

  useLayoutEffect(() => {
    callbackRef.current = callback;
  });

  const [timer, setTimer] = useState<number | null>(null);

  const naiveDebounce = useMemo(() => {
    const deb = (
      func: (...args: any[]) => void,
      delayMs: number,
      ...args: any[]
    ) => {
      if (timer) {
        clearTimeout(timer);
        setTimer(null);
      }

      const t = setTimeout(() => {
        func(args);
      }, delayMs);

      setTimer(t as unknown as number);
    };

    return deb;
  }, [timer, setTimer]);

  return useMemo(
    () =>
      (...args: any) =>
        naiveDebounce(callbackRef.current, delay, args),
    [delay, naiveDebounce]
  );
};

export default useDebounce;
