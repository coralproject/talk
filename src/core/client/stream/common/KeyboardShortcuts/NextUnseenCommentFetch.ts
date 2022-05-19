import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import {
  createFetch,
  fetchQuery,
  FetchVariables,
} from "coral-framework/lib/relay";

import { NextUnseenCommentFetchQuery as QueryTypes } from "coral-stream/__generated__/NextUnseenCommentFetchQuery.graphql";

const NextUnseenCommentFetch = createFetch(
  "nextUnseenComment",
  (environment: Environment, variables: FetchVariables<QueryTypes>) => {
    return fetchQuery<QueryTypes>(
      environment,
      graphql`
        query NextUnseenCommentFetchQuery(
          $id: ID
          $storyID: ID
          $orderBy: COMMENT_SORT!
          $viewNewCount: Int
        ) {
          nextUnseenComment(
            id: $id
            storyID: $storyID
            orderBy: $orderBy
            viewNewCount: $viewNewCount
          ) {
            commentID
            parentID
            rootCommentID
            index
            needToLoadNew
          }
        }
      `,
      variables
    );
  }
);

export default NextUnseenCommentFetch;
