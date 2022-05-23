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

import { IntersectionProvider } from "coral-framework/lib/intersection";
import { useFetch, useLocal } from "coral-framework/lib/relay";
import { GQLCOMMENT_SORT, GQLFEATURE_FLAG } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import { NUM_INITIAL_COMMENTS } from "coral-stream/constants";
import { Button } from "coral-ui/components/v3";

import { AllCommentsTabCommentVirtualLocal } from "coral-stream/__generated__/AllCommentsTabCommentVirtualLocal.graphql";
import { AllCommentsTabContainer_settings } from "coral-stream/__generated__/AllCommentsTabContainer_settings.graphql";
import { AllCommentsTabContainer_story } from "coral-stream/__generated__/AllCommentsTabContainer_story.graphql";
import { AllCommentsTabContainer_viewer } from "coral-stream/__generated__/AllCommentsTabContainer_viewer.graphql";
import { COMMENT_SORT } from "coral-stream/__generated__/AllCommentsTabContainerPaginationQuery.graphql";

import AllCommentsTabCommentContainer from "./AllCommentsTabCommentContainer";
import NextUnseenCommentFetch from "./NextUnseenCommentFetch";

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
  setNextUnseenComment: any;
  nextUnseenComment: any;
}

// Virtuoso settings
const overscan = 50;
const increaseViewportBy = 2000;
const virtuosoHeight = 600;
const scrollSeekShowPlaceholderVelocity = 1200;

const AllCommentsTabCommentVirtual: FunctionComponent<Props> = ({
  story,
  settings,
  viewer,
  loadMoreAndEmit,
  hasMore,
  isLoadingMore,
  currentScrollRef,
  alternateOldestViewEnabled,
  commentsOrderBy,
  setNextUnseenComment,
  nextUnseenComment,
}) => {
  const [local, setLocal] = useLocal<AllCommentsTabCommentVirtualLocal>(graphql`
    fragment AllCommentsTabCommentVirtualLocal on Local {
      commentWithTraversalFocus
      showLoadAllCommentsButton
      oldestFirstNewCommentsToShow
      totalCommentsLength
      storyID
      commentsOrderBy
      viewNewCount
      viewNewRepliesCount
    }
  `);
  const [
    loadAllButtonHasBeenDisplayed,
    setLoadAllButtonHasBeenDisplayed,
  ] = useState(false);
  const [
    loadAllButtonHasBeenClicked,
    setLoadAllButtonHasBeenClicked,
  ] = useState(false);
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

  // TODO: Add comment here
  const totalCommentsLength = useMemo(() => {
    return newCommentsToShow
      ? comments.length + newCommentsToShow.length
      : comments.length;
  }, [newCommentsToShow, comments]);

  // TODO: Add comment here
  const displayLoadAllButton = useMemo(() => {
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
  ]);

  // TODO: Add comment here
  const showLoadMoreForOldestFirstNewComments = useMemo(() => {
    return (
      hasMore &&
      commentsOrderBy === GQLCOMMENT_SORT.CREATED_AT_ASC &&
      (comments.length < NUM_INITIAL_COMMENTS ||
        (comments.length >= NUM_INITIAL_COMMENTS && !displayLoadAllButton))
    );
  }, [hasMore, commentsOrderBy, comments, displayLoadAllButton]);

  const fetchNextUnseenComment = useFetch(NextUnseenCommentFetch);
  const findNextUnseen = useCallback(() => {
    const findNext = async () => {
      const { nextUnseenComment: nextUnseen } = await fetchNextUnseenComment({
        id: local.commentWithTraversalFocus,
        storyID: local.storyID,
        orderBy: local.commentsOrderBy,
        viewNewCount: local.viewNewCount,
      });
      setNextUnseenComment(nextUnseen);
    };

    void findNext();
  }, [
    fetchNextUnseenComment,
    local.commentWithTraversalFocus,
    local.storyID,
    local.commentsOrderBy,
    local.viewNewCount,
  ]);

  // Whenever we initially render, comment with traversal focus changes,
  // new comments come in via subscription, or new replies come in via
  // subscription, we find the next unseen and set it for keyboard shortcuts
  // if Z_KEY is enabled.
  useEffect(() => {
    if (settings.featureFlags.includes(GQLFEATURE_FLAG.Z_KEY)) {
      findNextUnseen();
    }
  }, [
    local.commentWithTraversalFocus,
    local.viewNewCount,
    local.viewNewRepliesCount,
  ]);

  useEffect(() => {
    if (settings.featureFlags.includes(GQLFEATURE_FLAG.Z_KEY)) {
      findNextUnseen();
    }
  }, []);

  // Whenever the next unseen comment changes, we need to check to make sure
  // that it's included in the comments that are loaded for Virtuoso. If it's
  // not, then we need to load more comments until it is loaded so that if Z key
  // is pressed, Virtuoso will be able to scroll to the next unseen comment.
  useEffect(() => {
    if (nextUnseenComment) {
      const nextUnseenInComments =
        nextUnseenComment.index <= comments.length - 1;
      if (!nextUnseenInComments) {
        if (hasMore && !isLoadingMore) {
          void loadMoreAndEmit();
        }
      }
    }
  }, [nextUnseenComment, comments, hasMore, isLoadingMore, loadMoreAndEmit]);

  useEffect(() => {
    setLocal({ totalCommentsLength });
  }, [totalCommentsLength, setLocal]);

  const onDisplayLoadAllButtonClick = useCallback(() => {
    setLocal({ showLoadAllCommentsButton: false });
    setLoadAllButtonHasBeenClicked(true);
  }, [setLocal, setLoadAllButtonHasBeenClicked]);

  useEffect(() => {
    // on rerender, clear the newly added comments to show if it's
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

  const ScrollSeekPlaceholder = useCallback(
    ({ height }: { height: number }) => (
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
            <hr style={{ border: "1px solid #eaeff0" }} />
          </div>
          <div
            style={{
              flex: "0 1 auto",
              backgroundColor: "#f4f7f7",
              width: "50%",
              height: "2rem",
            }}
          ></div>
          <div
            style={{
              flex: "0 1 auto",
              backgroundColor: "white",
              width: "100%",
              height: "1rem",
            }}
          ></div>
          <div
            style={{
              flex: "1 1 auto",
              backgroundColor: "#eaeff0",
              width: "100%",
              height: "95%",
            }}
          ></div>
          <div
            style={{
              flex: "0 1 auto",
              backgroundColor: "white",
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
                backgroundColor: "#f4f7f7",
                height: "100%",
                width: "12rem",
              }}
            ></div>
            <div
              style={{
                backgroundColor: "#f4f7f7",
                height: "100%",
                width: "3rem",
              }}
            ></div>
          </div>
        </div>
      </div>
    ),
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
                <IntersectionProvider>
                  <AllCommentsTabCommentContainer
                    key={comment.node.id}
                    viewer={viewer}
                    comment={comment.node}
                    story={story}
                    settings={settings}
                    isLast={index === comments.length - 1}
                  />
                </IntersectionProvider>
                {/* Show any newly posted comments above Load All Comments
                button if alternate oldest view */}
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

export default AllCommentsTabCommentVirtual;
