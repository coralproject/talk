import { EventHandler, FocusEvent, useCallback, useState } from "react";

/** useFocus tracks the focus state and returns the event handlers to do so */
export default function useFocus(): [
  boolean,
  { onFocus: EventHandler<FocusEvent>; onBlur: EventHandler<FocusEvent> }
] {
  const [focused, setFocused] = useState<boolean>(false);
  const onFocus = useCallback(() => setFocused(true), [setFocused]);
  const onBlur = useCallback(() => setFocused(false), [setFocused]);
  return [focused, { onFocus, onBlur }];
}
