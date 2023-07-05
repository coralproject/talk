import { useRef } from "react";
import shallowEquals from "shallow-equals";

type Key = string | number;

/**
 * Memoizer that given `key` returns `value`.
 * `value` for `key` will be overridden whenever `deps` changes.
 */
type Memoizer = <T>(key: Key, value: T, deps?: any[]) => T;

/**
 * useMemoizer returns a memoizer, that
 * uses `key` to memoize given `value`.
 * `value` for `key` will be overridden whenever `deps` changes.
 */
export default function useMemoizer(): Memoizer {
  const valueMap = useRef<Record<Key, { deps: any[]; value: any }>>({});
  return <T>(key: Key, value: T, deps: any[] = []) => {
    const entry = valueMap.current[key];
    if (entry) {
      if (shallowEquals(deps, entry.deps)) {
        return entry.value;
      }
    }
    valueMap.current[key] = { deps, value };
    return value;
  };
}
