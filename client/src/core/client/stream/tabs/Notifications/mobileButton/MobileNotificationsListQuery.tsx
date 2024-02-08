import React, { FunctionComponent, useCallback, useState } from "react";

import { useFetch } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";

import { MobileNotificationsListFetchQueryResponse } from "coral-stream/__generated__/MobileNotificationsListFetchQuery.graphql";

import MobileNotificationsListFetch from "./MobileNotificationsListFetch";
import MobileNotificationsPaginator from "./MobileNotificationsPaginator";

interface Props {
  viewerID: string;
}

const MobileNotificationsListQuery: FunctionComponent<Props> = ({
  viewerID,
}) => {
  const query = useFetch(MobileNotificationsListFetch);
  const [shouldLoad, setShouldLoad] = useState<boolean>(true);
  const [queryResult, setQueryResult] =
    useState<MobileNotificationsListFetchQueryResponse | null>();

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
      <MobileNotificationsPaginator query={queryResult} viewerID={viewerID} />
    );
  }
};

export default MobileNotificationsListQuery;
