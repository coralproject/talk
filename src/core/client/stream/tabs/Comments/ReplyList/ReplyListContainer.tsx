import React, { useCallback } from "react";
import {
  createFragmentContainer as createRelayFragmentContainer,
  graphql,
  GraphQLTaggedNode,
  RelayPaginationProp,
} from "react-relay";
import { withProps } from "recompose";

import useMemoizer from "coral-framework/hooks/useMemoizer";
import { useViewerNetworkEvent } from "coral-framework/lib/events";
import {
  useLoadMore,
  useLocal,
  useMutation,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { FragmentKeys } from "coral-framework/lib/relay/types";
import { Overwrite } from "coral-framework/types";
import { MAX_REPLY_INDENT_DEPTH } from "coral-stream/constants";

import {
  ShowAllRepliesEvent,
  ViewNewRepliesNetworkEvent,
} from "coral-stream/events";

import { ReplyListContainer1_comment } from "coral-stream/__generated__/ReplyListContainer1_comment.graphql";
import { ReplyListContainer1_settings } from "coral-stream/__generated__/ReplyListContainer1_settings.graphql";
import { ReplyListContainer1_story } from "coral-stream/__generated__/ReplyListContainer1_story.graphql";
import { ReplyListContainer1_viewer } from "coral-stream/__generated__/ReplyListContainer1_viewer.graphql";
import { ReplyListContainer1PaginationQueryVariables } from "coral-stream/__generated__/ReplyListContainer1PaginationQuery.graphql";
import { ReplyListContainer2_comment } from "coral-stream/__generated__/ReplyListContainer2_comment.graphql";
import { ReplyListContainer2_settings } from "coral-stream/__generated__/ReplyListContainer2_settings.graphql";
import { ReplyListContainer2_story } from "coral-stream/__generated__/ReplyListContainer2_story.graphql";
import { ReplyListContainer2_viewer } from "coral-stream/__generated__/ReplyListContainer2_viewer.graphql";
import { ReplyListContainer2PaginationQueryVariables } from "coral-stream/__generated__/ReplyListContainer2PaginationQuery.graphql";
import { ReplyListContainer3_comment } from "coral-stream/__generated__/ReplyListContainer3_comment.graphql";
import { ReplyListContainer3_settings } from "coral-stream/__generated__/ReplyListContainer3_settings.graphql";
import { ReplyListContainer3_story } from "coral-stream/__generated__/ReplyListContainer3_story.graphql";
import { ReplyListContainer3_viewer } from "coral-stream/__generated__/ReplyListContainer3_viewer.graphql";
import { ReplyListContainer3PaginationQueryVariables } from "coral-stream/__generated__/ReplyListContainer3PaginationQuery.graphql";
import { ReplyListContainer4_comment } from "coral-stream/__generated__/ReplyListContainer4_comment.graphql";
import { ReplyListContainer4_settings } from "coral-stream/__generated__/ReplyListContainer4_settings.graphql";
import { ReplyListContainer4_story } from "coral-stream/__generated__/ReplyListContainer4_story.graphql";
import { ReplyListContainer4_viewer } from "coral-stream/__generated__/ReplyListContainer4_viewer.graphql";
import { ReplyListContainer4PaginationQueryVariables } from "coral-stream/__generated__/ReplyListContainer4PaginationQuery.graphql";
import { ReplyListContainer5_comment } from "coral-stream/__generated__/ReplyListContainer5_comment.graphql";
import { ReplyListContainer5_settings } from "coral-stream/__generated__/ReplyListContainer5_settings.graphql";
import { ReplyListContainer5_story } from "coral-stream/__generated__/ReplyListContainer5_story.graphql";
import { ReplyListContainer5_viewer } from "coral-stream/__generated__/ReplyListContainer5_viewer.graphql";
import { ReplyListContainer5PaginationQueryVariables } from "coral-stream/__generated__/ReplyListContainer5PaginationQuery.graphql";
import { ReplyListContainer6_comment } from "coral-stream/__generated__/ReplyListContainer6_comment.graphql";
import { ReplyListContainer6_settings } from "coral-stream/__generated__/ReplyListContainer6_settings.graphql";
import { ReplyListContainer6_story } from "coral-stream/__generated__/ReplyListContainer6_story.graphql";
import { ReplyListContainer6_viewer } from "coral-stream/__generated__/ReplyListContainer6_viewer.graphql";
import { ReplyListContainer6PaginationQueryVariables } from "coral-stream/__generated__/ReplyListContainer6PaginationQuery.graphql";
import { ReplyListContainerLast_comment } from "coral-stream/__generated__/ReplyListContainerLast_comment.graphql";
import { ReplyListContainerLast_settings } from "coral-stream/__generated__/ReplyListContainerLast_settings.graphql";
import { ReplyListContainerLast_story } from "coral-stream/__generated__/ReplyListContainerLast_story.graphql";
import { ReplyListContainerLast_viewer } from "coral-stream/__generated__/ReplyListContainerLast_viewer.graphql";
import { ReplyListContainerLastFlattened_comment } from "coral-stream/__generated__/ReplyListContainerLastFlattened_comment.graphql";
import { ReplyListContainerLastFlattened_settings } from "coral-stream/__generated__/ReplyListContainerLastFlattened_settings.graphql";
import { ReplyListContainerLastFlattened_story } from "coral-stream/__generated__/ReplyListContainerLastFlattened_story.graphql";
import { ReplyListContainerLastFlattened_viewer } from "coral-stream/__generated__/ReplyListContainerLastFlattened_viewer.graphql";
import { ReplyListContainerLastFlattenedPaginationQueryVariables } from "coral-stream/__generated__/ReplyListContainerLastFlattenedPaginationQuery.graphql";
import { ReplyListContainerLocal } from "coral-stream/__generated__/ReplyListContainerLocal.graphql";

import MarkCommentsAsSeenMutation from "../Comment/MarkCommentsAsSeenMutation";
import { isPublished, useStaticFlattenReplies } from "../helpers";
import LocalReplyListContainer from "./LocalReplyListContainer";
import ReplyList from "./ReplyList";
import ReplyListViewNewMutation from "./ReplyListViewNewMutation";

// Combine fragment types.
type Viewer =
  | ReplyListContainer1_viewer
  | ReplyListContainer2_viewer
  | ReplyListContainer3_viewer
  | ReplyListContainer4_viewer
  | ReplyListContainer5_viewer
  | ReplyListContainer6_viewer
  | ReplyListContainerLastFlattened_viewer;

type Comment =
  | ReplyListContainer1_comment
  | ReplyListContainer2_comment
  | ReplyListContainer3_comment
  | ReplyListContainer4_comment
  | ReplyListContainer5_comment
  | ReplyListContainer6_comment
  | ReplyListContainerLastFlattened_comment;

type Story =
  | ReplyListContainer1_story
  | ReplyListContainer2_story
  | ReplyListContainer3_story
  | ReplyListContainer4_story
  | ReplyListContainer5_story
  | ReplyListContainer6_story
  | ReplyListContainerLastFlattened_story;

type Settings =
  | ReplyListContainer1_settings
  | ReplyListContainer2_settings
  | ReplyListContainer3_settings
  | ReplyListContainer4_settings
  | ReplyListContainer5_settings
  | ReplyListContainer6_settings
  | ReplyListContainerLastFlattened_settings;

type PaginationQuery =
  | ReplyListContainer1PaginationQueryVariables
  | ReplyListContainer2PaginationQueryVariables
  | ReplyListContainer3PaginationQueryVariables
  | ReplyListContainer4PaginationQueryVariables
  | ReplyListContainer5PaginationQueryVariables
  | ReplyListContainer6PaginationQueryVariables
  | ReplyListContainerLastFlattenedPaginationQueryVariables;

/**
 * BaseProps of the ReplyListContainer(s)
 */
interface BaseProps {
  viewer: Viewer | null;
  story: Story;
  comment: Comment;
  settings: Settings;
  relay: RelayPaginationProp;
  indentLevel?: number;

  /* The following props are passed through nested ReplyLists */
  /* (don't forget to pass it down below in ReplyListContainer) */
  allowIgnoredTombstoneReveal?: boolean | undefined;

  /* The following props are *NOT* passed through nested ReplyLists */
  /**
   * liveDirectRepliesInsertion if set to true,
   * live replies to the first level of comments
   * will be inserted directly into the comment stream
   * instead of hiding behind a button.
   */
  liveDirectRepliesInsertion?: boolean;
  showRemoveAnswered?: boolean;
}

/**
 * Calculate the Props for the <NextReplyListComponent /> from BaseProps.
 * Essentially marking fragments to accept `any` and excluding `relay` property.
 */
type NextReplyListProps = { [P in FragmentKeys<BaseProps>]: any } & Pick<
  BaseProps,
  Exclude<keyof BaseProps, FragmentKeys<BaseProps> | "relay">
>;

/**
 * These props are injected by HOCs defined in `createReplyListContainer`.
 */
interface InjectedProps {
  NextReplyListComponent: React.ComponentType<NextReplyListProps> | null;
  flattenReplies: boolean;
}

type Props = BaseProps & InjectedProps;

/* BEGIN - Comment fragments used by the ReplyListContainer */
// eslint-disable-next-line no-unused-expressions
graphql`
  fragment ReplyListContainer_settings on Settings {
    disableCommenting {
      enabled
    }
    ...ReplyListCommentContainer_settings
  }
`;
// eslint-disable-next-line no-unused-expressions
graphql`
  fragment ReplyListContainer_viewer on User {
    id
    ...ReplyListCommentContainer_viewer
  }
`;
// eslint-disable-next-line no-unused-expressions
graphql`
  fragment ReplyListContainer_story on Story {
    id
    isClosed
    closedAt
    settings {
      live {
        enabled
      }
    }
    ...ReplyListCommentContainer_story
  }
`;
// eslint-disable-next-line no-unused-expressions
graphql`
  fragment ReplyListContainer_comment on Comment {
    id
    status
    pending
    lastViewerAction
  }
`;
// eslint-disable-next-line no-unused-expressions
graphql`
  fragment ReplyListContainer_repliesComment on Comment {
    id
    replyCount
    ...ReplyListCommentContainer_comment
  }
`;
// eslint-disable-next-line no-unused-expressions
graphql`
  fragment ReplyListContainer_repliesConnection on CommentsConnection {
    viewNewEdges {
      cursor
      node {
        ...ReplyListContainer_repliesComment @relay(mask: false)
      }
    }
    edges {
      node {
        ...ReplyListContainer_repliesComment @relay(mask: false)
      }
    }
  }
`;
/* END - Comment fragments used by the ReplyListContainer */

// TODO: (cvle) If this could be autogenerated.
type FragmentVariables = Omit<PaginationQuery, "commentID">;

/**
 * ReplyListContainer handles the rendering of replies no matter which indent level.
 * Exception: Without _Flatten Replies_ we are using `LocalReplyListContainer` as the last
 * level.
 */
export const ReplyListContainer: React.FunctionComponent<Props> = (props) => {
  const flattenReplies = props.flattenReplies;
  const [{ keyboardShortcutsConfig }] = useLocal<ReplyListContainerLocal>(
    graphql`
      fragment ReplyListContainerLocal on Local {
        keyboardShortcutsConfig {
          key
          source
          reverse
        }
      }
    `
  );
  // We do local replies at the last level when flatten replies are not set.
  const atLastLevelLocalReply =
    props.indentLevel === MAX_REPLY_INDENT_DEPTH - 1 && !flattenReplies;

  const memoize = useMemoizer();
  const [showAll, isLoadingShowAll] = useLoadMore(props.relay, 999999999);
  const beginShowAllEvent = useViewerNetworkEvent(ShowAllRepliesEvent);
  const showAllAndEmit = useCallback(async () => {
    const showAllEvent = beginShowAllEvent({
      commentID: props.comment.id,
      keyboardShortcutsConfig,
    });
    try {
      await showAll();
      showAllEvent.success();
    } catch (error) {
      showAllEvent.error({ message: error.message, code: error.code });
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [showAll, beginShowAllEvent, props.comment.id, keyboardShortcutsConfig]);

  const viewNew = useMutation(ReplyListViewNewMutation);
  const beginViewNewRepliesEvent = useViewerNetworkEvent(
    ViewNewRepliesNetworkEvent
  );
  const markAsSeen = useMutation(MarkCommentsAsSeenMutation);
  const onViewNew = useCallback(async () => {
    const viewNewRepliesEvent = beginViewNewRepliesEvent({
      storyID: props.story.id,
      keyboardShortcutsConfig,
    });
    try {
      void (await viewNew({
        commentID: props.comment.id,
        storyID: props.story.id,
        markSeen: !!props.viewer,
        viewerID: props.viewer?.id,
        markAsSeen,
      }));
      viewNewRepliesEvent.success();
    } catch (error) {
      viewNewRepliesEvent.error({ message: error.message, code: error.code });
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [
    props.comment.id,
    props.story.id,
    viewNew,
    beginViewNewRepliesEvent,
    keyboardShortcutsConfig,
    markAsSeen,
    props.viewer,
  ]);

  if (!("replies" in props.comment)) {
    return null;
  }

  const viewNewCount =
    (props.comment.replies.viewNewEdges &&
      props.comment.replies.viewNewEdges.length) ||
    0;

  if (
    props.comment.replies === null ||
    (props.comment.replies.edges.length === 0 && viewNewCount === 0)
  ) {
    return null;
  }
  const indentLevel = props.indentLevel || 1;

  const comments =
    // Comment is not visible after a viewer action, so don't render it anymore.
    props.comment.lastViewerAction && !isPublished(props.comment.status)
      ? []
      : // (cvle) TODO: Next two lines contain a typescript bug workaround...
        (props.comment.replies.edges as any[]).map(
          (edge: typeof props.comment.replies.edges[0]) =>
            memoize(
              edge.node.id,
              {
                ...edge.node,
                replyListElement: props.NextReplyListComponent && (
                  // Important: Props are being passed here to the next level!
                  // Not all of them are passed.
                  <props.NextReplyListComponent
                    viewer={props.viewer}
                    comment={edge.node}
                    story={props.story}
                    settings={props.settings}
                    indentLevel={indentLevel + 1}
                    // Pass through props as commented in `BaseProps`.
                    allowIgnoredTombstoneReveal={
                      props.allowIgnoredTombstoneReveal
                    }
                  />
                ),
                showConversationLink:
                  atLastLevelLocalReply && edge.node.replyCount > 0,
              },
              [
                edge.node,
                props.viewer,
                props.story,
                props.settings,
                indentLevel,
                props.allowIgnoredTombstoneReveal,
                atLastLevelLocalReply,
                props.NextReplyListComponent,
              ]
            )
        );

  return (
    <ReplyList
      viewer={props.viewer}
      comment={props.comment}
      comments={comments}
      story={props.story}
      settings={props.settings}
      onShowAll={showAllAndEmit}
      hasMore={props.relay.hasMore()}
      disableShowAll={isLoadingShowAll}
      indentLevel={indentLevel}
      localReply={atLastLevelLocalReply}
      viewNewCount={viewNewCount}
      onViewNew={onViewNew}
      allowIgnoredTombstoneReveal={props.allowIgnoredTombstoneReveal}
      showRemoveAnswered={props.showRemoveAnswered}
    />
  );
};

/**
 * Factory function to create the ReplyListContainers.
 * We need one for each indentLevel and the fragments
 * must each time point to the next level of ReplyListContainer.
 *
 * e.g. ReplyListContainer1 => ReplyListContainer2  => ReplyListContainer3
 */
function createReplyListContainer(options: {
  /** fragments for the pagination container */
  fragments: {
    viewer: GraphQLTaggedNode;
    story: GraphQLTaggedNode;
    comment: GraphQLTaggedNode;
    settings: GraphQLTaggedNode;
  };
  /** query for the pagination container */
  query: GraphQLTaggedNode;
  /** Next ReplyListContainer Component */
  NextReplyListComponent: Props["NextReplyListComponent"] | null;
}) {
  const { fragments, query, NextReplyListComponent } = options;
  const enhanced = withProps(() => ({
    NextReplyListComponent,
    flattenReplies: useStaticFlattenReplies(),
  }))(
    withPaginationContainer<Props, PaginationQuery, FragmentVariables>(
      fragments,
      {
        getConnectionFromProps(props) {
          return props.comment && props.comment.replies;
        },
        getVariables(props, { count, cursor }, fragmentVariables) {
          return {
            count,
            cursor,
            orderBy: fragmentVariables.orderBy,
            commentID: props.comment.id,
            flattenReplies: props.flattenReplies,
          };
        },
        query,
      }
    )(ReplyListContainer)
  );
  return enhanced;
}

/**
 * Creates a ReplyListContainer for the last level with slightly different
 * fragments to flatten the replies.
 */
const ReplyListContainerLastFlattened = createReplyListContainer({
  NextReplyListComponent: null,
  fragments: {
    viewer: graphql`
      fragment ReplyListContainerLastFlattened_viewer on User {
        id
        ...ReplyListContainer_viewer @relay(mask: false)
      }
    `,
    settings: graphql`
      fragment ReplyListContainerLastFlattened_settings on Settings {
        ...ReplyListContainer_settings @relay(mask: false)
      }
    `,
    story: graphql`
      fragment ReplyListContainerLastFlattened_story on Story {
        ...ReplyListContainer_story @relay(mask: false)
      }
    `,
    comment: graphql`
      fragment ReplyListContainerLastFlattened_comment on Comment
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "Cursor" }
        orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
      ) {
        ...ReplyListContainer_comment @relay(mask: false)
        replies(
          first: $count
          after: $cursor
          orderBy: $orderBy
          flatten: $flattenReplies
        ) @connection(key: "ReplyList_replies", filters: ["orderBy"]) {
          # We use the same key and exclude 'flatten' to essentially
          # have the same connection key as the regular ReplyListContainers.
          ...ReplyListContainer_repliesConnection @relay(mask: false)
          edges {
            __typename
          }
        }
      }
    `,
  },
  query: graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainerLastFlattenedPaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
      $flattenReplies: Boolean!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainerLastFlattened_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
});

/**
 * ReplyListContainerLast determines whether we use flatten replies or a
 * local reply list.
 */
const ReplyListContainerLast = createRelayFragmentContainer<
  Overwrite<
    BaseProps,
    {
      viewer: ReplyListContainerLast_viewer | null;
      story: ReplyListContainerLast_story;
      comment: ReplyListContainerLast_comment;
      settings: ReplyListContainerLast_settings;
    }
  >
>(
  (props) => {
    const flattenReplies = useStaticFlattenReplies();
    if (flattenReplies) {
      return <ReplyListContainerLastFlattened {...props} />;
    }
    return <LocalReplyListContainer {...props} />;
  },
  {
    viewer: graphql`
      fragment ReplyListContainerLast_viewer on User {
        id
        ...LocalReplyListContainer_viewer @skip(if: $flattenReplies)
        ...ReplyListContainerLastFlattened_viewer @include(if: $flattenReplies)
      }
    `,
    story: graphql`
      fragment ReplyListContainerLast_story on Story {
        ...LocalReplyListContainer_story @skip(if: $flattenReplies)
        ...ReplyListContainerLastFlattened_story @include(if: $flattenReplies)
      }
    `,
    comment: graphql`
      fragment ReplyListContainerLast_comment on Comment {
        ...LocalReplyListContainer_comment @skip(if: $flattenReplies)
        ...ReplyListContainerLastFlattened_comment @include(if: $flattenReplies)
      }
    `,
    settings: graphql`
      fragment ReplyListContainerLast_settings on Settings {
        ...LocalReplyListContainer_settings @skip(if: $flattenReplies)
        ...ReplyListContainerLastFlattened_settings
          @include(if: $flattenReplies)
      }
    `,
  }
);

const ReplyListContainer6 = createReplyListContainer({
  NextReplyListComponent: ReplyListContainerLast,
  fragments: {
    viewer: graphql`
      fragment ReplyListContainer6_viewer on User {
        id
        ...ReplyListContainer_viewer @relay(mask: false)
        ...ReplyListContainerLast_viewer
      }
    `,
    settings: graphql`
      fragment ReplyListContainer6_settings on Settings {
        ...ReplyListContainer_settings @relay(mask: false)
        ...ReplyListContainerLast_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer6_story on Story {
        ...ReplyListContainer_story @relay(mask: false)
        ...ReplyListContainerLast_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer6_comment on Comment
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "Cursor" }
        orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
      ) {
        ...ReplyListContainer_comment @relay(mask: false)
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          ...ReplyListContainer_repliesConnection @relay(mask: false)
          viewNewEdges {
            node {
              ...ReplyListContainerLast_comment
            }
          }
          edges {
            node {
              ...ReplyListContainerLast_comment
            }
          }
        }
      }
    `,
  },
  query: graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer6PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
      $flattenReplies: Boolean!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer6_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
});

const ReplyListContainer5 = createReplyListContainer({
  NextReplyListComponent: ReplyListContainer6,
  fragments: {
    viewer: graphql`
      fragment ReplyListContainer5_viewer on User {
        id
        ...ReplyListContainer_viewer @relay(mask: false)
        ...ReplyListContainer6_viewer
      }
    `,
    settings: graphql`
      fragment ReplyListContainer5_settings on Settings {
        ...ReplyListContainer_settings @relay(mask: false)
        ...ReplyListContainer6_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer5_story on Story {
        ...ReplyListContainer_story @relay(mask: false)
        ...ReplyListContainer6_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer5_comment on Comment
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "Cursor" }
        orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
      ) {
        ...ReplyListContainer_comment @relay(mask: false)
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          ...ReplyListContainer_repliesConnection @relay(mask: false)
          viewNewEdges {
            node {
              ...ReplyListContainer6_comment
            }
          }
          edges {
            node {
              ...ReplyListContainer6_comment
            }
          }
        }
      }
    `,
  },
  query: graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer5PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
      $flattenReplies: Boolean!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer5_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
});

const ReplyListContainer4 = createReplyListContainer({
  NextReplyListComponent: ReplyListContainer5,
  fragments: {
    viewer: graphql`
      fragment ReplyListContainer4_viewer on User {
        id
        ...ReplyListContainer_viewer @relay(mask: false)
        ...ReplyListContainer5_viewer
      }
    `,
    settings: graphql`
      fragment ReplyListContainer4_settings on Settings {
        ...ReplyListContainer_settings @relay(mask: false)
        ...ReplyListContainer5_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer4_story on Story {
        ...ReplyListContainer_story @relay(mask: false)
        ...ReplyListContainer5_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer4_comment on Comment
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "Cursor" }
        orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
      ) {
        ...ReplyListContainer_comment @relay(mask: false)
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          ...ReplyListContainer_repliesConnection @relay(mask: false)
          viewNewEdges {
            node {
              ...ReplyListContainer5_comment
            }
          }
          edges {
            node {
              ...ReplyListContainer5_comment
            }
          }
        }
      }
    `,
  },
  query: graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer4PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
      $flattenReplies: Boolean!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer4_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
});

const ReplyListContainer3 = createReplyListContainer({
  NextReplyListComponent: ReplyListContainer4,
  fragments: {
    viewer: graphql`
      fragment ReplyListContainer3_viewer on User {
        id
        ...ReplyListContainer_viewer @relay(mask: false)
        ...ReplyListContainer4_viewer
      }
    `,
    settings: graphql`
      fragment ReplyListContainer3_settings on Settings {
        ...ReplyListContainer_settings @relay(mask: false)
        ...ReplyListContainer4_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer3_story on Story {
        ...ReplyListContainer_story @relay(mask: false)
        ...ReplyListContainer4_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer3_comment on Comment
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "Cursor" }
        orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
      ) {
        ...ReplyListContainer_comment @relay(mask: false)
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          ...ReplyListContainer_repliesConnection @relay(mask: false)
          viewNewEdges {
            node {
              ...ReplyListContainer4_comment
            }
          }
          edges {
            node {
              ...ReplyListContainer4_comment
            }
          }
        }
      }
    `,
  },
  query: graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer3PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
      $flattenReplies: Boolean!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer3_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
});

const ReplyListContainer2 = createReplyListContainer({
  NextReplyListComponent: ReplyListContainer3,
  fragments: {
    viewer: graphql`
      fragment ReplyListContainer2_viewer on User {
        id
        ...ReplyListContainer_viewer @relay(mask: false)
        ...ReplyListContainer3_viewer
      }
    `,
    settings: graphql`
      fragment ReplyListContainer2_settings on Settings {
        ...ReplyListContainer_settings @relay(mask: false)
        ...ReplyListContainer3_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer2_story on Story {
        ...ReplyListContainer_story @relay(mask: false)
        ...ReplyListContainer3_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer2_comment on Comment
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "Cursor" }
        orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
      ) {
        ...ReplyListContainer_comment @relay(mask: false)
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          ...ReplyListContainer_repliesConnection @relay(mask: false)
          viewNewEdges {
            node {
              ...ReplyListContainer3_comment
            }
          }
          edges {
            node {
              ...ReplyListContainer3_comment
            }
          }
        }
      }
    `,
  },
  query: graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer2PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
      $flattenReplies: Boolean!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer2_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
});

const ReplyListContainer1 = createReplyListContainer({
  NextReplyListComponent: ReplyListContainer2,
  fragments: {
    viewer: graphql`
      fragment ReplyListContainer1_viewer on User {
        id
        ...ReplyListContainer_viewer @relay(mask: false)
        ...ReplyListContainer2_viewer
      }
    `,
    settings: graphql`
      fragment ReplyListContainer1_settings on Settings {
        ...ReplyListContainer_settings @relay(mask: false)
        ...ReplyListContainer2_settings
      }
    `,
    story: graphql`
      fragment ReplyListContainer1_story on Story {
        ...ReplyListContainer_story @relay(mask: false)
        ...ReplyListContainer2_story
      }
    `,
    comment: graphql`
      fragment ReplyListContainer1_comment on Comment
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 10 }
        cursor: { type: "Cursor" }
        orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
      ) {
        ...ReplyListContainer_comment @relay(mask: false)
        replies(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "ReplyList_replies") {
          ...ReplyListContainer_repliesConnection @relay(mask: false)
          viewNewEdges {
            node {
              ...ReplyListContainer2_comment
            }
          }
          edges {
            node {
              ...ReplyListContainer2_comment
            }
          }
        }
      }
    `,
  },
  query: graphql`
    # Pagination query to be fetched upon calling 'loadMore'.
    # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
    query ReplyListContainer1PaginationQuery(
      $count: Int!
      $cursor: Cursor
      $orderBy: COMMENT_SORT!
      $commentID: ID!
      $flattenReplies: Boolean!
    ) {
      comment(id: $commentID) {
        ...ReplyListContainer1_comment
          @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
      }
    }
  `,
});

export default ReplyListContainer1;
