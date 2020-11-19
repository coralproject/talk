import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { useViewerNetworkEvent } from "coral-framework/lib/events";
import {
  useLoadMore,
  useMutation,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { ShowAllRepliesEvent } from "coral-stream/events";
import { Button, HorizontalGutter } from "coral-ui/components/v2";

import { FlattenedReplyListContainer_comment } from "coral-stream/__generated__/FlattenedReplyListContainer_comment.graphql";
import { FlattenedReplyListContainer_settings } from "coral-stream/__generated__/FlattenedReplyListContainer_settings.graphql";
import { FlattenedReplyListContainer_story } from "coral-stream/__generated__/FlattenedReplyListContainer_story.graphql";
import { FlattenedReplyListContainer_viewer } from "coral-stream/__generated__/FlattenedReplyListContainer_viewer.graphql";
import { FlattenedReplyListContainerPaginationQueryVariables } from "coral-stream/__generated__/FlattenedReplyListContainerPaginationQuery.graphql";

import { CommentContainer } from "../Comment";
import CollapsableComment from "../Comment/CollapsableComment";
import { isPublished } from "../helpers";
import Indent from "../Indent";
import FlattenedReplyListViewNewMutation from "./FlattenedReplyListViewNewMutation";

type FragmentVariables = Omit<
  FlattenedReplyListContainerPaginationQueryVariables,
  "commentID"
>;

interface Props {
  viewer: FlattenedReplyListContainer_viewer;
  story: FlattenedReplyListContainer_story;
  comment: FlattenedReplyListContainer_comment;
  settings: FlattenedReplyListContainer_settings;
  relay: RelayPaginationProp;
}

const FlattenedReplyListContainer: FunctionComponent<Props> = ({
  viewer,
  story,
  comment,
  settings,
  relay,
}) => {
  const [showAll, isLoadingShowAll] = useLoadMore(relay, 999999999);
  const beginShowAllEvent = useViewerNetworkEvent(ShowAllRepliesEvent);

  const onShowAll = useCallback(async () => {
    const showAllEvent = beginShowAllEvent({ commentID: comment.id });
    try {
      await showAll();
      showAllEvent.success();
    } catch (error) {
      showAllEvent.error({ message: error.message, code: error.code });
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [beginShowAllEvent, comment.id, showAll]);

  const viewNew = useMutation(FlattenedReplyListViewNewMutation);
  const onViewNew = useCallback(() => {
    void viewNew({ commentID: comment.id, storyID: story.id });
  }, [comment.id, story.id, viewNew]);

  const viewNewCount =
    (comment.replies.viewNewEdges && comment.replies.viewNewEdges.length) || 0;

  if (
    comment.replies === null ||
    (comment.replies.edges.length === 0 && viewNewCount === 0)
  ) {
    return null;
  }

  const comments =
    comment.lastViewerAction && !isPublished(comment.status)
      ? []
      : comment.replies?.edges.map((edge) => edge.node);

  return (
    <>
      <HorizontalGutter
        id={`coral-comments-replyList-log--${comment.id}`}
        data-testid={`commentReplyList-${comment.id}`}
        role="log"
      >
        {comments.map((c) => (
          <HorizontalGutter key={c.id}>
            <CollapsableComment>
              {({ collapsed, toggleCollapsed }) => (
                <CommentContainer
                  key={comment.id}
                  ancestorID={comment.id}
                  viewer={viewer}
                  story={story}
                  comment={c}
                  settings={settings}
                  indentLevel={4}
                  collapsed={collapsed}
                  toggleCollapsed={toggleCollapsed}
                />
              )}
            </CollapsableComment>
          </HorizontalGutter>
        ))}
        {relay.hasMore() && (
          <Indent level={4} noBorder>
            <Localized id="comments-replyList-showAll">
              <Button
                id={`coral-comments-replyList-showAll--${comment.id}`}
                aria-controls={`coral-comments-replyList-log--${comment.id}`}
                className={CLASSES.replyList.showAllButton}
                onClick={onShowAll}
                disabled={isLoadingShowAll}
                variant="outlined"
                color="mono"
                fullWidth
                // Added for keyboard shortcut support.
                data-key-stop
                data-is-load-more
              >
                Show All Replies
              </Button>
            </Localized>
          </Indent>
        )}
        {!!viewNewCount && (
          <Indent level={4} noBorder>
            <Localized id="comments-replyList-showMoreReplies">
              <Button
                aria-controls={`coral-comments-replyList-log--${comment.id}`}
                onClick={onViewNew}
                className={CLASSES.replyList.showMoreReplies}
                variant="outlined"
                color="mono"
                fullWidth
              >
                Show More Replies
              </Button>
            </Localized>
          </Indent>
        )}
      </HorizontalGutter>
    </>
  );
};

const enhanced = withPaginationContainer<
  Props,
  FlattenedReplyListContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    viewer: graphql`
      fragment FlattenedReplyListContainer_viewer on User {
        ...CommentContainer_viewer
      }
    `,
    story: graphql`
      fragment FlattenedReplyListContainer_story on Story {
        id
        ...CommentContainer_story
      }
    `,
    comment: graphql`
      fragment FlattenedReplyListContainer_comment on Comment
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 10 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_ASC }
        ) {
        id
        status
        pending
        lastViewerAction
        replies(
          first: $count
          after: $cursor
          orderBy: $orderBy
          flatten: true
        ) @connection(key: "FlattenedReplyListContainer_replies") {
          viewNewEdges {
            cursor
            node {
              id
              ...CommentContainer_comment
            }
          }
          edges {
            node {
              id
              ...CommentContainer_comment
            }
          }
        }
      }
    `,
    settings: graphql`
      fragment FlattenedReplyListContainer_settings on Settings {
        ...CommentContainer_settings
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps(props) {
      return props.comment && props.comment.replies;
    },
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
    query: graphql`
      query FlattenedReplyListContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $orderBy: COMMENT_SORT!
        $commentID: ID!
      ) {
        comment(id: $commentID) {
          ...FlattenedReplyListContainer_comment
            @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
        }
      }
    `,
  }
)(FlattenedReplyListContainer);

export default enhanced;
