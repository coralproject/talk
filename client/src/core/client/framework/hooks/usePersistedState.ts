import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import useDebounce from "react-use/lib/useDebounce";

import { PromisifiedStorage } from "coral-framework/lib/storage";

function keyFn(key: string): string {
  return `persisted:${key}`;
}

function usePersistedState<T>(
  key: string,
  storage: PromisifiedStorage
): [T | undefined, Dispatch<SetStateAction<T | undefined>>, T | undefined] {
  const [state, setState] = useState<T>();
  const [initialState, setInitialState] = useState<T>();
  const storageState = useRef<T>();

  useEffect(() => {
    async function init() {
      try {
        const value = await storage.getItem(keyFn(key));
        if (!value) {
          return;
        }

        const parsed: T = JSON.parse(value);

        setState(parsed);
        setInitialState(parsed);
        storageState.current = parsed;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    }

    void init();
  }, [key, storage]);

  useDebounce(
    async () => {
      if (state === storageState.current) {
        return;
      }

      try {
        if (state) {
          await storage.setItem(keyFn(key), JSON.stringify(state));
        } else {
          await storage.removeItem(keyFn(key));
        }

        storageState.current = state;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },
    100,
    [state, storage, key]
  );

  return [state, setState, initialState];
}

export default usePersistedState;
