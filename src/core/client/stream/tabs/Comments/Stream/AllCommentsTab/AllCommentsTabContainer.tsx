import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { graphql, RelayPaginationProp } from "react-relay";

import FadeInTransition from "coral-framework/components/FadeInTransition";
import { useLive } from "coral-framework/hooks";
import { useViewerNetworkEvent } from "coral-framework/lib/events";
import { IntersectionProvider } from "coral-framework/lib/intersection";
import {
  useLoadMore,
  useLocal,
  useMutation,
  useSubscription,
  withPaginationContainer,
} from "coral-framework/lib/relay";
import {
  GQLCOMMENT_SORT,
  GQLFEATURE_FLAG,
  GQLSTORY_MODE,
  GQLTAG,
  GQLUSER_STATUS,
} from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { KeyboardShortcuts } from "coral-stream/common/KeyboardShortcuts";
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
import CommentsLinks from "../CommentsLinks";
import NoComments from "../NoComments";
import { PostCommentFormContainer } from "../PostCommentForm";
import ViewersWatchingContainer from "../ViewersWatchingContainer";
import AllCommentsTabViewNewMutation from "./AllCommentsTabViewNewMutation";
import CommentEnteredSubscription from "./CommentEnteredSubscription";
import RatingsFilterMenu from "./RatingsFilterMenu";

import styles from "./AllCommentsTabContainer.css";

