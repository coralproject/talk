import { Dispatch, SetStateAction, useCallback, useState } from "react";

function useToggleState(
  initialState = false
): [boolean, Dispatch<SetStateAction<boolean>>, () => void] {
  const [state, setState] = useState<boolean>(initialState);
  const toggleState = useCallback(() => setState((s) => !s), [setState]);

  return [state, setState, toggleState];
}

export default useToggleState;
