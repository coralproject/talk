import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "relay-runtime";

import { useFetch, useLocal } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";

import { FloatingNotificationsListFetchQueryResponse } from "coral-stream/__generated__/FloatingNotificationsListFetchQuery.graphql";
import { FloatingNotificationsListQueryLocal } from "coral-stream/__generated__/FloatingNotificationsListQueryLocal.graphql";

import FloatingNotificationsListFetch from "./FloatingNotificationsListFetch";
import FloatingNotificationsPaginator from "./FloatingNotificationsPaginator";

interface Props {
  viewerID: string;
}

const FloatingNotificationsListQuery: FunctionComponent<Props> = ({
  viewerID,
}) => {
  const query = useFetch(FloatingNotificationsListFetch);
  const [shouldLoad, setShouldLoad] = useState<boolean>(true);
  const [queryResult, setQueryResult] =
    useState<FloatingNotificationsListFetchQueryResponse | null>();

  const [, setLocal] = useLocal<FloatingNotificationsListQueryLocal>(graphql`
    fragment FloatingNotificationsListQueryLocal on Local {
      hasNewNotifications
    }
  `);

  const load = useCallback(async () => {
    setShouldLoad(false);
    setQueryResult(null);
    const result = await query({ viewerID });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setQueryResult(result);
  }, [query, viewerID]);

  const reload = useCallback(async () => {
    await load();
    setLocal({ hasNewNotifications: false });
  }, [load, setLocal]);

  if (shouldLoad) {
    void load();
  }

  if (!queryResult) {
    return <Spinner />;
  } else {
    return (
      <FloatingNotificationsPaginator
        query={queryResult}
        viewerID={viewerID}
        reload={reload}
      />
    );
  }
};

export default FloatingNotificationsListQuery;
