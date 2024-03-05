import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "relay-runtime";

import { useFetch, useLocal } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";

import { MobileNotificationsListFetchQueryResponse } from "coral-stream/__generated__/MobileNotificationsListFetchQuery.graphql";
import { MobileNotificationsListQueryLocal } from "coral-stream/__generated__/MobileNotificationsListQueryLocal.graphql";

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

  const [, setLocal] = useLocal<MobileNotificationsListQueryLocal>(graphql`
    fragment MobileNotificationsListQueryLocal on Local {
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
      <MobileNotificationsPaginator
        query={queryResult}
        viewerID={viewerID}
        reload={reload}
      />
    );
  }
};

export default MobileNotificationsListQuery;
