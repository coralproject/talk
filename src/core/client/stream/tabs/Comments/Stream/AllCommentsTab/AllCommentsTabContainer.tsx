import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { clearLongTimeout } from "long-settimeout";
import React, { FunctionComponent, useCallback, useEffect } from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import { createTimeoutAt } from "coral-common/utils";
import FadeInTransition from "coral-framework/components/FadeInTransition";
import { useViewerNetworkEvent } from "coral-framework/lib/events";
import {
  combineDisposables,
  useLoadMore,
  useLocal,
  useMutation,
  useSubscription,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT, GQLSTORY_MODE } from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { LoadMoreAllCommentsEvent } from "coral-stream/events";
import { Box, HorizontalGutter } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { AllCommentsTabContainer_settings } from "coral-stream/__generated__/AllCommentsTabContainer_settings.graphql";
import { AllCommentsTabContainer_story } from "coral-stream/__generated__/AllCommentsTabContainer_story.graphql";
import { AllCommentsTabContainer_viewer } from "coral-stream/__generated__/AllCommentsTabContainer_viewer.graphql";
import { AllCommentsTabContainerLocal } from "coral-stream/__generated__/AllCommentsTabContainerLocal.graphql";
import { AllCommentsTabContainerPaginationQueryVariables } from "coral-stream/__generated__/AllCommentsTabContainerPaginationQuery.graphql";

import { CommentContainer } from "../../Comment";
import CollapsableComment from "../../Comment/CollapsableComment";
import IgnoredTombstoneOrHideContainer from "../../IgnoredTombstoneOrHideContainer";
import { ReplyListContainer } from "../../ReplyList";
import AllCommentsTabViewNewMutation from "./AllCommentsTabViewNewMutation";
import CommentCreatedSubscription from "./CommentCreatedSubscription";
import CommentReleasedSubscription from "./CommentReleasedSubscription";
import NoComments from "./NoComments";

import styles from "./AllCommentsTabContainer.css";

interface Props {
  story: AllCommentsTabContainer_story;
  settings: AllCommentsTabContainer_settings;
  viewer: AllCommentsTabContainer_viewer | null;
  relay: RelayPaginationProp;
}

// eslint-disable-next-line no-unused-expressions
graphql`
  fragment AllCommentsTabContainer_comment on Comment {
    id
    ...CommentContainer_comment
    ...ReplyListContainer1_comment
    ...IgnoredTombstoneOrHideContainer_comment
  }
`;

