import { useCallback, useState } from "react";
import { RelayPaginationProp } from "react-relay";

/**
 * useLoadMore is a react hook that returns a `loadMore` callback
 * and a `isLoadingMore` boolean.
 */
export default function useLoadMore(
  relay: RelayPaginationProp,
  count: number
): [() => void, boolean] {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMore = useCallback(() => {
    if (!relay.hasMore() || relay.isLoading()) {
      return;
    }
    setIsLoadingMore(true);
    relay.loadMore(count, error => {
      setIsLoadingMore(false);
      if (error) {
        // tslint:disable-next-line:no-console
        console.error(error);
      }
    });
  }, [relay]);
  return [loadMore, isLoadingMore];
}
