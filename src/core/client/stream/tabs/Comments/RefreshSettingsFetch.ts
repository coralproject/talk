import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "coral-framework/lib/relay";
import { RefreshSettingsFetchQuery as QueryTypes } from "coral-stream/__generated__/RefreshSettingsFetchQuery.graphql";

const RefreshSettingsFetch = createFetch(
  "refreshSettings",
  (environment: Environment, variables: FetchVariables<QueryTypes>) => {
    return fetchQuery<QueryTypes>(
      environment,
      graphql`
        query RefreshSettingsFetchQuery($storyID: ID!) {
          settings {
            ...StreamContainer_settings
            ...PermalinkViewContainer_settings
          }
          # We also refetch story props that are
          # dependent on the settings.
          story(id: $storyID) {
            closedAt
            isClosed
          }
        }
      `,
      variables,
      { force: true }
    );
  }
);

export default RefreshSettingsFetch;
