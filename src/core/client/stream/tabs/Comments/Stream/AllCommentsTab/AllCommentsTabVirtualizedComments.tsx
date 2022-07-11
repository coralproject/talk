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

import { useLocal } from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import { NUM_INITIAL_COMMENTS } from "coral-stream/constants";
import { Button } from "coral-ui/components/v3";
import colors from "coral-ui/theme/colors";

import { AllCommentsTabContainer_settings } from "coral-stream/__generated__/AllCommentsTabContainer_settings.graphql";
import { AllCommentsTabContainer_story } from "coral-stream/__generated__/AllCommentsTabContainer_story.graphql";
import { AllCommentsTabContainer_viewer } from "coral-stream/__generated__/AllCommentsTabContainer_viewer.graphql";
import { COMMENT_SORT } from "coral-stream/__generated__/AllCommentsTabContainerPaginationQuery.graphql";
import { AllCommentsTabVirtualizedCommentsLocal } from "coral-stream/__generated__/AllCommentsTabVirtualizedCommentsLocal.graphql";

import AllCommentsTabCommentContainer from "./AllCommentsTabCommentContainer";

export interface NextUnseenComment {
  commentID?: string | null;
  parentID?: string | null;
  rootCommentID?: string | null;
  index?: number | null;
  needToLoadNew?: boolean | null;
}

interface Props {
  settings: AllCommentsTabContainer_settings;
  viewer: AllCommentsTabContainer_viewer | null;
  story: AllCommentsTabContainer_story;
  loadMoreAndEmit: () => Promise<any>;
  hasMore: boolean;
  isLoadingMore: boolean;
  currentScrollRef: any;
  alternateOldestViewEnabled: boolean;
  commentsOrderBy: COMMENT_SORT;
  comments: any;
  newCommentsToShow: any;
}

// Virtuoso settings
const overscan = 50;
const increaseViewportBy = 2000;
const virtuosoHeight = 600;
const scrollSeekShowPlaceholderVelocity = 5000;

