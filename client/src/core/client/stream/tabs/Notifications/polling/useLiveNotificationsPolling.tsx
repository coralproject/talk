import { useCallback, useEffect } from "react";
import { Environment, graphql } from "relay-runtime";

import {
  createFetch,
  fetchQuery,
  FetchVariables,
  useFetch,
  useLocal,
} from "coral-framework/lib/relay";

import { useLiveNotificationsPolling_settings } from "coral-stream/__generated__/useLiveNotificationsPolling_settings.graphql";
import { useLiveNotificationsPolling_viewer } from "coral-stream/__generated__/useLiveNotificationsPolling_viewer.graphql";
import { useLiveNotificationsPollingLocal } from "coral-stream/__generated__/useLiveNotificationsPollingLocal.graphql";
import { useLiveNotificationsPollingQuery } from "coral-stream/__generated__/useLiveNotificationsPollingQuery.graphql";

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

export const useLiveNotificationsPollingSettingsFragment = graphql`
  fragment useLiveNotificationsPolling_settings on Settings {
    inPageNotifications {
      enabled
    }
  }
`;

export const useLiveNotificationsPollingViewerFragment = graphql`
  fragment useLiveNotificationsPolling_viewer on User {
    id
    inPageNotifications {
      enabled
    }
  }
`;

export default function useLiveNotificationsPolling(
  settings: Pick<
    useLiveNotificationsPolling_settings,
    "inPageNotifications"
  > | null,
  viewer: Pick<
    useLiveNotificationsPolling_viewer,
    "inPageNotifications" | "id"
  > | null
) {
  const fetchNotifications = useFetch(FetchLiveNotificationsCached);

  const [{ notificationsPollRate }, setLocal] =
    useLocal<useLiveNotificationsPollingLocal>(graphql`
      fragment useLiveNotificationsPollingLocal on Local {
        notificationCount
        notificationsPollRate
      }
    `);

  const updater = useCallback(async () => {
    if (
      !viewer ||
      !viewer.inPageNotifications.enabled ||
      !settings?.inPageNotifications?.enabled
    ) {
      return;
    }

    const result = await fetchNotifications({ userID: viewer.id });

    if (
      result.notificationCount === undefined ||
      result.notificationCount === null
    ) {
      setLocal({ notificationCount: 0 });
    }

    setLocal({ notificationCount: result.notificationCount });
  }, [
    fetchNotifications,
    setLocal,
    settings?.inPageNotifications?.enabled,
    viewer,
  ]);

  useEffect(() => {
    if (
      !viewer ||
      !viewer.inPageNotifications.enabled ||
      !settings?.inPageNotifications?.enabled
    ) {
      return;
    }

    const interval = setInterval(updater, notificationsPollRate);

    return () => {
      clearInterval(interval);
    };
  }, [
    notificationsPollRate,
    settings?.inPageNotifications?.enabled,
    updater,
    viewer,
  ]);
}
