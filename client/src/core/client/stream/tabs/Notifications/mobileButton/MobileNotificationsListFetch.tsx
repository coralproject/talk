import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "coral-framework/lib/relay";

import { MobileNotificationsListFetchQuery as QueryTypes } from "coral-stream/__generated__/MobileNotificationsListFetchQuery.graphql";

const MobileNotificationsListFetch = createFetch(
  "refreshViewer",
  async (environment: Environment, variables: FetchVariables<QueryTypes>) => {
    const result = await fetchQuery<QueryTypes>(
      environment,
      graphql`
        query MobileNotificationsListFetchQuery($viewerID: ID!) {
          ...MobileNotificationsPaginator_query @arguments(viewerID: $viewerID)
        }
      `,
      variables,
      { force: true }
    );

    return result;
  }
);

export default MobileNotificationsListFetch;
