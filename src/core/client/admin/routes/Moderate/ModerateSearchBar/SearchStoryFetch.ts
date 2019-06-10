import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { SearchStoryFetchQuery as QueryTypes } from "coral-admin/__generated__/SearchStoryFetchQuery.graphql";
import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "coral-framework/lib/relay";

const SearchStoryFetch = createFetch(
  "searchStory",
  (environment: Environment, variables: FetchVariables<QueryTypes>) => {
    return fetchQuery<QueryTypes>(
      environment,
      graphql`
        query SearchStoryFetchQuery($query: String!, $limit: Int!) {
          stories(query: $query, first: $limit) {
            edges {
              node {
                id
                metadata {
                  title
                  author
                }
              }
            }
            pageInfo {
              hasNextPage
            }
          }
        }
      `,
      variables,
      { force: true }
    );
  }
);

export default SearchStoryFetch;
