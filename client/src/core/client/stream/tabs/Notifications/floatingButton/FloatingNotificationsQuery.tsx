import React, { FunctionComponent, useCallback, useState } from "react";

import { useFetch } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";

import { NotificationsFetchQueryResponse } from "coral-stream/__generated__/NotificationsFetchQuery.graphql";

import FloatingNotificationsContainer from "./FloatingNotificationsContainer";
import NotificationsFetch from "./NotificationsFetch";

interface Props {
  showUserBox?: boolean;
  showTitle?: boolean;
}

const FloatingNotificationsQuery: FunctionComponent<Props> = ({
  showUserBox = true,
  showTitle = true,
}) => {
  const query = useFetch(NotificationsFetch);
  const [shouldLoad, setShouldLoad] = useState<boolean>(true);
  const [queryResult, setQueryResult] =
    useState<NotificationsFetchQueryResponse | null>();

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
      <FloatingNotificationsContainer
        viewer={queryResult.viewer}
        settings={queryResult.settings}
        showUserBox={showUserBox}
        showTitle={showTitle}
      />
    );
  }
};

export default FloatingNotificationsQuery;
