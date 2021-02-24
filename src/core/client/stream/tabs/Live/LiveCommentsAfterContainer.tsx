import React, { FunctionComponent } from "react";
import { graphql, RelayPaginationProp } from "react-relay";
import { FragmentRefs } from "relay-runtime";

import {
  useLoadMore,
  withPaginationContainer,
} from "coral-framework/lib/relay";

import { LiveCommentsAfterContainer_story } from "coral-stream/__generated__/LiveCommentsAfterContainer_story.graphql";
import { LiveCommentsAfterContainerPaginationQueryVariables } from "coral-stream/__generated__/LiveCommentsAfterContainerPaginationQuery.graphql";

interface RenderProps {
  afterComments: ReadonlyArray<{
    readonly " $fragmentRefs": FragmentRefs<
      "LiveChatContainerAfterCommentEdge"
    >;
  }>;
  afterHasMore: boolean;
  loadMoreAfter: () => Promise<void>;
  isLoadingMoreAfter: boolean;
}

type RenderPropsCallback = (props: RenderProps) => React.ReactElement;

interface Props {
  story: LiveCommentsAfterContainer_story;
  relay: RelayPaginationProp;
  cursor: string;
  children: RenderPropsCallback;
}

const LiveCommentsAfterContainer: FunctionComponent<Props> = ({
  story,
  relay,
  children,
}) => {
  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);

  const afterHasMore = story.after.pageInfo.hasNextPage;

  return children({
    afterComments: story.after.edges,
    afterHasMore,
    loadMoreAfter: loadMore,
    isLoadingMoreAfter: isLoadingMore,
  });
};

type FragmentVariables = Omit<
  LiveCommentsAfterContainerPaginationQueryVariables,
  "storyID"
>;

const enhanced = withPaginationContainer<
  Props,
  LiveCommentsAfterContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    story: graphql`
      fragment LiveCommentsAfterContainer_story on Story
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 5 }
          cursor: { type: "Cursor" }
        ) {
        id
        after: comments(
          flatten: true
          after: $cursor
          orderBy: CREATED_AT_ASC
          first: $count
        ) @connection(key: "Chat_after", filters: ["orderBy"]) {
          edges {
            ...LiveChatContainerAfterCommentEdge
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `,
  },
  {
    getConnectionFromProps({ story }) {
      return story && story.after;
    },
    getVariables(
      { story, cursor },
      { count, cursor: paginationCursor = cursor },
      fragmentVariables
    ) {
      return {
        count,
        cursor: paginationCursor,
        includeBefore: true,
        includeAfter: true,
        storyID: story.id,
        flattenReplies: true,
      };
    },
    query: graphql`
      query LiveCommentsAfterContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $storyID: ID
      ) {
        story(id: $storyID) {
          ...LiveCommentsAfterContainer_story
            @arguments(count: $count, cursor: $cursor)
        }
      }
    `,
  }
)(LiveCommentsAfterContainer);

export default enhanced;
