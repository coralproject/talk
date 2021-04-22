import React, { FunctionComponent, useMemo } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { LiveCommentRepliesAfterContainer_comment } from "coral-stream/__generated__/LiveCommentRepliesAfterContainer_comment.graphql";
import { LiveCommentRepliesAfterContainer_viewer } from "coral-stream/__generated__/LiveCommentRepliesAfterContainer_viewer.graphql";
import { LiveCommentRepliesAfterContainerPaginationQueryVariables } from "coral-stream/__generated__/LiveCommentRepliesAfterContainerPaginationQuery.graphql";

import filterIgnoredComments from "../helpers/filterIgnoredComments";

interface RenderProps {
  afterComments: LiveCommentRepliesAfterContainer_comment["after"]["edges"];
  afterHasMore: boolean;
  afterHasMoreFromMutation: boolean;
  loadMoreAfter: () => Promise<void>;
  isLoadingMoreAfter: boolean;
}

type RenderPropsCallback = (props: RenderProps) => React.ReactElement;

interface Props {
  comment: LiveCommentRepliesAfterContainer_comment;
  viewer: LiveCommentRepliesAfterContainer_viewer | null;
  relay: RelayPaginationProp;
  cursor: string;
  children: RenderPropsCallback;
}

const LiveCommentRepliesAfterContainer: FunctionComponent<Props> = ({
  comment,
  viewer,
  relay,
  children,
}) => {
  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);

  const afterHasMore =
    comment.after && comment.after.pageInfo
      ? comment.after.pageInfo.hasNextPage
      : false;
  const afterHasMoreFromMutation = Boolean(
    comment.after && comment.after.pageInfo
      ? comment.after.pageInfo.hasNextPageFromMutation
      : false
  );

  const initialIgnoredUsers = useMemo(
    () => (viewer ? viewer.ignoredUsers.map((u) => u.id) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewer?.id]
  );
  const filtered = useMemo(
    () =>
      filterIgnoredComments(
        initialIgnoredUsers,
        comment.after && comment.after.edges ? comment.after.edges : []
      ),
    [initialIgnoredUsers, comment.after]
  );

  return children({
    afterComments: filtered,
    afterHasMore,
    afterHasMoreFromMutation,
    loadMoreAfter: loadMore,
    isLoadingMoreAfter: isLoadingMore,
  });
};

type FragmentVariables = Omit<
  LiveCommentRepliesAfterContainerPaginationQueryVariables,
  "storyID"
>;

const enhanced = withPaginationContainer<
  Props,
  LiveCommentRepliesAfterContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    comment: graphql`
      fragment LiveCommentRepliesAfterContainer_comment on Comment
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "Cursor" }
        ) {
        id
        after: replies(
          flatten: true
          after: $cursor
          orderBy: CREATED_AT_ASC
          first: $count
        ) @connection(key: "Replies_after", filters: []) {
          edges {
            ...LiveConversationContainer_afterComments
            node {
              author {
                id
              }
            }
          }
          pageInfo {
            hasNextPage
            hasNextPageFromMutation
          }
        }
      }
    `,
    viewer: graphql`
      fragment LiveCommentRepliesAfterContainer_viewer on User {
        id
        ignoredUsers {
          id
        }
      }
    `,
  },
  {
    getConnectionFromProps({ comment }) {
      return comment && comment.after;
    },
    getVariables(
      { comment, cursor },
      { count, cursor: paginationCursor = cursor },
      fragmentVariables
    ) {
      return {
        count,
        cursor: paginationCursor,
        commentID: comment.id,
      };
    },
    query: graphql`
      query LiveCommentRepliesAfterContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $commentID: ID!
      ) {
        comment(id: $commentID) {
          id
          ...LiveCommentRepliesAfterContainer_comment
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(LiveCommentRepliesAfterContainer);

export default enhanced;
