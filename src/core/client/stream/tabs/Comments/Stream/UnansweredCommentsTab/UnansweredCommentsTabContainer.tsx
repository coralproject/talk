import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback, useEffect } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { useLive } from "coral-framework/hooks";
import { useViewerNetworkEvent } from "coral-framework/lib/events";
import {
  useLoadMore,
  useLocal,
  useMutation,
  useSubscription,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT, GQLTAG } from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { LoadMoreAllCommentsEvent } from "coral-stream/events";
import { CommentEnteredSubscription } from "coral-stream/tabs/Comments/Stream/Subscriptions";
import { Box, HorizontalGutter } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { UnansweredCommentsTabContainer_settings } from "coral-stream/__generated__/UnansweredCommentsTabContainer_settings.graphql";
import { UnansweredCommentsTabContainer_story } from "coral-stream/__generated__/UnansweredCommentsTabContainer_story.graphql";
import { UnansweredCommentsTabContainer_viewer } from "coral-stream/__generated__/UnansweredCommentsTabContainer_viewer.graphql";
import { UnansweredCommentsTabContainerLocal } from "coral-stream/__generated__/UnansweredCommentsTabContainerLocal.graphql";
import { UnansweredCommentsTabContainerPaginationQueryVariables } from "coral-stream/__generated__/UnansweredCommentsTabContainerPaginationQuery.graphql";

import NoComments from "../NoComments";
import UnansweredCommentsTabCommentContainer from "./UnansweredCommentsTabCommentContainer";
import UnansweredCommentsTabViewNewMutation from "./UnansweredCommentsTabViewNewMutation";

interface Props {
  story: UnansweredCommentsTabContainer_story;
  settings: UnansweredCommentsTabContainer_settings;
  viewer: UnansweredCommentsTabContainer_viewer | null;
  relay: RelayPaginationProp;
  flattenReplies: boolean;
}

