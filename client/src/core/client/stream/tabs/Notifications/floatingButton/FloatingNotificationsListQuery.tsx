import React, { FunctionComponent, useCallback, useState } from "react";

import { useFetch } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";

import { NotificationsListFetchQueryResponse } from "coral-stream/__generated__/NotificationsListFetchQuery.graphql";

import FloatingNotificationsPaginator from "./FloatingNotificationsPaginator";
import NotificationsListFetch from "./NotificationsListFetch";

interface Props {
  viewerID: string;
}

const FloatingNotificationsListQuery: FunctionComponent<Props> = ({
  viewerID,
}) => {
  const query = useFetch(NotificationsListFetch);
  const [shouldLoad, setShouldLoad] = useState<boolean>(true);
  const [queryResult, setQueryResult] =
    useState<NotificationsListFetchQueryResponse | null>();

  const load = useCallback(async () => {
    setShouldLoad(false);
    setQueryResult(null);
    const result = await query({ viewerID });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setQueryResult(result);
  }, [query, viewerID]);

  if (shouldLoad) {
    void load();
  }

  if (!queryResult) {
    return <Spinner />;
  } else {
    return (
      <FloatingNotificationsPaginator query={queryResult} viewerID={viewerID} />
    );
  }
};

export default FloatingNotificationsListQuery;
