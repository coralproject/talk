import { Dispatch, SetStateAction } from "react";
import usePersistedState from "./usePersistedState";

import { useCoralContext } from "coral-framework/lib/bootstrap";

function usePersistedLocalState<T>(
  key: string
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, T | undefined] {
  const { localStorage } = useCoralContext();
  return usePersistedState(key, localStorage);
}

export default usePersistedLocalState;
