import React, { FunctionComponent, useCallback, useEffect } from "react";
import { graphql, GraphQLTaggedNode, RelayPaginationProp } from "react-relay";
import { withProps } from "recompose";

import {
  useLoadMore,
  useMutation,
  useSubscription,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { FragmentKeys } from "coral-framework/lib/relay/types";
import { Omit, PropTypesOf } from "coral-framework/types";
import { ReplyListContainer1_comment as CommentData } from "coral-stream/__generated__/ReplyListContainer1_comment.graphql";
import { ReplyListContainer1_settings as SettingsData } from "coral-stream/__generated__/ReplyListContainer1_settings.graphql";
import { ReplyListContainer1_story as StoryData } from "coral-stream/__generated__/ReplyListContainer1_story.graphql";
import { ReplyListContainer1_viewer as ViewerData } from "coral-stream/__generated__/ReplyListContainer1_viewer.graphql";
import { ReplyListContainer1PaginationQueryVariables } from "coral-stream/__generated__/ReplyListContainer1PaginationQuery.graphql";
import { ReplyListContainer5_comment as Comment5Data } from "coral-stream/__generated__/ReplyListContainer5_comment.graphql";

import { isCommentVisible } from "../helpers";
import CommentReplyCreatedSubscription from "./CommentReplyCreatedSubscription";
import LocalReplyListContainer from "./LocalReplyListContainer";
import ReplyList from "./ReplyList";
import ReplyListViewNewMutation from "./ReplyListViewNewMutation";

type UnpackArray<T> = T extends ReadonlyArray<infer U> ? U : any;
type ReplyNode5 = UnpackArray<Comment5Data["replies"]["edges"]>["node"];

interface BaseProps {
  viewer: ViewerData | null;
  story: StoryData;
  comment: CommentData;
  settings: SettingsData;
  relay: RelayPaginationProp;
  indentLevel: number;
  localReply: boolean | undefined;
}

type Props = BaseProps & {
  ReplyListComponent:
    | React.ComponentType<{ [P in FragmentKeys<BaseProps>]: any }>
    | undefined;
  /**
   * liveDirectRepliesInsertion if set to true,
   * live replies to the first level of comments
   * will be inserted directly into the comment stream
   * instead of hiding behind a button.
   */
  liveDirectRepliesInsertion?: boolean;
};

// TODO: (cvle) If this could be autogenerated.
type FragmentVariables = Omit<
  ReplyListContainer1PaginationQueryVariables,
  "commentID"
>;

export const ReplyListContainer: React.FunctionComponent<Props> = props => {
  const [showAll, isLoadingShowAll] = useLoadMore(props.relay, 999999999);
  const subcribeToCommentReplyCreated = useSubscription(
    CommentReplyCreatedSubscription
  );
  useEffect(() => {
    if (!props.story.settings.live.enabled) {
      return;
    }

    if (props.story.isClosed || props.settings.disableCommenting.enabled) {
      return;
    }
    if (props.indentLevel !== 1) {
      return;
    }
    const disposable = subcribeToCommentReplyCreated({
      ancestorID: props.comment.id,
      liveDirectRepliesInsertion: props.liveDirectRepliesInsertion,
    });
    return () => {
      disposable.dispose();
    };
  }, [
    subcribeToCommentReplyCreated,
    props.comment.id,
    props.indentLevel,
    props.relay.hasMore(),
    props.liveDirectRepliesInsertion,
    props.story.settings.live.enabled,
  ]);

  const viewNew = useMutation(ReplyListViewNewMutation);
  const onViewNew = useCallback(() => {
    viewNew({ commentID: props.comment.id });
  }, [props.comment.id, viewNew]);

  const viewNewCount =
    (props.comment.replies.viewNewEdges &&
      props.comment.replies.viewNewEdges.length) ||
    0;

  if (
    props.comment.replies == null ||
    (props.comment.replies.edges.length === 0 && viewNewCount === 0)
  ) {
    return null;
  }
  const comments =
    // Comment is not visible after a viewer action, so don't render it anymore.
    props.comment.lastViewerAction && !isCommentVisible(props.comment)
      ? []
      : props.comment.replies.edges.map(edge => ({
          ...edge.node,
          replyListElement: props.ReplyListComponent && (
            <props.ReplyListComponent
              viewer={props.viewer}
              comment={edge.node}
              story={props.story}
              settings={props.settings}
            />
          ),
          // ReplyListContainer5 contains replyCount.
          showConversationLink:
            ((edge.node as any) as ReplyNode5).replyCount > 0,
        }));
  return (
    <ReplyList
      viewer={props.viewer}
      comment={props.comment}
      comments={comments}
      story={props.story}
      settings={props.settings}
      onShowAll={showAll}
      hasMore={props.relay.hasMore()}
      disableShowAll={isLoadingShowAll}
      indentLevel={props.indentLevel}
      localReply={props.localReply}
      viewNewCount={viewNewCount}
      onViewNew={onViewNew}
    />
  );
};

function createReplyListContainer(
  indentLevel: number,
  fragments: {
    viewer: GraphQLTaggedNode;
    story: GraphQLTaggedNode;
    comment: GraphQLTaggedNode;
    settings: GraphQLTaggedNode;
  },
  query: GraphQLTaggedNode,
  ReplyListComponent?: Props["ReplyListComponent"],
  localReply?: boolean
) {
  return withProps({ indentLevel, ReplyListComponent, localReply })(
    withPaginationContainer<
      Props,
      ReplyListContainer1PaginationQueryVariables,
      FragmentVariables
    >(fragments, {
      direction: "forward",
      getConnectionFromProps(props) {
        return props.comment && props.comment.replies;
      },
      // This is also the default implementation of `getFragmentVariables` if it isn't provided.
      getFragmentVariables(prevVars, totalCount) {
        return {
          ...prevVars,
          count: totalCount,
        };
      },
      getVariables(props, { count, cursor }, fragmentVariables) {
        return {
          count,
          cursor,
          orderBy: fragmentVariables.orderBy,
          commentID: props.comment.id,
        };
      },
      query,
    })(ReplyListContainer)
  );
}

/**
 * LastReplyList uses the LocalReplyListContainer.
 */
const LastReplyList: FunctionComponent<
  PropTypesOf<typeof LocalReplyListContainer>
> = props => <LocalReplyListContainer {...props} indentLevel={6} />;

const ReplyListContainer5 = createReplyListContainer(
  5,
  {
    viewer: graphql`
      fragment ReplyListContainer5_viewer on User {
        ...CommentContainer_viewer
        ...IgnoredTombstoneOrHideContainer_viewer
        ...LocalReplyListContainer_viewer
      }
    `,
    settings: graphql`
      fragment ReplyListContainer5_settings on Settings {
        disableCommenting {
          enabled
        }
        ...LocalReplyListContainer_settings
        ...CommentContainer_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer5_story on Story {
        isClosed
        settings {
          live {
            enabled
          }
        }
        ...CommentContainer_story
        ...LocalReplyListContainer_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer5_comment on Comment
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
        ) {
        id
        status
        lastViewerAction
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          viewNewEdges {
            cursor
          }
          edges {
            node {
              id
              replyCount
              enteredLive
              ...CommentContainer_comment
              ...IgnoredTombstoneOrHideContainer_comment
              ...LocalReplyListContainer_comment
            }
          }
        }
      }
    `,
  },
  graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer5PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer5_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
  LastReplyList,
  true
);

const ReplyListContainer4 = createReplyListContainer(
  4,
  {
    viewer: graphql`
      fragment ReplyListContainer4_viewer on User {
        ...ReplyListContainer5_viewer
        ...CommentContainer_viewer
        ...IgnoredTombstoneOrHideContainer_viewer
      }
    `,
    settings: graphql`
      fragment ReplyListContainer4_settings on Settings {
        disableCommenting {
          enabled
        }
        ...ReplyListContainer5_settings
        ...CommentContainer_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer4_story on Story {
        isClosed
        settings {
          live {
            enabled
          }
        }
        ...ReplyListContainer5_story
        ...CommentContainer_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer4_comment on Comment
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
        ) {
        id
        status
        lastViewerAction
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          viewNewEdges {
            cursor
          }
          edges {
            node {
              id
              enteredLive
              ...CommentContainer_comment
              ...IgnoredTombstoneOrHideContainer_comment
              ...ReplyListContainer5_comment
            }
          }
        }
      }
    `,
  },
  graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer4PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer4_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
  ReplyListContainer5
);

const ReplyListContainer3 = createReplyListContainer(
  3,
  {
    viewer: graphql`
      fragment ReplyListContainer3_viewer on User {
        ...ReplyListContainer4_viewer
        ...CommentContainer_viewer
        ...IgnoredTombstoneOrHideContainer_viewer
      }
    `,
    settings: graphql`
      fragment ReplyListContainer3_settings on Settings {
        disableCommenting {
          enabled
        }
        ...ReplyListContainer4_settings
        ...CommentContainer_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer3_story on Story {
        isClosed
        settings {
          live {
            enabled
          }
        }
        ...ReplyListContainer4_story
        ...CommentContainer_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer3_comment on Comment
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
        ) {
        id
        status
        lastViewerAction
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          viewNewEdges {
            cursor
          }
          edges {
            node {
              id
              enteredLive
              ...CommentContainer_comment
              ...IgnoredTombstoneOrHideContainer_comment
              ...ReplyListContainer4_comment
            }
          }
        }
      }
    `,
  },
  graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer3PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer3_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
  ReplyListContainer4
);

const ReplyListContainer2 = createReplyListContainer(
  2,
  {
    viewer: graphql`
      fragment ReplyListContainer2_viewer on User {
        ...ReplyListContainer3_viewer
        ...CommentContainer_viewer
        ...IgnoredTombstoneOrHideContainer_viewer
      }
    `,
    settings: graphql`
      fragment ReplyListContainer2_settings on Settings {
        disableCommenting {
          enabled
        }
        ...ReplyListContainer3_settings
        ...CommentContainer_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer2_story on Story {
        isClosed
        settings {
          live {
            enabled
          }
        }
        ...ReplyListContainer3_story
        ...CommentContainer_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer2_comment on Comment
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
        ) {
        id
        status
        lastViewerAction
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          viewNewEdges {
            cursor
          }
          edges {
            node {
              id
              enteredLive
              ...CommentContainer_comment
              ...IgnoredTombstoneOrHideContainer_comment
              ...ReplyListContainer3_comment
            }
          }
        }
      }
    `,
  },
  graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer2PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer2_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
  ReplyListContainer3
);

const ReplyListContainer1 = createReplyListContainer(
  1,
  {
    viewer: graphql`
      fragment ReplyListContainer1_viewer on User {
        ...ReplyListContainer2_viewer
        ...CommentContainer_viewer
        ...IgnoredTombstoneOrHideContainer_viewer
      }
    `,
    settings: graphql`
      fragment ReplyListContainer1_settings on Settings {
        disableCommenting {
          enabled
        }
        ...ReplyListContainer2_settings
        ...CommentContainer_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer1_story on Story {
        isClosed
        settings {
          live {
            enabled
          }
        }
        ...ReplyListContainer2_story
        ...CommentContainer_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer1_comment on Comment
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 5 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
        ) {
        id
        status
        lastViewerAction
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          viewNewEdges {
            cursor
          }
          edges {
            node {
              id
              enteredLive
              ...CommentContainer_comment
              ...IgnoredTombstoneOrHideContainer_comment
              ...ReplyListContainer2_comment
            }
          }
        }
      }
    `,
  },
  graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer1PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer1_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
  ReplyListContainer2
);

export default ReplyListContainer1;