export const AllCommentsTabContainer: FunctionComponent<Props> = ({
  story,
  settings,
  viewer,
  relay,
}) => {
  const [{ commentsOrderBy }] = useLocal<AllCommentsTabContainerLocal>(
    graphql`
      fragment AllCommentsTabContainerLocal on Local {
        commentsOrderBy
      }
    `
  );
  const subscribeToCommentCreated = useSubscription(CommentCreatedSubscription);
  const subscribeToCommentReleased = useSubscription(
    CommentReleasedSubscription
  );
  useEffect(() => {
    // If live updates are disabled, don't subscribe to new comments!!
    if (!story.settings.live.enabled) {
      return;
    }

    // If the story is closed or commenting is disabled, then don't subscribe
    // to new comments because there isn't any!
    if (story.isClosed || settings.disableCommenting.enabled) {
      return;
    }

    // Check the sort ordering to apply extra logic.
    switch (commentsOrderBy) {
      case GQLCOMMENT_SORT.CREATED_AT_ASC:
        if (relay.hasMore()) {
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

    const disposable = combineDisposables(
      subscribeToCommentCreated({
        storyID: story.id,
        orderBy: commentsOrderBy,
      }),
      subscribeToCommentReleased({
        storyID: story.id,
        orderBy: commentsOrderBy,
      })
    );

    // If the story is scheduled to be closed, cancel the subscriptions because
    // we can't add any more comments!
    if (story.closedAt) {
      const timer = createTimeoutAt(() => {
        disposable.dispose();
      }, story.closedAt);

      return () => {
        // Cancel the timer if there was one enabled.
        if (timer) {
          clearLongTimeout(timer);
        }

        // Dispose the subscriptions.
        disposable.dispose();
      };
    }

    return () => {
      disposable.dispose();
    };
  }, [
    commentsOrderBy,
    subscribeToCommentCreated,
    subscribeToCommentReleased,
    story.id,
    story.isClosed,
    story.closedAt,
    story.settings.live.enabled,
    settings.disableCommenting.enabled,
    relay.hasMore(),
  ]);

  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);
  const beginLoadMoreEvent = useViewerNetworkEvent(LoadMoreAllCommentsEvent);
  const loadMoreAndEmit = useCallback(async () => {
    const loadMoreEvent = beginLoadMoreEvent({ storyID: story.id });
    try {
      await loadMore();
      loadMoreEvent.success();
    } catch (error) {
      loadMoreEvent.error({ message: error.message, code: error.code });
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [loadMore, beginLoadMoreEvent, story.id]);
  const viewMore = useMutation(AllCommentsTabViewNewMutation);
  const onViewMore = useCallback(() => viewMore({ storyID: story.id }), [
    story.id,
    viewMore,
  ]);
  const viewNewCount = story.comments.viewNewEdges?.length || 0;
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
            {story.settings.mode === GQLSTORY_MODE.QA ? (
              <Localized id="qa-viewNew" $count={viewNewCount}>
                <span>View {viewNewCount} New Questions</span>
              </Localized>
            ) : (
              <Localized id="comments-viewNew" $count={viewNewCount}>
                <span>View {viewNewCount} New Comments</span>
              </Localized>
            )}
          </Button>
        </Box>
      )}
      <HorizontalGutter
        id="comments-allComments-log"
        data-testid="comments-allComments-log"
        role="log"
        aria-live="polite"
        size="oneAndAHalf"
      >
        {story.comments.edges.length <= 0 && (
          <NoComments
            mode={story.settings.mode}
            isClosed={story.isClosed}
          ></NoComments>
        )}
        {story.comments.edges.length > 0 &&
          story.comments.edges.map(({ node: comment }) => (
            <IgnoredTombstoneOrHideContainer
              key={comment.id}
              viewer={viewer}
              comment={comment}
            >
              <FadeInTransition active={Boolean(comment.enteredLive)}>
                <CollapsableComment>
                  {({ collapsed, toggleCollapsed }) => (
                    <HorizontalGutter
                      className={cn({
                        [styles.borderedComment]: !collapsed,
                      })}
                    >
                      <CommentContainer
                        collapsed={collapsed}
                        viewer={viewer}
                        settings={settings}
                        comment={comment}
                        story={story}
                        toggleCollapsed={toggleCollapsed}
                      />
                      <div
                        className={cn({
                          [styles.hiddenReplies]: collapsed,
                        })}
                      >
                        <ReplyListContainer
                          settings={settings}
                          viewer={viewer}
                          comment={comment}
                          story={story}
                        />
                      </div>
                    </HorizontalGutter>
                  )}
                </CollapsableComment>
              </FadeInTransition>
            </IgnoredTombstoneOrHideContainer>
          ))}
        {relay.hasMore() && (
          <Localized id="comments-loadMore">
            <Button
              onClick={loadMoreAndEmit}
              color="secondary"
              variant="outlined"
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
  AllCommentsTabContainerPaginationQueryVariables,
  "storyID"
>;

const enhanced = withPaginationContainer<
  Props,
  AllCommentsTabContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    story: graphql`
      fragment AllCommentsTabContainer_story on Story
        @argumentDefinitions(
          count: { type: "Int!", defaultValue: 20 }
          cursor: { type: "Cursor" }
          orderBy: { type: "COMMENT_SORT!", defaultValue: CREATED_AT_DESC }
        ) {
        id
        isClosed
        closedAt
        settings {
          live {
            enabled
          }
          mode
        }
        comments(first: $count, after: $cursor, orderBy: $orderBy)
          @connection(key: "Stream_comments") {
          viewNewEdges {
            cursor
            node {
              enteredLive
              ...AllCommentsTabContainer_comment @relay(mask: false)
            }
          }
          edges {
            node {
              enteredLive
              ...AllCommentsTabContainer_comment @relay(mask: false)
            }
          }
        }
        ...PostCommentFormContainer_story
        ...CommentContainer_story
        ...ReplyListContainer1_story
        ...CreateCommentReplyMutation_story
        ...CreateCommentMutation_story
      }
    `,
    viewer: graphql`
      fragment AllCommentsTabContainer_viewer on User {
        ...ReplyListContainer1_viewer
        ...CommentContainer_viewer
        ...CreateCommentReplyMutation_viewer
        ...CreateCommentMutation_viewer
        ...IgnoredTombstoneOrHideContainer_viewer
        status {
          current
        }
      }
    `,
    settings: graphql`
      fragment AllCommentsTabContainer_settings on Settings {
        reaction {
          sortLabel
        }
        disableCommenting {
          enabled
        }
        ...ReplyListContainer1_settings
        ...CommentContainer_settings
      }
    `,
  },
  {
    direction: "forward",
    getConnectionFromProps({ story }) {
      return story && story.comments;
    },
    // This is also the default implementation of `getFragmentVariables` if it isn't provided.
    getFragmentVariables(prevVars, totalCount) {
      return {
        ...prevVars,
        count: totalCount,
      };
    },
    getVariables({ story }, { count, cursor }, fragmentVariables) {
      return {
        count,
        cursor,
        orderBy: fragmentVariables.orderBy,
        // storyID isn't specified as an @argument for the fragment, but it should be a
        // variable available for the fragment under the query root.
        storyID: story.id,
      };
    },
    query: graphql`
      # Pagination query to be fetched upon calling 'loadMore'.
      # Notice that we re-use our fragment, and the shape of this query matches our fragment spec.
      query AllCommentsTabContainerPaginationQuery(
        $count: Int!
        $cursor: Cursor
        $orderBy: COMMENT_SORT!
        $storyID: ID
      ) {
        story(id: $storyID) {
          ...AllCommentsTabContainer_story
            @arguments(count: $count, cursor: $cursor, orderBy: $orderBy)
        }
      }
    `,
  }
)(AllCommentsTabContainer);

export type AllCommentsTabContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
