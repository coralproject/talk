import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { DiscoverOIDCConfigurationQuery as QueryTypes } from "talk-admin/__generated__/DiscoverOIDCConfigurationQuery.graphql";
import { createFetchContainer, fetchQuery } from "talk-framework/lib/relay";

export type DiscoverOIDCConfigurationVariables = QueryTypes["variables"];

const query = graphql`
  query DiscoverOIDCConfigurationQuery($issuer: String!) {
    discoverOIDCConfiguration(issuer: $issuer) {
      issuer
      authorizationURL
      tokenURL
      jwksURI
    }
  }
`;

function fetch(
  environment: Environment,
  variables: DiscoverOIDCConfigurationVariables
) {
  return fetchQuery<QueryTypes["response"]["discoverOIDCConfiguration"]>(
    environment,
    query,
    variables,
    { force: true }
  );
}

export const withDiscoverOIDCConfigurationFetch = createFetchContainer(
  "discoverOIDCConfiguration",
  fetch
);

export type DiscoverOIDCConfigurationFetch = (
  variables: DiscoverOIDCConfigurationVariables
) => Promise<QueryTypes["response"]["discoverOIDCConfiguration"]>;
