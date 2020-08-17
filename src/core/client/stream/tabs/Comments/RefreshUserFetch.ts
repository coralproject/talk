import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "coral-framework/lib/relay";

import { RefreshUserFetchQuery as QueryTypes } from "coral-stream/__generated__/RefreshUserFetchQuery.graphql";

const RefreshUserFetch = createFetch(
  "refreshUser",
  (environment: Environment, variables: FetchVariables<QueryTypes>) => {
    return fetchQuery<QueryTypes>(
      environment,
      graphql`
        query RefreshUserFetchQuery {
          viewer {
            ...StreamContainer_viewer
          }
        }
      `,
      variables,
      { force: true }
    );
  }
);

export default RefreshUserFetch;
