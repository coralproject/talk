import React, { FunctionComponent, useMemo } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { LiveCommentRepliesBeforeContainer_comment } from "coral-stream/__generated__/LiveCommentRepliesBeforeContainer_comment.graphql";
import { LiveCommentRepliesBeforeContainer_viewer } from "coral-stream/__generated__/LiveCommentRepliesBeforeContainer_viewer.graphql";
import { LiveCommentRepliesBeforeContainerPaginationQueryVariables } from "coral-stream/__generated__/LiveCommentRepliesBeforeContainerPaginationQuery.graphql";

import filterIgnoredComments from "../helpers/filterIgnoredComments";

interface RenderProps {
  beforeComments: LiveCommentRepliesBeforeContainer_comment["before"]["edges"];
  beforeHasMore: boolean;
  loadMoreBefore: () => Promise<void>;
  isLoadingMoreBefore: boolean;
}

type RenderPropsCallback = (props: RenderProps) => React.ReactElement;

interface Props {
  comment: LiveCommentRepliesBeforeContainer_comment;
  viewer: LiveCommentRepliesBeforeContainer_viewer | null;
  relay: RelayPaginationProp;
  cursor: string;
  children: RenderPropsCallback;
}

const LiveCommentRepliesBeforeContainer: FunctionComponent<Props> = ({
  viewer,
  comment,
  relay,
  children,
}) => {
  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);

  const beforeHasMore =
    comment.before && comment.before.pageInfo
      ? comment.before.pageInfo.hasNextPage
      : false;

  const initialIgnoredUsers = useMemo(
    () => (viewer ? viewer.ignoredUsers.map((u) => u.id) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [viewer?.id]
  );

  const beforeComments = useMemo(() => {
    const comments =
      comment.before && comment.before.edges ? comment.before.edges : [];
    return filterIgnoredComments(
      initialIgnoredUsers,
      comments.slice().reverse()
    );
  }, [comment.before, initialIgnoredUsers]);

  return children({
    beforeComments,
    beforeHasMore,
    loadMoreBefore: loadMore,
    isLoadingMoreBefore: isLoadingMore,
  });
};

type FragmentVariables = Omit<
  LiveCommentRepliesBeforeContainerPaginationQueryVariables,
  "storyID"
>;

const enhanced = withPaginationContainer<
  Props,
  LiveCommentRepliesBeforeContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    comment: graphql`
      fragment LiveCommentRepliesBeforeContainer_comment on Comment
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 10 }
          cursor: { type: "Cursor" }
        ) {
        id
        before: replies(
          flatten: true
          after: $cursor
          orderBy: CREATED_AT_DESC
          first: $count
          inclusive: true
        ) @connection(key: "Replies_before", filters: []) {
          edges {
            ...LiveConversationContainer_beforeComments
            node {
              author {
                id
              }
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `,
    viewer: graphql`
      fragment LiveCommentRepliesBeforeContainer_viewer on User {
        id
        ignoredUsers {
          id
        }
      }
    `,
  },
  {
    getConnectionFromProps({ comment }) {
      return comment && comment.before;
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
      query LiveCommentRepliesBeforeContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $commentID: ID!
      ) {
        comment(id: $commentID) {
          id
          ...LiveCommentRepliesBeforeContainer_comment
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(LiveCommentRepliesBeforeContainer);

export default enhanced;
