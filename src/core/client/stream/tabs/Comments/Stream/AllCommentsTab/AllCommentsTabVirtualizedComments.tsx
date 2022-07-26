import { Localized } from "@fluent/react/compat";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { graphql } from "react-relay";
import { Virtuoso } from "react-virtuoso";

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
  commentsFullyLoaded: boolean;
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
  commentsFullyLoaded,
}) => {
  const [local, setLocal] = useLocal<
    AllCommentsTabVirtualizedCommentsLocal
  >(graphql`
    fragment AllCommentsTabVirtualizedCommentsLocal on Local {
      showLoadAllCommentsButton
      addACommentButtonClicked
      zKeyClickedLoadAll
      keyboardShortcutsConfig {
        key
        source
        reverse
      }
    }
  `);

  // We need to know if the Load all button has been clicked to help determine whether
  // to display the Load all button or not.
  const [
    loadAllButtonHasBeenClicked,
    setLoadAllButtonHasBeenClicked,
  ] = useState(false);

  // Initial comments are used to determine whether the Load all comments button should be
  // displayed or not.
  const [initialComments, setInitialComments] = useState<null | {
    length: number;
    hasMore: boolean;
  }>(null);

  // This determines if there are more comments to display than the initial 20.
  // It also takes into account the initial comments loaded since if we start
  // with fewer than 20, we will never want to display load all as new comments
  // come in.
  const moreCommentsForLoadAll = useMemo(() => {
    if (!commentsFullyLoaded && hasMore) {
      return true;
    } else {
      return (
        comments.length > NUM_INITIAL_COMMENTS &&
        ((initialComments && initialComments.length > NUM_INITIAL_COMMENTS) ||
          (initialComments &&
            initialComments.length === NUM_INITIAL_COMMENTS &&
            initialComments.hasMore))
      );
    }
  }, [comments.length, initialComments, commentsFullyLoaded, hasMore]);

  // We determine whether to display the Load all comments button based on whether:
  // 1. If there are more comments to display than 20 AND fewer than 20 weren't initially loaded.
  // 2. Don't display if Z key has clicked the Load all button to open it and go to next unseen OR
  // if the add a comment button has been clicked in alternate oldest view.
  // 3. Last, we check the admin configuration and displayed based on that and whether or not
  // the Load all button has already been clicked.
  const displayLoadAllButton = useMemo(() => {
    if (moreCommentsForLoadAll) {
      if (local.zKeyClickedLoadAll || local.addACommentButtonClicked) {
        return false;
      }
      return settings.loadAllComments ? false : !loadAllButtonHasBeenClicked;
    } else {
      return false;
    }
  }, [
    settings.loadAllComments,
    loadAllButtonHasBeenClicked,
    local.zKeyClickedLoadAll,
    local.addACommentButtonClicked,
    moreCommentsForLoadAll,
  ]);

  useEffect(() => {
    setLocal({ showLoadAllCommentsButton: displayLoadAllButton });
  }, [displayLoadAllButton, setLocal]);

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

  const beginLoadMoreAllCommentsEvent = useViewerNetworkEvent(
    LoadMoreAllCommentsEvent
  );

  // If the Load All Comments button is clicked, we need to set that it has been
  // clicked so that we know it should no longer be displayed.
  const onDisplayLoadAllButtonClick = useCallback(() => {
    setLoadAllButtonHasBeenClicked(true);
    setLocal({ zKeyClickedLoadAll: false });
    setLocal({ addACommentButtonClicked: false });

    const loadAllCommentsEvent = beginLoadMoreAllCommentsEvent({
      storyID: story.id,
      keyboardShortcutsConfig: local.keyboardShortcutsConfig,
    });

    loadAllCommentsEvent.success();
  }, [
    setLocal,
    setLoadAllButtonHasBeenClicked,
    story,
    local.keyboardShortcutsConfig,
  ]);

  useEffect(() => {
    // on rerender, clear initial comments info
    setInitialComments({
      length: story.comments.edges.length,
      hasMore,
    });
    // on rerender, reset whether the Load All Comments button has been clicked
    setLoadAllButtonHasBeenClicked(false);
  }, []);

  const Footer = useCallback(() => {
    return (
      <>
        {showLoadMoreForOldestFirstNewComments && (
          <Localized id="comments-loadMore">
            <Button
              key={`comments-loadMore-${story.comments.edges.length}`}
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
          <Localized id="comments-loadAll">
            <Button
              key={`comments-loadAll-${comments.length}`}
              id="comments-loadAll"
              onClick={onDisplayLoadAllButtonClick}
              color="secondary"
              variant="outlined"
              fullWidth
              disabled={!commentsFullyLoaded || isLoadingMore}
              aria-controls="comments-allComments-log"
              className={CLASSES.allCommentsTabPane.loadMoreButton}
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
    setLocal,
    displayLoadAllButton,
    showLoadMoreForOldestFirstNewComments,
    initialComments,
    loadMoreAndEmit,
    onDisplayLoadAllButtonClick,
    story.comments.edges.length,
    commentsFullyLoaded,
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
        useWindowScroll
        ref={currentScrollRef}
        style={{ height: comments.length > 0 ? virtuosoHeight : 0 }}
        increaseViewportBy={{
          top: increaseViewportBy,
          bottom: increaseViewportBy,
        }}
        totalCount={
          displayLoadAllButton ? NUM_INITIAL_COMMENTS : comments.length
        }
        overscan={overscan}
        itemContent={useCallback(
          (index) => {
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
