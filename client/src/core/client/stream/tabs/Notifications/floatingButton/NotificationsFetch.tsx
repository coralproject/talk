import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "coral-framework/lib/relay";

import { NotificationsFetchQuery as QueryTypes } from "coral-stream/__generated__/NotificationsFetchQuery.graphql";

const NotificationsFetch = createFetch(
  "refreshViewer",
  async (environment: Environment, variables: FetchVariables<QueryTypes>) => {
    const result = await fetchQuery<QueryTypes>(
      environment,
      graphql`
        query NotificationsFetchQuery {
          viewer {
            ...FloatingNotificationsContainer_viewer
          }
          settings {
            ...FloatingNotificationsContainer_settings
          }
        }
      `,
      variables,
      { force: true }
    );

    return result;
  }
);

export default NotificationsFetch;
