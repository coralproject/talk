import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";

import { useCoralContext } from "coral-framework/lib/bootstrap";

function useInMemoryState<S>(
  key: string,
  initialState: S | (() => S)
): [S, Dispatch<SetStateAction<S>>] {
  const { inMemoryStorage } = useCoralContext();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const keyMemorized = useMemo(() => key, []);
  const value = inMemoryStorage.getItem(keyMemorized);
  const initState = value !== null ? value : initialState;

  const [state, setState] = useState(initState);
  const setStateWrapped = useCallback(
    (s: S) => {
      setState(s);
      inMemoryStorage.setItem(keyMemorized, s);
    },
    [inMemoryStorage, keyMemorized]
  );
  return [state, setStateWrapped];
}

export default useInMemoryState;
