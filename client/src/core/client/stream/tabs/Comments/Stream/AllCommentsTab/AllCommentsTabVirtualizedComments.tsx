import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback, useMemo } from "react";
import { graphql } from "react-relay";
import { Virtuoso } from "react-virtuoso";

import { useCoralContext } from "coral-framework/lib/bootstrap";
import { useViewerNetworkEvent } from "coral-framework/lib/events";
import { useLocal } from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import { NUM_INITIAL_COMMENTS } from "coral-stream/constants";
import { LoadMoreAllCommentsEvent } from "coral-stream/events";
import { Button } from "coral-ui/components/v3";

import { AllCommentsTabContainer_settings } from "coral-stream/__generated__/AllCommentsTabContainer_settings.graphql";
import { AllCommentsTabContainer_story } from "coral-stream/__generated__/AllCommentsTabContainer_story.graphql";
import { AllCommentsTabContainer_viewer } from "coral-stream/__generated__/AllCommentsTabContainer_viewer.graphql";
import { COMMENT_SORT } from "coral-stream/__generated__/AllCommentsTabContainerPaginationQuery.graphql";
import { AllCommentsTabVirtualizedCommentsLocal } from "coral-stream/__generated__/AllCommentsTabVirtualizedCommentsLocal.graphql";

import AllCommentsTabCommentContainer from "./AllCommentsTabCommentContainer";

import styles from "./AllCommentsTabVirtualizedComments.css";

interface Props {
  settings: AllCommentsTabContainer_settings;
  viewer: AllCommentsTabContainer_viewer | null;
  story: AllCommentsTabContainer_story;
  loadMoreAndEmit: () => Promise<any>;
  hasMore: boolean;
  isLoadingMore: boolean;
  currentScrollRef: any;
  commentsOrderBy: COMMENT_SORT;
  comments: AllCommentsTabContainer_story["comments"]["edges"];
  newCommentsLength: number;
}

// Virtuoso settings
const overscan = 50;
const increaseViewportBy = 2000;
const virtuosoHeight = 600;

