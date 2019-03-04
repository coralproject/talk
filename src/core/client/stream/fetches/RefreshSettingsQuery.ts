import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { createFetchContainer, fetchQuery } from "talk-framework/lib/relay";
import { RefreshSettingsQuery as QueryTypes } from "talk-stream/__generated__/RefreshSettingsQuery.graphql";

export type RefreshSettingsVariables = QueryTypes["variables"];

const query = graphql`
  query RefreshSettingsQuery($storyID: ID!) {
    settings {
      ...StreamContainer_settings
    }
    # We also refrech story props that are
    # dependent on the settings.
    story(id: $storyID) {
      closedAt
      isClosed
    }
  }
`;

function fetch(environment: Environment, variables: RefreshSettingsVariables) {
  return fetchQuery<QueryTypes["response"]["settings"]>(
    environment,
    query,
    variables,
    { force: true }
  );
}

export const withRefreshSettingsFetch = createFetchContainer(
  "refreshSettings",
  fetch
);

export type RefreshSettingsFetch = (
  variables: RefreshSettingsVariables
) => Promise<QueryTypes["response"]["settings"]>;
