import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { DiscoverOIDCConfigurationQuery as QueryTypes } from "talk-admin/__generated__/DiscoverOIDCConfigurationQuery.graphql";
import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "talk-framework/lib/relay";

const DiscoverOIDCConfigurationFetch = createFetch(
  "discoverOIDCConfiguration",
  (environment: Environment, variables: FetchVariables<QueryTypes>) => {
    return fetchQuery<QueryTypes>(
      environment,
      graphql`
        query DiscoverOIDCConfigurationQuery($issuer: String!) {
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
