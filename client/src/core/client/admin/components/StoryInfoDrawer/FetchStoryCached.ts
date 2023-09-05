import { Environment, graphql } from "relay-runtime";

import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "coral-framework/lib/relay";

import { FetchStoryCachedQuery as QueryTypes } from "coral-admin/__generated__/FetchStoryCachedQuery.graphql";

const FetchStoryCached = createFetch(
  "fetchStoryCachedQuery",
  (environment: Environment, variables: FetchVariables<QueryTypes>) => {
    return fetchQuery<QueryTypes>(
      environment,
      graphql`
        query FetchStoryCachedQuery($storyID: ID!) {
          story(id: $storyID) {
            id
            cached
          }
        }
      `,
      variables,
      { force: true }
    );
  }
);

export default FetchStoryCached;