export const UnansweredCommentsTabContainer: FunctionComponent<Props> = (
  props
) => {
  const [{ commentsOrderBy, keyboardShortcutsConfig }] =
    useLocal<UnansweredCommentsTabContainerLocal>(
      graphql`
        fragment UnansweredCommentsTabContainerLocal on Local {
          commentsOrderBy
          keyboardShortcutsConfig {
            key
            source
            reverse
          }
        }
      `
    );

  const subscribeToCommentEntered = useSubscription(CommentEnteredSubscription);

  const live = useLive(props);
  const hasMore = props.relay.hasMore();
  useEffect(() => {
    // If live updates are disabled, don't subscribe to new comments!!
    if (!live) {
      return;
    }

    // Check the sort ordering to apply extra logic.
    switch (commentsOrderBy) {
      case GQLCOMMENT_SORT.CREATED_AT_ASC:
        if (hasMore) {
          // Oldest first when there is more than one page of content can't
          // possibly have new comments to show in view!
          return;
        }

        // We have all the comments for this story in view! Comments could load!
        break;
      case GQLCOMMENT_SORT.CREATED_AT_DESC:
        // Newest first can always get more comments in view.
        break;
      default:
        // Only chronological sort supports top level live updates of incoming
        // comments.
        return;
    }

    const disposable = subscribeToCommentEntered({
      storyID: props.story.id,
      orderBy: commentsOrderBy,
      storyConnectionKey: "UnansweredStream_comments",
      tag: GQLTAG.UNANSWERED,
    });

    return () => {
      disposable.dispose();
    };
  }, [
    commentsOrderBy,
    hasMore,
    live,
    props.story.id,
    subscribeToCommentEntered,
  ]);

  const [loadMore, isLoadingMore] = useLoadMore(props.relay, 20);
  const beginLoadMoreEvent = useViewerNetworkEvent(LoadMoreAllCommentsEvent);
  const loadMoreAndEmit = useCallback(async () => {
    const loadMoreEvent = beginLoadMoreEvent({
      storyID: props.story.id,
      keyboardShortcutsConfig,
    });
    try {
      await loadMore();
      loadMoreEvent.success();
    } catch (error) {
      loadMoreEvent.error({ message: error.message, code: error.code });
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [loadMore, beginLoadMoreEvent, props.story.id]);
  const viewMore = useMutation(UnansweredCommentsTabViewNewMutation);
  const onViewMore = useCallback(
    () => viewMore({ storyID: props.story.id }),
    [props.story.id, viewMore]
  );
  const comments = props.story.comments.edges.map((edge) => edge.node);
  const viewNewCount =
    (props.story.comments.viewNewEdges &&
      props.story.comments.viewNewEdges.length) ||
    0;
  return (
    <>
      {Boolean(viewNewCount && viewNewCount > 0) && (
        <Box mb={4} clone>
          <Button
            variant="outlined"
            color="primary"
            onClick={onViewMore}
            className={CLASSES.allCommentsTabPane.viewNewButton}
            fullWidth
          >
            <Localized id="qa-viewNew" vars={{ count: viewNewCount }}>
              <span>View {viewNewCount} New Questions</span>
            </Localized>
          </Button>
        </Box>
      )}
      <HorizontalGutter
        id="comments-unansweredComments-log"
        data-testid="comments-unansweredComments-log"
        size="oneAndAHalf"
        role="log"
        aria-live="off"
      >
        {comments.length === 0 && (
          <NoComments mode="QA" isClosed={props.story.isClosed} />
        )}
        {comments.length > 0 &&
          comments.map((comment, index) => (
            <UnansweredCommentsTabCommentContainer
              key={comment.id}
              viewer={props.viewer}
              comment={comment}
              story={props.story}
              settings={props.settings}
              isLast={index === comments.length - 1}
            />
          ))}
        {props.relay.hasMore() && (
          <Localized id="comments-loadMore">
            <Button
              key={comments.length}
              onClick={loadMoreAndEmit}
              variant="outlined"
              color="secondary"
              fullWidth
              disabled={isLoadingMore}
              aria-controls="comments-allComments-log"
              className={CLASSES.allCommentsTabPane.loadMoreButton}
            >
              Load More
            </Button>
          </Localized>
        )}
      </HorizontalGutter>
    </>
  );
};

// TODO: (cvle) if this could be autogenerated..
type FragmentVariables = Omit<
  UnansweredCommentsTabContainerPaginationQueryVariables,
  "storyID"
>;

const enhanced = withPaginationContainer<
  Props,
  UnansweredCommentsTabContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    story: graphql`
      fragment UnansweredCommentsTabContainer_story on Story
      @argumentDefinitions(
        count: { type: "Int", defaultValue: 20 }
        cursor: { type: "Cursor" }
        orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_DESC }
        tag: { type: "TAG!", defaultValue: UNANSWERED }
      ) {
        id
        isClosed
        settings {
          live {
            enabled
          }
        }
        commentCounts {
          tags {
            UNANSWERED
          }
        }
        comments(first: $count, after: $cursor, orderBy: $orderBy, tag: $tag)
          @connection(key: "UnansweredStream_comments") {
          viewNewEdges {
            cursor
            node {
              id
              ...UnansweredCommentsTabCommentContainer_comment
            }
          }
          edges {
            node {
              id
              ...UnansweredCommentsTabCommentContainer_comment
            }
          }
        }
        ...CreateCommentReplyMutation_story
        ...CreateCommentMutation_story
        ...UnansweredCommentsTabCommentContainer_story
      }
    `,
    viewer: graphql`
      fragment UnansweredCommentsTabContainer_viewer on User {
        ...UnansweredCommentsTabCommentContainer_viewer
        ...CreateCommentReplyMutation_viewer
        ...CreateCommentMutation_viewer
        status {
          current
        }
      }
    `,
    settings: graphql`
      fragment UnansweredCommentsTabContainer_settings on Settings {
        reaction {
          sortLabel
        }
        disableCommenting {
          enabled
        }
        ...UnansweredCommentsTabCommentContainer_settings
      }
    `,
  },
  {
    getConnectionFromProps(props) {
      return props.story && props.story.comments;
    },
    getVariables(props, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        orderBy: fragmentVariables.orderBy,
        // storyID isn't specified as an @argument for the fragment, but it should be a
        // variable available for the fragment under the query root.
        storyID: props.story.id,
        tag: GQLTAG.UNANSWERED,
        flattenReplies: props.flattenReplies,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query UnansweredCommentsTabContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $orderBy: COMMENT_SORT!
        $storyID: ID
        $flattenReplies: Boolean!
      ) {
        story(id: $storyID) {
          ...UnansweredCommentsTabContainer_story
            @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
        }
      }
    `,
  }
)(UnansweredCommentsTabContainer);

export type UnansweredCommentsTabContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
