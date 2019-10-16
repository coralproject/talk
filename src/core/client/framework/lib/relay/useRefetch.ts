import { useState } from "react";
import { RelayPaginationProp } from "react-relay";
import { Variables } from "relay-runtime";

import { useEffectWhenChanged } from "coral-framework/hooks";

type RefetchFunction = () => void;
type IsRefetching = boolean;

/**
 * useRefetch is a react hook that returns a `refetch` callback
 * and a `isRefetching` boolean. Any change to the variables
 * will result in a `refetch`.
 */
export default function useRefetch<V = Variables>(
  relay: RelayPaginationProp,
  variables: V = {} as any
): [RefetchFunction, IsRefetching] {
  const [manualRefetchCount, setManualRefetchCount] = useState(0);
  const [refetching, setRefetching] = useState(false);
  useEffectWhenChanged(() => {
    setRefetching(true);
    const disposable = relay.refetchConnection(
      10,
      error => {
        setRefetching(false);
        if (error) {
          // eslint-disable-next-line no-console
          console.error(error);
        }
      },
      variables
    );
    return () => {
      if (disposable) {
        disposable.dispose();
      }
    };
  }, [
    relay.environment,
    manualRefetchCount,
    ...Object.keys(variables).reduce<any[]>((a, k) => {
      a.push((variables as any)[k]);
      return a;
    }, []),
  ]);
  return [() => setManualRefetchCount(manualRefetchCount + 1), refetching];
}