interface Props {
  story: AllCommentsTabContainer_story;
  settings: AllCommentsTabContainer_settings;
  viewer: AllCommentsTabContainer_viewer | null;
  relay: RelayPaginationProp;
  flattenReplies: boolean;
  tag?: GQLTAG;
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
  tag,
}) => {
  const [{ commentsOrderBy, ratingFilter }, setLocal] = useLocal<
    AllCommentsTabContainerLocal
  >(
    graphql`
      fragment AllCommentsTabContainerLocal on Local {
        ratingFilter
        commentsOrderBy
      }
    `
  );
  const subscribeToCommentEntered = useSubscription(CommentEnteredSubscription);

  const live = useLive({ story, settings });
  const hasMore = relay.hasMore();
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

    // WORKAROUND: because we don't update the story ratings when we subscribe, disable live updates for this.
    if (tag === GQLTAG.REVIEW) {
      return;
    }

    const disposable = subscribeToCommentEntered({
      storyID: story.id,
      orderBy: commentsOrderBy,
      storyConnectionKey: "Stream_comments",
      tag,
    });

    return () => {
      disposable.dispose();
    };
  }, [
    commentsOrderBy,
    hasMore,
    live,
    story.id,
    subscribeToCommentEntered,
    tag,
  ]);

  const onChangeRating = useCallback((rating: number | null) => {
    setLocal({ ratingFilter: rating });
  }, []);

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
  const onViewMore = useCallback(() => viewMore({ storyID: story.id, tag }), [
    story.id,
    tag,
    viewMore,
  ]);
  const viewNewCount = story.comments.viewNewEdges?.length || 0;

  // TODO: extract to separate function
  const banned = !!viewer?.status.current.includes(GQLUSER_STATUS.BANNED);
  const suspended = !!viewer?.status.current.includes(GQLUSER_STATUS.SUSPENDED);
  const warned = !!viewer?.status.current.includes(GQLUSER_STATUS.WARNED);

  const alternateOldestViewEnabled =
    settings.featureFlags.includes(
      GQLFEATURE_FLAG.ALTERNATE_OLDEST_FIRST_VIEW
    ) &&
    commentsOrderBy === GQLCOMMENT_SORT.CREATED_AT_ASC &&
    !story.isClosed &&
    !settings.disableCommenting.enabled;

  const showCommentForm =
    // If we do have the alternate view enabled and...
    alternateOldestViewEnabled &&
    // If we aren't banned and...
    !banned &&
    // If we aren't suspended and...
    !suspended &&
    // If we aren't warned.
    !warned;

  const showGoToDiscussions = useMemo(
    () =>
      !!viewer &&
      !!settings &&
      settings.featureFlags.includes(GQLFEATURE_FLAG.DISCUSSIONS),
    [viewer, settings]
  );

  return (
    <>
      <KeyboardShortcuts />
      {tag === GQLTAG.REVIEW && (
        <RatingsFilterMenu
          rating={ratingFilter}
          onChangeRating={onChangeRating}
        />
      )}
      {viewNewCount > 0 && (
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
            tag={tag}
          />
        )}
        {story.comments.edges.length > 0 &&
          story.comments.edges.map(({ node: comment }, index) => (
            <IgnoredTombstoneOrHideContainer
              key={comment.id}
              viewer={viewer}
              comment={comment}
            >
              <FadeInTransition active={!!comment.enteredLive}>
                <CollapsableComment>
                  {({ collapsed, toggleCollapsed }) => (
                    <HorizontalGutter
                      className={cn({
                        [styles.borderedComment]:
                          !collapsed && index < story.comments.edges.length - 1,
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
        {hasMore && (
          <Localized id="comments-loadMore">
            <Button
              id="comments-loadMore"
              onClick={loadMoreAndEmit}
              color="secondary"
              variant="outlined"
              fullWidth
              disabled={isLoadingMore}
              aria-controls="comments-allComments-log"
              className={CLASSES.allCommentsTabPane.loadMoreButton}
              // Added for keyboard shortcut support.
              data-key-stop
              data-is-load-more
            >
              Load More
            </Button>
          </Localized>
        )}
        {!alternateOldestViewEnabled && (
          <CommentsLinks
            showGoToDiscussions={showGoToDiscussions}
            showGoToProfile={!!viewer}
          />
        )}
      </HorizontalGutter>
      {alternateOldestViewEnabled && (
        <HorizontalGutter mt={6} spacing={4}>
          <IntersectionProvider>
            <ViewersWatchingContainer story={story} settings={settings} />
          </IntersectionProvider>
          {showCommentForm && (
            <PostCommentFormContainer
              story={story}
              settings={settings}
              viewer={viewer}
              commentsOrderBy={commentsOrderBy}
            />
          )}
          <div className={styles.borderedFooter}>
            <CommentsLinks
              showGoToDiscussions={showGoToDiscussions}
              showGoToProfile={!!viewer}
            />
          </div>
        </HorizontalGutter>
      )}
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
          tag: { type: "TAG" }
          ratingFilter: { type: "Int" }
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
        commentCounts {
          totalPublished
        }
        comments(
          first: $count
          after: $cursor
          orderBy: $orderBy
          tag: $tag
          rating: $ratingFilter
        ) @connection(key: "Stream_comments") {
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
        ...ViewersWatchingContainer_story
      }
    `,
    viewer: graphql`
      fragment AllCommentsTabContainer_viewer on User {
        ...ReplyListContainer1_viewer
        ...CommentContainer_viewer
        ...CreateCommentReplyMutation_viewer
        ...CreateCommentMutation_viewer
        ...IgnoredTombstoneOrHideContainer_viewer
        ...PostCommentFormContainer_viewer
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
        featureFlags
        ...ReplyListContainer1_settings
        ...CommentContainer_settings
        ...PostCommentFormContainer_settings
        ...ViewersWatchingContainer_settings
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
    getVariables(
      { story, flattenReplies },
      { count, cursor },
      fragmentVariables
    ) {
      return {
        count,
        cursor,
        tag: fragmentVariables.tag,
        orderBy: fragmentVariables.orderBy,
        ratingFilter: fragmentVariables.ratingFilter,
        // storyID isn't specified as an @argument for the fragment, but it should be a
        // variable available for the fragment under the query root.
        storyID: story.id,
        flattenReplies,
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
        $tag: TAG
        $flattenReplies: Boolean!
        $ratingFilter: Int
      ) {
        story(id: $storyID) {
          ...AllCommentsTabContainer_story
            @arguments(
              count: $count
              cursor: $cursor
              orderBy: $orderBy
              tag: $tag
              ratingFilter: $ratingFilter
            )
        }
      }
    `,
  }
)(AllCommentsTabContainer);

export type AllCommentsTabContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
