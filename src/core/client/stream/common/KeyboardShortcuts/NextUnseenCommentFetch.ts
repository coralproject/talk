import { graphql } from "react-relay";
import { Environment } from "relay-runtime";

import { createFetch, fetchQuery, useLocal } from "coral-framework/lib/relay";

import { NextUnseenCommentFetch_local } from "coral-stream/__generated__/NextUnseenCommentFetch_local.graphql";
import { NextUnseenCommentFetchQuery as QueryTypes } from "coral-stream/__generated__/NextUnseenCommentFetchQuery.graphql";

const NextUnseenCommentFetch = createFetch(
  "searchStory",
  (environment: Environment) => {
    const [local] = useLocal<NextUnseenCommentFetch_local>(graphql`
      fragment NextUnseenCommentFetch_local on Local {
        storyID
        commentsOrderBy
        commentWithTraversalFocus
      }
    `);
    return fetchQuery<QueryTypes>(
      environment,
      graphql`
        query NextUnseenCommentFetchQuery(
          $id: ID
          $storyID: ID
          $orderBy: COMMENT_SORT!
        ) {
          nextUnseenComment(id: $id, storyID: $storyID, orderBy: $orderBy) {
            commentID
            parentID
            rootCommentID
          }
        }
      `,
      {
        id: local.commentWithTraversalFocus,
        storyID: local.storyID,
        orderBy: local.commentsOrderBy,
      }
    );
  }
);

export default NextUnseenCommentFetch;
