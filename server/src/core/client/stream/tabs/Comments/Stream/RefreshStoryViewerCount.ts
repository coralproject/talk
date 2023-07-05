import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "coral-framework/lib/relay";

import { RefreshStoryViewerCountQuery as QueryTypes } from "coral-stream/__generated__/RefreshStoryViewerCountQuery.graphql";

const RefreshStoryViewerCount = createFetch(
  "refreshStoryViewerCount",
  (environment: Environment, variables: FetchVariables<QueryTypes>) => {
    return fetchQuery<QueryTypes>(
      environment,
      graphql`
        query RefreshStoryViewerCountQuery($storyID: ID!) {
          settings {
            ...ViewersWatchingContainer_settings
          }
          story(id: $storyID) {
            ...ViewersWatchingContainer_story
          }
        }
      `,
      variables,
      { force: true }
    );
  }
);

export default RefreshStoryViewerCount;
