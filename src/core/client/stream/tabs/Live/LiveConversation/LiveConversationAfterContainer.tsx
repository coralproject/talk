import React, { FunctionComponent, useMemo } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { LiveConversationAfterContainer_comment } from "coral-stream/__generated__/LiveConversationAfterContainer_comment.graphql";
import { LiveConversationAfterContainer_viewer } from "coral-stream/__generated__/LiveConversationAfterContainer_viewer.graphql";
import { LiveConversationAfterContainerPaginationQueryVariables } from "coral-stream/__generated__/LiveConversationAfterContainerPaginationQuery.graphql";

import filterIgnoredComments from "../helpers/filterIgnoredComments";

interface RenderProps {
  afterComments: LiveConversationAfterContainer_comment["after"]["edges"];
  afterHasMore: boolean;
  loadMoreAfter: () => Promise<void>;
  isLoadingMoreAfter: boolean;
}

type RenderPropsCallback = (props: RenderProps) => React.ReactElement;

interface Props {
  comment: LiveConversationAfterContainer_comment;
  viewer: LiveConversationAfterContainer_viewer | null;
  relay: RelayPaginationProp;
  cursor: string;
  children: RenderPropsCallback;
}

const LiveConversationAfterContainer: FunctionComponent<Props> = ({
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
    loadMoreAfter: loadMore,
    isLoadingMoreAfter: isLoadingMore,
  });
};

type FragmentVariables = Omit<
  LiveConversationAfterContainerPaginationQueryVariables,
  "storyID"
>;

const enhanced = withPaginationContainer<
  Props,
  LiveConversationAfterContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    comment: graphql`
      fragment LiveConversationAfterContainer_comment on Comment
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
          }
        }
      }
    `,
    viewer: graphql`
      fragment LiveConversationAfterContainer_viewer on User {
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
      query LiveConversationAfterContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $commentID: ID!
      ) {
        comment(id: $commentID) {
          id
          ...LiveConversationAfterContainer_comment
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(LiveConversationAfterContainer);

export default enhanced;
