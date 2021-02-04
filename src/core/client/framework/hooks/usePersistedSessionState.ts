import { Dispatch, SetStateAction } from "react";
import usePersistedState from "./usePersistedState";

import { useCoralContext } from "coral-framework/lib/bootstrap";

function usePersistedSessionState<T>(
  key: string
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, T | undefined] {
  const { sessionStorage } = useCoralContext();
  return usePersistedState(key, sessionStorage);
}

export default usePersistedSessionState;
