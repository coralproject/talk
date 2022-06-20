import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { graphql, RelayPaginationProp } from "react-relay";

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
import {
  LoadMoreAllCommentsEvent,
  ViewNewCommentsNetworkEvent,
} from "coral-stream/events";
import {
  CommentEditedSubscription,
  CommentEnteredSubscription,
} from "coral-stream/tabs/Comments/Stream/Subscriptions";
import { Box, HorizontalGutter } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { AllCommentsTabContainer_settings } from "coral-stream/__generated__/AllCommentsTabContainer_settings.graphql";
import { AllCommentsTabContainer_story } from "coral-stream/__generated__/AllCommentsTabContainer_story.graphql";
import { AllCommentsTabContainer_viewer } from "coral-stream/__generated__/AllCommentsTabContainer_viewer.graphql";
import { AllCommentsTabContainerLocal } from "coral-stream/__generated__/AllCommentsTabContainerLocal.graphql";
import { AllCommentsTabContainerPaginationQueryVariables } from "coral-stream/__generated__/AllCommentsTabContainerPaginationQuery.graphql";

import { useCommentSeenEnabled } from "../../commentSeen";
import CommentsLinks from "../CommentsLinks";
import NoComments from "../NoComments";
import { PostCommentFormContainer } from "../PostCommentForm";
import ViewersWatchingContainer from "../ViewersWatchingContainer";
import AllCommentsTabViewNewMutation from "./AllCommentsTabViewNewMutation";
import AllCommentsTabVirtualizedComments, {
  NextUnseenComment,
} from "./AllCommentsTabVirtualizedComments";
import RatingsFilterMenu from "./RatingsFilterMenu";

import styles from "./AllCommentsTabContainer.css";

interface Props {
  story: AllCommentsTabContainer_story;
  settings: AllCommentsTabContainer_settings;
  viewer: AllCommentsTabContainer_viewer | null;
  relay: RelayPaginationProp;
  flattenReplies: boolean;
  currentScrollRef: any;
  tag?: GQLTAG;
}

