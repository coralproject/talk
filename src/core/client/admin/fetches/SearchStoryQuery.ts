import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { SearchStoryQuery as QueryTypes } from "coral-admin/__generated__/SearchStoryQuery.graphql";
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
        query SearchStoryQuery($query: String!, $limit: Int!) {
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
