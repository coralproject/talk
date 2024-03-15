import React, { FunctionComponent, useCallback, useState } from "react";

import { useFetch } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";

import { FloatingNotificationsFetchQueryResponse } from "coral-stream/__generated__/FloatingNotificationsFetchQuery.graphql";

import NotificationsContainer from "../NotificationsContainer";
import FloatingNotificationsFetch from "./FloatingNotificationsFetch";

interface Props {
  showUserBox?: boolean;
  showTitle?: boolean;
}

const FloatingNotificationsQuery: FunctionComponent<Props> = ({
  showUserBox = true,
  showTitle = true,
}) => {
  const query = useFetch(FloatingNotificationsFetch);
  const [shouldLoad, setShouldLoad] = useState<boolean>(true);
  const [queryResult, setQueryResult] =
    useState<FloatingNotificationsFetchQueryResponse | null>();

  const load = useCallback(async () => {
    setShouldLoad(false);
    setQueryResult(null);
    const result = await query();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    setQueryResult(result);
  }, [query]);

  if (shouldLoad) {
    void load();
  }

  if (!queryResult || !queryResult.viewer) {
    return <Spinner />;
  } else {
    return (
      <NotificationsContainer
        viewer={queryResult.viewer}
        settings={queryResult.settings}
        showUserBox={showUserBox}
        showTitle={showTitle}
      />
    );
  }
};

export default FloatingNotificationsQuery;
