import { useFetch, useLocal } from "coral-framework/lib/relay";

import { Environment, graphql } from "relay-runtime";

import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "coral-framework/lib/relay";

import { useLiveNotificationsPollingLocal } from "coral-stream/__generated__/useLiveNotificationsPollingLocal.graphql";
import { useLiveNotificationsPollingQuery } from "coral-stream/__generated__/useLiveNotificationsPollingQuery.graphql";
import { useCallback, useEffect } from "react";

export const FetchLiveNotificationsCached = createFetch(
  "useLiveNotificationsPollingQuery",
  (
    environment: Environment,
    variables: FetchVariables<useLiveNotificationsPollingQuery>
  ) => {
    return fetchQuery<useLiveNotificationsPollingQuery>(
      environment,
      graphql`
        query useLiveNotificationsPollingQuery($userID: ID!) {
          notificationCount(userID: $userID)
        }
      `,
      variables,
      { force: true }
    );
  }
);

export default function useLiveNotificationsPolling(
  userID?: string,
  intervalMs = 3000
) {
  const fetchNotifications = useFetch(FetchLiveNotificationsCached);

  const [, setLocal] = useLocal<useLiveNotificationsPollingLocal>(graphql`
    fragment useLiveNotificationsPollingLocal on Local {
      notificationCount
    }
  `);

  const updater = useCallback(async () => {
    if (!userID) {
      return;
    }

    const result = await fetchNotifications({ userID });

    if (
      result.notificationCount === undefined ||
      result.notificationCount === null
    ) {
      setLocal({ notificationCount: 0 });
    }

    setLocal({ notificationCount: result.notificationCount });
  }, [fetchNotifications, setLocal, userID]);

  useEffect(() => {
    const interval = setInterval(updater, intervalMs);
    return () => {
      clearInterval(interval);
    };
  }, [intervalMs, updater]);
}