const AllCommentsTabVirtualizedComments: FunctionComponent<Props> = ({
  story,
  settings,
  viewer,
  loadMoreAndEmit,
  hasMore,
  isLoadingMore,
  currentScrollRef,
  alternateOldestViewEnabled,
  commentsOrderBy,
  comments,
  newCommentsToShow,
}) => {
  const [local, setLocal] = useLocal<
    AllCommentsTabVirtualizedCommentsLocal
  >(graphql`
    fragment AllCommentsTabVirtualizedCommentsLocal on Local {
      commentWithTraversalFocus
      showLoadAllCommentsButton
      oldestFirstNewCommentsToShow
      totalCommentsLength
      viewNewRepliesCount
      zKeyClickedLoadAll
      addACommentButtonClicked
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

  // TODO: This will no longer be necessarily once these comments are just inserted into comments in container
  // Total comments length is either the number of comments that have been loaded OR,
  // for oldest first view, the number of comments loaded PLUS any new comments
  // that have been added via the Add new comments box.
  const totalCommentsLength = useMemo(() => {
    return newCommentsToShow
      ? comments.length + newCommentsToShow.length
      : comments.length;
  }, [newCommentsToShow, comments]);

  useEffect(() => {
    setLocal({ totalCommentsLength });
  }, [totalCommentsLength, setLocal]);

  // This determines if there are more comments to display than the initial 20.
  // It also takes into account the initial comments loaded since if we start
  // with fewer than 20, we will never want to display load all as new comments
  // come in.
  const moreCommentsForLoadAll = useMemo(() => {
    return (
      totalCommentsLength > NUM_INITIAL_COMMENTS &&
      ((initialComments && initialComments.length > NUM_INITIAL_COMMENTS) ||
        (initialComments &&
          initialComments.length === NUM_INITIAL_COMMENTS &&
          initialComments.hasMore))
    );
  }, [totalCommentsLength, initialComments]);

  // We determine whether to display the Load all comments button based on whether:
  // 1. If there are more comments to display than 20 AND fewer than 20 weren't initially loaded.
  // 2. Don't display if Z key has clicked the Load all button to open it and go to next unseen.
  // 3. Display if the Add a comment button has been clicked in alternate oldest view.
  // 4. If alternate oldest view enabled, don't display if Load all button has been clicked;
  // otherwise, default to the admin configuration.
  // 5. Last, we check the admin configuration and displayed based on that and whether or not
  // the Load all button has already been clicked.
  const displayLoadAllButton = useMemo(() => {
    if (moreCommentsForLoadAll) {
      if (local.zKeyClickedLoadAll) {
        return false;
      }
      if (local.addACommentButtonClicked) {
        return true;
      }
      if (alternateOldestViewEnabled) {
        return loadAllButtonHasBeenClicked ? false : !settings.loadAllComments;
      }
      if (!settings.loadAllComments) {
        return !loadAllButtonHasBeenClicked;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }, [
    settings.loadAllComments,
    totalCommentsLength,
    initialComments,
    alternateOldestViewEnabled,
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

  // If the Load All Comments button is clicked, we need to set that it has been
  // clicked so that we know it should no longer be displayed.
  const onDisplayLoadAllButtonClick = useCallback(() => {
    setLoadAllButtonHasBeenClicked(true);
    setLocal({ zKeyClickedLoadAll: false });
    setLocal({ addACommentButtonClicked: false });
  }, [setLocal, setLoadAllButtonHasBeenClicked]);

  useEffect(() => {
    // on rerender, clear the newly added comments to display if it's
    // alternate oldest view
    setLocal({ oldestFirstNewCommentsToShow: "" });
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
              disabled={isLoadingMore}
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
    totalCommentsLength,
    initialComments,
    loadMoreAndEmit,
    onDisplayLoadAllButtonClick,
    story.comments.edges.length,
  ]);

  // The scroll seek placeholder is displayed in place of comments when the user is
  // scrolling up/down the page at a velocity that is greater than the
  // scrollSeekShowPlaceholderVelocity that is set for Virtuoso.
  const ScrollSeekPlaceholder = useCallback(
    ({ height }: { height: number }) => {
      return (
        <div
          style={{
            height,
            boxSizing: "border-box",
          }}
        >
          <div style={{ display: "flex", flexFlow: "column", height: "100%" }}>
            <div
              style={{
                flex: "0 1 auto",
              }}
            >
              <hr style={{ border: `1px solid ${colors.grey200}` }} />
            </div>
            <div
              style={{
                flex: "0 1 auto",
                backgroundColor: `${colors.grey100}`,
                width: "50%",
                height: "2rem",
              }}
            ></div>
            <div
              style={{
                flex: "0 1 auto",
                backgroundColor: `${colors.pure.white}`,
                width: "100%",
                height: "1rem",
              }}
            ></div>
            <div
              style={{
                flex: "1 1 auto",
                backgroundColor: `${colors.grey200}`,
                width: "100%",
                height: "95%",
              }}
            ></div>
            <div
              style={{
                flex: "0 1 auto",
                backgroundColor: `${colors.pure.white}`,
                width: "100%",
                height: "1rem",
              }}
            ></div>
            <div
              style={{
                flex: "0 1 1.5rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div
                style={{
                  backgroundColor: `${colors.grey100}`,
                  height: "100%",
                  width: "12rem",
                }}
              ></div>
              <div
                style={{
                  backgroundColor: `${colors.grey100}`,
                  height: "100%",
                  width: "3rem",
                }}
              ></div>
            </div>
          </div>
        </div>
      );
    },
    []
  );

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
        endReached={() => {
          if (hasMore && !isLoadingMore) {
            void loadMoreAndEmit();
          }
        }}
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
        components={{ ScrollSeekPlaceholder, Footer }}
        scrollSeekConfiguration={{
          enter: (velocity) => {
            const shouldEnter =
              Math.abs(velocity) >= scrollSeekShowPlaceholderVelocity;
            return shouldEnter;
          },
          exit: (velocity) => {
            const shouldExit = Math.abs(velocity) === 0;
            return shouldExit;
          },
        }}
      />
    </>
  );
};

export default AllCommentsTabVirtualizedComments;
