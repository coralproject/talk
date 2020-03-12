import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "coral-framework/lib/relay";

import { SearchStoryFetchQuery as QueryTypes } from "coral-admin/__generated__/SearchStoryFetchQuery.graphql";

const SearchStoryFetch = createFetch(
  "searchStory",
  (environment: Environment, variables: FetchVariables<QueryTypes>) => {
    return fetchQuery<QueryTypes>(
      environment,
      graphql`
        query SearchStoryFetchQuery(
          $query: String!
          $limit: Int!
          $siteID: ID
        ) {
          stories(query: $query, first: $limit, siteID: $siteID) {
            edges {
              node {
                id
                site {
                  name
                  id
                }
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