const AllCommentsTabVirtualizedComments: FunctionComponent<Props> = ({
  story,
  settings,
  viewer,
  loadMoreAndEmit,
  hasMore,
  isLoadingMore,
  currentScrollRef,
  commentsOrderBy,
  comments,
  newCommentsLength,
}) => {
  const [
    {
      commentsFullyLoaded,
      loadAllButtonHasBeenClicked,
      keyboardShortcutsConfig,
    },
    setLocal,
  ] = useLocal<AllCommentsTabVirtualizedCommentsLocal>(graphql`
    fragment AllCommentsTabVirtualizedCommentsLocal on Local {
      commentsFullyLoaded
      loadAllButtonHasBeenClicked
      keyboardShortcutsConfig {
        key
        source
        reverse
      }
    }
  `);

  const { customScrollContainer } = useCoralContext();

  // This determines if there are more comments to display than the initial 20.
  // It also takes into account the initial comments loaded since if we start
  // with fewer than 20, we will never want to display load all as new comments
  // come in.
  const moreCommentsForLoadAll = useMemo(() => {
    const commentsOnLoad = { length: comments.length, hasMore };
    const commentsOnLoadLessThanInitialComments =
      commentsOnLoad.length < NUM_INITIAL_COMMENTS;
    return commentsOnLoadLessThanInitialComments
      ? false
      : commentsOnLoad.hasMore;
  }, []);

  // We determine whether to display the Load all comments button based on whether:
  // 1. If there are more comments to display than 20 AND fewer than 20 weren't initially loaded.
  // 2. If comments haven't fully loaded, we display.
  // 3. If Load all button hasn't been clicked yet, then we display.
  const displayLoadAllButton = useMemo(() => {
    if (moreCommentsForLoadAll) {
      return !commentsFullyLoaded ? true : !loadAllButtonHasBeenClicked;
    } else {
      return false;
    }
  }, [
    loadAllButtonHasBeenClicked,
    moreCommentsForLoadAll,
    commentsFullyLoaded,
  ]);

  const beginLoadMoreAllCommentsEvent = useViewerNetworkEvent(
    LoadMoreAllCommentsEvent
  );

  // If the Load All Comments button is clicked, we need to set that it has been
  // clicked so that we know it should no longer be displayed.
  const onDisplayLoadAllButtonClick = useCallback(() => {
    setLocal({ loadAllButtonHasBeenClicked: true });

    const loadAllCommentsEvent = beginLoadMoreAllCommentsEvent({
      storyID: story.id,
      keyboardShortcutsConfig,
    });

    loadAllCommentsEvent.success();
  }, [
    setLocal,
    story.id,
    keyboardShortcutsConfig,
    beginLoadMoreAllCommentsEvent,
  ]);

  const loadAllButtonDisabled = useMemo(() => {
    return !commentsFullyLoaded && loadAllButtonHasBeenClicked;
  }, [commentsFullyLoaded, loadAllButtonHasBeenClicked]);

  // When comments are sorted oldest first, this determines if there are new comments
  // that have come in via subscription for which a Load more button should be
  // displayed.
  const showLoadMoreForOldestFirstNewComments = useMemo(() => {
    return (
      commentsOrderBy === GQLCOMMENT_SORT.CREATED_AT_ASC &&
      hasMore &&
      (comments.length < NUM_INITIAL_COMMENTS ||
        (comments.length >= NUM_INITIAL_COMMENTS && !displayLoadAllButton))
    );
  }, [hasMore, commentsOrderBy, comments, displayLoadAllButton]);

  const Footer = useCallback(() => {
    return (
      <>
        {showLoadMoreForOldestFirstNewComments && (
          <Localized id="comments-loadMore">
            <Button
              key={`comments-loadMore-${comments.length}`}
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
        {displayLoadAllButton && (
          <Localized
            id={
              loadAllButtonDisabled
                ? "comments-loadAll-loading"
                : "comments-loadAll"
            }
          >
            <Button
              key={`comments-loadAll-${comments.length}`}
              id="comments-loadAll"
              onClick={onDisplayLoadAllButtonClick}
              color="secondary"
              variant="outlined"
              fullWidth
              disabled={!!loadAllButtonDisabled}
              aria-controls="comments-allComments-log"
              className={cn(
                CLASSES.allCommentsTabPane.loadMoreButton,
                styles.loadAll
              )}
              // Added for keyboard shortcut support.
              data-key-stop
              data-is-load-more
            >
              Load All Comments
            </Button>
          </Localized>
        )}
      </>
    );
  }, [
    comments,
    isLoadingMore,
    displayLoadAllButton,
    loadMoreAndEmit,
    onDisplayLoadAllButtonClick,
    loadAllButtonDisabled,
    showLoadMoreForOldestFirstNewComments,
  ]);

  return (
    <>
      <Virtuoso
        {...(process.env.NODE_ENV === "test"
          ? {
              initialItemCount: comments.length,
              key: comments.length,
            }
          : {})}
        customScrollParent={customScrollContainer}
        useWindowScroll
        ref={currentScrollRef}
        style={{ height: comments.length > 0 ? virtuosoHeight : 0 }}
        increaseViewportBy={{
          top: increaseViewportBy,
          bottom: increaseViewportBy,
        }}
        totalCount={
          displayLoadAllButton
            ? NUM_INITIAL_COMMENTS + newCommentsLength
            : comments.length
        }
        overscan={overscan}
        itemContent={useCallback(
          (index: number) => {
            const comment = comments[index];
            return (
              <>
                <AllCommentsTabCommentContainer
                  key={comment.node.id}
                  viewer={viewer}
                  comment={comment.node}
                  story={story}
                  settings={settings}
                  isLast={index === comments.length - 1}
                />
              </>
            );
          },
          [story, comments, settings, viewer]
        )}
        components={{ Footer }}
      />
    </>
  );
};

export default AllCommentsTabVirtualizedComments;