export const AllCommentsTabContainer: FunctionComponent<Props> = ({
  story,
  settings,
  viewer,
  relay,
  tag,
  currentScrollRef,
}) => {
  const [
    { commentsOrderBy, ratingFilter, keyboardShortcutsConfig },
    setLocal,
  ] = useLocal<AllCommentsTabContainerLocal>(
    graphql`
      fragment AllCommentsTabContainerLocal on Local {
        ratingFilter
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
  const subscribeToCommentEdited = useSubscription(CommentEditedSubscription);

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
        // Oldest first can always get more comments in view like when so replies to an old comment.
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

    const commenteEnteredDisposable = subscribeToCommentEntered({
      storyID: story.id,
      orderBy: commentsOrderBy,
      storyConnectionKey: "Stream_comments",
      tag,
    });

    const commentEditedDisposable = subscribeToCommentEdited({
      storyID: story.id,
    });

    return () => {
      commenteEnteredDisposable.dispose();
      commentEditedDisposable.dispose();
    };
  }, [
    commentsOrderBy,
    hasMore,
    live,
    story.id,
    subscribeToCommentEntered,
    subscribeToCommentEdited,
    tag,
  ]);

  const onChangeRating = useCallback(
    (rating: number | null) => {
      setLocal({ ratingFilter: rating });
    },
    [setLocal]
  );

  const commentSeenEnabled = useCommentSeenEnabled();
  const [loadMore, isLoadingMore] = useLoadMore(relay, 20);
  const beginLoadMoreEvent = useViewerNetworkEvent(LoadMoreAllCommentsEvent);
  const beginViewNewCommentsEvent = useViewerNetworkEvent(
    ViewNewCommentsNetworkEvent
  );

  const loadMoreAndEmit = useCallback(async () => {
    const loadMoreEvent = beginLoadMoreEvent({
      storyID: story.id,
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
  }, [beginLoadMoreEvent, story.id, keyboardShortcutsConfig, loadMore]);
  const viewMore = useMutation(AllCommentsTabViewNewMutation);
  const onViewMore = useCallback(async () => {
    const viewNewCommentsEvent = beginViewNewCommentsEvent({
      storyID: story.id,
      keyboardShortcutsConfig,
    });
    try {
      await viewMore({
        storyID: story.id,
      });
      viewNewCommentsEvent.success();
    } catch (error) {
      viewNewCommentsEvent.error({ message: error.message, code: error.code });
      // eslint-disable-next-line no-console
      console.error(error);
    }
  }, [beginViewNewCommentsEvent, story.id, keyboardShortcutsConfig, viewMore]);
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

  const [
    nextUnseenComment,
    setNextUnseenComment,
  ] = useState<NextUnseenComment | null>(null);

  const onNextUnseenCommentFetched = useCallback(
    (nextUnseen: NextUnseenComment) => {
      setNextUnseenComment(nextUnseen);
    },
    [setNextUnseenComment]
  );
  return (
    <>
      <KeyboardShortcuts
        loggedIn={!!viewer}
        storyID={story.id}
        currentScrollRef={currentScrollRef}
        nextUnseenComment={nextUnseenComment}
      />
      {tag === GQLTAG.REVIEW && (
        <RatingsFilterMenu
          rating={ratingFilter}
          onChangeRating={onChangeRating}
        />
      )}
      {viewNewCount > 0 && (
        <Box mb={4} clone>
          <Button
            id="comments-allComments-viewNewButton"
            variant="outlined"
            color="primary"
            onClick={onViewMore}
            className={CLASSES.allCommentsTabPane.viewNewButton}
            aria-controls="comments-allComments-log"
            data-key-stop
            data-is-load-more
            data-is-view-new
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
        size="oneAndAHalf"
        role="log"
        aria-live="off"
        spacing={commentSeenEnabled ? 0 : undefined}
      >
        {story.comments.edges.length <= 0 && (
          <NoComments
            mode={story.settings.mode}
            isClosed={story.isClosed}
            tag={tag}
          />
        )}
        <AllCommentsTabVirtualizedComments
          settings={settings}
          viewer={viewer}
          story={story}
          isLoadingMore={isLoadingMore}
          loadMoreAndEmit={loadMoreAndEmit}
          hasMore={hasMore}
          currentScrollRef={currentScrollRef}
          alternateOldestViewEnabled={alternateOldestViewEnabled}
          commentsOrderBy={commentsOrderBy}
          nextUnseenComment={nextUnseenComment}
          onNextUnseenCommentFetched={onNextUnseenCommentFetched}
          viewNewCount={viewNewCount}
        />
        {!alternateOldestViewEnabled && (
          <IntersectionProvider threshold={1}>
            <CommentsLinks
              showGoToDiscussions={showGoToDiscussions}
              showGoToProfile={!!viewer}
            />
          </IntersectionProvider>
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
            <IntersectionProvider threshold={1}>
              <CommentsLinks
                showGoToDiscussions={showGoToDiscussions}
                showGoToProfile={!!viewer}
              />
            </IntersectionProvider>
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
  Omit<Props, "currentScrollRef">,
  AllCommentsTabContainerPaginationQueryVariables,
  FragmentVariables
>(
  {
    story: graphql`
      fragment AllCommentsTabContainer_story on Story
        @argumentDefinitions(
          count: { type: "Int", defaultValue: 20 }
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
          tags {
            REVIEW
            QUESTION
          }
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
              id
              ...AllCommentsTabCommentContainer_comment
            }
          }
          edges {
            node {
              id
              ...AllCommentsTabCommentContainer_comment
            }
          }
        }
        ...PostCommentFormContainer_story
        ...CreateCommentReplyMutation_story
        ...CreateCommentMutation_story
        ...ViewersWatchingContainer_story
        ...AllCommentsTabCommentContainer_story
      }
    `,
    viewer: graphql`
      fragment AllCommentsTabContainer_viewer on User {
        ...AllCommentsTabCommentContainer_viewer
        ...CreateCommentReplyMutation_viewer
        ...CreateCommentMutation_viewer
        ...PostCommentFormContainer_viewer
        id
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
        loadAllComments
        ...PostCommentFormContainer_settings
        ...ViewersWatchingContainer_settings
        ...AllCommentsTabCommentContainer_settings
      }
    `,
  },
  {
    getConnectionFromProps({ story }) {
      return story && story.comments;
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
