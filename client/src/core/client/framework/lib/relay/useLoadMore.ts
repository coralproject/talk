import { useCallback, useState } from "react";
import { RelayPaginationProp } from "react-relay";

/**
 * useLoadMore is a react hook that returns a `loadMore` callback
 * and a `isLoadingMore` boolean.
 *
 * @param relay {RelayPaginationProp}
 * @param count {number}
 */
export default function useLoadMore(
  relay: RelayPaginationProp,
  count: number
): [() => Promise<void>, boolean] {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMore = useCallback(() => {
    if (!relay.hasMore() || relay.isLoading()) {
      return Promise.resolve();
    }
    setIsLoadingMore(true);
    return new Promise<void>((resolve, reject) => {
      relay.loadMore(count, (error) => {
        setIsLoadingMore(false);
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }, [relay]);
  return [loadMore, isLoadingMore];
}
