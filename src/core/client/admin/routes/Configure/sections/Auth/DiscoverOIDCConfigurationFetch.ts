import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { DiscoverOIDCConfigurationFetchQuery as QueryTypes } from "coral-admin/__generated__/DiscoverOIDCConfigurationFetchQuery.graphql";
import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "coral-framework/lib/relay";

const DiscoverOIDCConfigurationFetch = createFetch(
  "discoverOIDCConfiguration",
  (environment: Environment, variables: FetchVariables<QueryTypes>) => {
    return fetchQuery<QueryTypes>(
      environment,
      graphql`
        query DiscoverOIDCConfigurationFetchQuery($issuer: String!) {
          discoverOIDCConfiguration(issuer: $issuer) {
            issuer
            authorizationURL
            tokenURL
            jwksURI
          }
        }
      `,
      variables,
      { force: true }
    );
  }
);

export default DiscoverOIDCConfigurationFetch;
