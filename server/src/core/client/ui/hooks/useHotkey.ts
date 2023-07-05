import key from "keymaster";
import { useEffect, useRef } from "react";

type CallbackFn = (event: KeyboardEvent) => void;
interface Ref {
  current: any;
}

export default function useHotkey(trigger: string, handler: CallbackFn) {
  const savedHandler: Ref = useRef();
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const eventListener = () => savedHandler.current();

    key(trigger, eventListener);

    return () => {
      key.unbind(trigger);
    };
  }, [trigger]);
}
