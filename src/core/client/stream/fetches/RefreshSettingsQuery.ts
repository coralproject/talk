import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { createFetchContainer, fetchQuery } from "talk-framework/lib/relay";
import { RefreshSettingsQuery as QueryTypes } from "talk-stream/__generated__/RefreshSettingsQuery.graphql";

const query = graphql`
  query RefreshSettingsQuery {
    settings {
      ...StreamContainer_settings
    }
  }
`;

function fetch(environment: Environment) {
  return fetchQuery<QueryTypes["response"]["settings"]>(
    environment,
    query,
    {},
    { force: true }
  );
}

export const withRefreshSettingsFetch = createFetchContainer(
  "refreshSettings",
  fetch
);

export type RefreshSettingsFetch = () => Promise<
  QueryTypes["response"]["settings"]
>;
