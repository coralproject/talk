import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "coral-framework/lib/relay";

import { FloatingNotificationsListFetchQuery as QueryTypes } from "coral-stream/__generated__/FloatingNotificationsListFetchQuery.graphql";

const FloatingNotificationsListFetch = createFetch(
  "refreshViewer",
  async (environment: Environment, variables: FetchVariables<QueryTypes>) => {
    const result = await fetchQuery<QueryTypes>(
      environment,
      graphql`
        query FloatingNotificationsListFetchQuery($viewerID: ID!) {
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

export default FloatingNotificationsListFetch;
