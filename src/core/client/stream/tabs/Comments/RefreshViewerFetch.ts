import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "coral-framework/lib/relay";

import { RefreshViewerFetchQuery as QueryTypes } from "coral-stream/__generated__/RefreshViewerFetchQuery.graphql";

const RefreshViewerFetch = createFetch(
  "refreshViewer",
  (environment: Environment, variables: FetchVariables<QueryTypes>) => {
    return fetchQuery<QueryTypes>(
      environment,
      graphql`
        query RefreshViewerFetchQuery {
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

export default RefreshViewerFetch;
