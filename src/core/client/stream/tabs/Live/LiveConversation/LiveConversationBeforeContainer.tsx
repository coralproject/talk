import React, { FunctionComponent, useMemo } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { LiveConversationBeforeContainer_comment } from "coral-stream/__generated__/LiveConversationBeforeContainer_comment.graphql";
import { LiveConversationBeforeContainer_viewer } from "coral-stream/__generated__/LiveConversationBeforeContainer_viewer.graphql";
import { LiveConversationBeforeContainerPaginationQueryVariables } from "coral-stream/__generated__/LiveConversationBeforeContainerPaginationQuery.graphql";

import filterIgnoredComments from "../helpers/filterIgnoredComments";

interface RenderProps {
  beforeComments: LiveConversationBeforeContainer_comment["before"]["edges"];
  beforeHasMore: boolean;
  loadMoreBefore: () => Promise<void>;
  isLoadingMoreBefore: boolean;
}

type RenderPropsCallback = (props: RenderProps) => React.ReactElement;

interface Props {
  comment: LiveConversationBeforeContainer_comment;
  viewer: LiveConversationBeforeContainer_viewer | null;
  relay: RelayPaginationProp;
  cursor: string;
  children: RenderPropsCallback;
}

const LiveConversationBeforeContainer: FunctionComponent<Props> = ({
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
  LiveConversationBeforeContainerPaginationQueryVariables,
  "storyID"
>;

const enhanced = withPaginationContainer<
  Props,
  LiveConversationBeforeContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    comment: graphql`
      fragment LiveConversationBeforeContainer_comment on Comment
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
          inclusive: false
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
      fragment LiveConversationBeforeContainer_viewer on User {
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
      query LiveConversationBeforeContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $commentID: ID!
      ) {
        comment(id: $commentID) {
          id
          ...LiveConversationBeforeContainer_comment
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(LiveConversationBeforeContainer);

export default enhanced;
