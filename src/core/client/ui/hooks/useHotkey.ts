import key from "keymaster";
import { useCallback, useEffect } from "react";

type CallbackFn = (event: KeyboardEvent) => void;

export default function useHotkey(
  trigger: string,
  callback: CallbackFn,
  deps: any[] = []
) {
  const memoisedCallback = useCallback(callback, deps);
  useEffect(() => {
    key(trigger, callback);

    return () => key.unbind(trigger);
  }, [memoisedCallback]);
}
