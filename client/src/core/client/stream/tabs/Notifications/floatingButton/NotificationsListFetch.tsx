import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "coral-framework/lib/relay";

import { NotificationsListFetchQuery as QueryTypes } from "coral-stream/__generated__/NotificationsListFetchQuery.graphql";

const NotificationsListFetch = createFetch(
  "refreshViewer",
  async (environment: Environment, variables: FetchVariables<QueryTypes>) => {
    const result = await fetchQuery<QueryTypes>(
      environment,
      graphql`
        query NotificationsListFetchQuery($viewerID: ID!) {
          ...FloatingNotificationsPaginator_query
            @arguments(viewerID: $viewerID)
        }
      `,
      variables,
      { force: true }
    );

    return result;
  }
);

export default NotificationsListFetch;
