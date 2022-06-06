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

import { useFetch, useLocal } from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT, GQLFEATURE_FLAG } from "coral-framework/schema";
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
import NextUnseenCommentFetch from "./NextUnseenCommentFetch";

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
  nextUnseenComment: NextUnseenComment | null;
  onNextUnseenCommentFetched: (
    nextUnseenComment: NextUnseenComment | null
  ) => void;
  zKeyClickedAndLoadAllComments: boolean;
  viewNewCount: number;
}

// Virtuoso settings
const overscan = 50;
const increaseViewportBy = 2000;
const virtuosoHeight = 600;
const scrollSeekShowPlaceholderVelocity = 1200;

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
  nextUnseenComment,
  onNextUnseenCommentFetched,
  zKeyClickedAndLoadAllComments,
  viewNewCount,
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
    }
  `);

  // In alternate oldest view, we need to know if the Load all button has been displayed
  // so that we know if we should display new comments added via the post comment form
  // above them.
  const [
    loadAllButtonHasBeenDisplayed,
    setLoadAllButtonHasBeenDisplayed,
  ] = useState(false);

  // In alternate oldest view, we need to know if the Load all button has been clicked.
  // This is because it always shows in this case on initial load UNTIL it has been clicked,
  // and then it is no longer shown.
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

  const { comments, newCommentsToShow } = useMemo(() => {
    // If alternate oldest view, filter out new comments to show as they will
    // be included in the stream at the bottom after initial number of comments.
    // When the new comments are cleared on rerender, they will be shown in chronological position.
    if (alternateOldestViewEnabled) {
      if (local.oldestFirstNewCommentsToShow && loadAllButtonHasBeenDisplayed) {
        const newCommentsToShowIds = local.oldestFirstNewCommentsToShow.split(
          " "
        );
        const commentsWithoutNew = story.comments.edges.filter(
          (c) => !newCommentsToShowIds.includes(c.node.id)
        );
        const newComments = story.comments.edges.filter((c) =>
          newCommentsToShowIds.includes(c.node.id)
        );
        return {
          comments: commentsWithoutNew,
          newCommentsToShow: newComments,
        };
      }
    }
    return { comments: story.comments.edges, newCommentsToShow: null };
  }, [
    story.comments.edges,
    alternateOldestViewEnabled,
    local.oldestFirstNewCommentsToShow,
    loadAllButtonHasBeenDisplayed,
  ]);

  // Total comments length is either the number of comments that have been loaded OR,
  // for alternate oldest view, the number of comments loaded PLUS any new comments
  // that have been added via the Add new comments box.
  const totalCommentsLength = useMemo(() => {
    return newCommentsToShow
      ? comments.length + newCommentsToShow.length
      : comments.length;
  }, [newCommentsToShow, comments]);

  useEffect(() => {
    setLocal({ totalCommentsLength });
  }, [totalCommentsLength, setLocal]);

  // We determine whether to display the Load all comments button based on whether:
  // 1. Don't display if Z key has been clicked and the next unseen comment is below the
  // initial number of comments displayed.
  // 2. Display if setting to show button enabled in admin OR we are in alternate oldest
  // view and the button hasn't already been clicked. AND we have more comments to display
  // if the button is clicked. We check initial comments because if the number of initial
  // comments is less than the initial number of comments we want to display before a Load all,
  // then we never need to show the Load all button as more comments are added.
  const displayLoadAllButton = useMemo(() => {
    if (zKeyClickedAndLoadAllComments) {
      return false;
    }
    return (
      (local.showLoadAllCommentsButton ||
        (alternateOldestViewEnabled && !loadAllButtonHasBeenClicked)) &&
      totalCommentsLength > NUM_INITIAL_COMMENTS &&
      ((initialComments && initialComments.length > NUM_INITIAL_COMMENTS) ||
        (initialComments &&
          initialComments.length === NUM_INITIAL_COMMENTS &&
          initialComments.hasMore))
    );
  }, [
    local.showLoadAllCommentsButton,
    totalCommentsLength,
    initialComments,
    alternateOldestViewEnabled,
    loadAllButtonHasBeenClicked,
    zKeyClickedAndLoadAllComments,
  ]);

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

  // This is the fetch for the next unseen comment, which is used for Z key traversal
  // in keyboard shortcuts if Z_KEY is enabled.
  const fetchNextUnseenComment = useFetch(NextUnseenCommentFetch);
  const findNextUnseen = useCallback(() => {
    const findNext = async () => {
      const { nextUnseenComment: nextUnseen } = await fetchNextUnseenComment({
        id: local.commentWithTraversalFocus,
        storyID: story.id,
        orderBy: commentsOrderBy,
        viewNewCount,
      });
      onNextUnseenCommentFetched(nextUnseen);
    };

    void findNext();
  }, [
    fetchNextUnseenComment,
    local.commentWithTraversalFocus,
    story.id,
    commentsOrderBy,
    viewNewCount,
    onNextUnseenCommentFetched,
  ]);

  // Whenever the comment with traversal focus changes, new comments come in via
  // subscription, or new replies come in via subscription, we find the next
  // unseen and set it for keyboard shortcuts if Z_KEY is enabled.
  useEffect(() => {
    if (settings.featureFlags.includes(GQLFEATURE_FLAG.Z_KEY)) {
      findNextUnseen();
    }
  }, [
    local.commentWithTraversalFocus,
    viewNewCount,
    local.viewNewRepliesCount,
    findNextUnseen,
    settings.featureFlags,
  ]);

  // Whenever we initially render, we find the next unseen and set it for keyboard shortcuts
  // if Z_KEY is enabled.
  useEffect(() => {
    if (settings.featureFlags.includes(GQLFEATURE_FLAG.Z_KEY)) {
      findNextUnseen();
    }
  }, []);

  // Whenever the next unseen comment changes, we need to check to make sure
  // that it's included in the comments that are loaded for Virtuoso. If it's
  // not, then we need to load more comments until it is loaded. This is so that if Z key
  // is pressed, Virtuoso will be able to scroll to the next unseen comment.
  useEffect(() => {
    if (nextUnseenComment && nextUnseenComment.index) {
      const nextUnseenInComments =
        nextUnseenComment.index <= comments.length - 1;
      if (!nextUnseenInComments) {
        if (hasMore && !isLoadingMore) {
          void loadMoreAndEmit();
        }
      }
    }
  }, [nextUnseenComment, comments, hasMore, isLoadingMore, loadMoreAndEmit]);

  // If the Load All Comments button is clicked, we need to set that it has been
  // clicked so that we know it should no longer be displayed.
  const onDisplayLoadAllButtonClick = useCallback(() => {
    setLocal({ showLoadAllCommentsButton: false });
    setLoadAllButtonHasBeenClicked(true);
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
    // on rerender, clear if the Load All Comments button has displayed
    setLoadAllButtonHasBeenDisplayed(false);
    // on rerender, reset whether the Load All Comments button has been clicked
    setLoadAllButtonHasBeenClicked(false);
  }, []);

  const Footer = useCallback(() => {
    if (displayLoadAllButton) {
      setLoadAllButtonHasBeenDisplayed(true);
    }
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
                {/* If alternate oldest view, show any newly posted
                comments above Load All Comments button */}
                {alternateOldestViewEnabled &&
                  index === NUM_INITIAL_COMMENTS - 1 &&
                  newCommentsToShow?.map((newComment) => {
                    return (
                      <AllCommentsTabCommentContainer
                        key={newComment.node.id}
                        viewer={viewer}
                        comment={newComment.node}
                        story={story}
                        settings={settings}
                        isLast={false}
                      />
                    );
                  })}
              </>
            );
          },
          [
            story,
            comments,
            settings,
            viewer,
            alternateOldestViewEnabled,
            newCommentsToShow,
          ]
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