import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "coral-framework/lib/relay";

import { FloatingNotificationsFetchQuery as QueryTypes } from "coral-stream/__generated__/FloatingNotificationsFetchQuery.graphql";

const FloatingNotificationsFetch = createFetch(
  "refreshViewer",
  async (environment: Environment, variables: FetchVariables<QueryTypes>) => {
    const result = await fetchQuery<QueryTypes>(
      environment,
      graphql`
        query FloatingNotificationsFetchQuery {
          viewer {
            ...NotificationsContainer_viewer
          }
          settings {
            ...NotificationsContainer_settings
          }
        }
      `,
      variables,
      { force: true }
    );

    return result;
  }
);

export default FloatingNotificationsFetch;
