import { useCallback, useState } from "react";
import { RelayPaginationProp } from "react-relay";

import { ViewerLoadMoreEvent } from "../events";
import { useCoralContext } from "../bootstrap";

/**
 * useLoadMore is a react hook that returns a `loadMore` callback
 * and a `isLoadingMore` boolean.
 *
 * @param relay {RelayPaginationProp}
 * @param count {number}
 * @param viewerLoadMoreEvent {ViewerLoadMoreEvent} if set will emit event
 */
export default function useLoadMore(
  relay: RelayPaginationProp,
  count: number,
  viewerLoadMoreEvent?: ViewerLoadMoreEvent
): [() => void, boolean] {
  const { eventEmitter } = useCoralContext();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMore = useCallback(() => {
    if (!relay.hasMore() || relay.isLoading()) {
      return;
    }
    let event: ReturnType<ViewerLoadMoreEvent["begin"]> | null = null;
    if (viewerLoadMoreEvent) {
      event = viewerLoadMoreEvent.begin(eventEmitter, { count });
    }
    setIsLoadingMore(true);
    relay.loadMore(count, error => {
      setIsLoadingMore(false);
      if (error) {
        if (event) {
          event.error({ message: error.message, code: (error as any).code });
        }
        // eslint-disable-next-line no-console
        console.error(error);
      } else if (event) {
        event.success();
      }
    });
  }, [relay]);
  return [loadMore, isLoadingMore];
}
