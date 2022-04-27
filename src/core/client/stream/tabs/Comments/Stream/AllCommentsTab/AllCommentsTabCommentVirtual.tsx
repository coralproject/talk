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
import { AllCommentsTabCommentVirtualLocal } from "coral-stream/__generated__/AllCommentsTabCommentVirtualLocal.graphql";
import { AllCommentsTabContainer_settings } from "coral-stream/__generated__/AllCommentsTabContainer_settings.graphql";
import { AllCommentsTabContainer_story } from "coral-stream/__generated__/AllCommentsTabContainer_story.graphql";
import { AllCommentsTabContainer_viewer } from "coral-stream/__generated__/AllCommentsTabContainer_viewer.graphql";
import { COMMENT_SORT } from "coral-stream/__generated__/AllCommentsTabContainerPaginationQuery.graphql";

import CLASSES from "coral-stream/classes";
import { NUM_INITIAL_COMMENTS } from "coral-stream/constants";
import { Button } from "coral-ui/components/v3";

import AllCommentsTabCommentContainer from "./AllCommentsTabCommentContainer";

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
}

interface Comment {
  node: {
    id: string;
    seen: boolean | null;
    allChildComments: {
      edges: ReadonlyArray<{ node: { id: string; seen: boolean | null } }>;
    };
  };
}

interface UnseenComment {
  nodeID?: string;
  virtuosoIndex?: number;
  isRoot: boolean;
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
}) => {
  const [local, setLocal] = useLocal<AllCommentsTabCommentVirtualLocal>(graphql`
    fragment AllCommentsTabCommentVirtualLocal on Local {
      commentWithTraversalFocus
      firstNextUnseenComment {
        nodeID
        virtuosoIndex
        isRoot
      }
      secondNextUnseenComment {
        nodeID
        virtuosoIndex
        isRoot
      }
      showLoadAllCommentsButton
      oldestFirstNewCommentsToShow
      totalCommentsLength
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
    // if alternate oldest view, filter out new comments to show as they will
    // be included in the stream after initial number of comments until
    // the new comments are cleared on rerender and shown in chronological position
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

  const totalCommentsLength = useMemo(() => {
    return newCommentsToShow
      ? comments.length + newCommentsToShow.length
      : comments.length;
  }, [newCommentsToShow, comments]);

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

  const showLoadMoreForOldestFirstNewComments = useMemo(() => {
    return (
      hasMore &&
      commentsOrderBy === GQLCOMMENT_SORT.CREATED_AT_ASC &&
      (comments.length < NUM_INITIAL_COMMENTS ||
        (comments.length >= NUM_INITIAL_COMMENTS && !displayLoadAllButton))
    );
  }, [hasMore, commentsOrderBy, comments, displayLoadAllButton]);

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
    // on rerender, also clear if load all button has displayed
    setLoadAllButtonHasBeenDisplayed(false);
    // on rerender, also clear initial comments info
    setInitialComments({
      length: story.comments.edges.length,
      hasMore,
    });
    // on rerender, reset whether the Load All Comments button has been clicked
    setLoadAllButtonHasBeenClicked(false);
  }, []);

  const lookForNextUnseen = useCallback(
    (commentsHere: ReadonlyArray<Comment>, nextSlice: Comment[]) => {
      let counter = 0;
      const firstUnseenComment: UnseenComment = { isRoot: true };
      const secondUnseenComment: UnseenComment = { isRoot: true };
      const firstUnseen = nextSlice.find((comment: Comment) => {
        counter += 1;
        if (comment.node.seen === false) {
          return true;
        }
        if (
          comment.node.allChildComments &&
          comment.node.allChildComments.edges.some((c) => {
            if (c.node.seen === false) {
              return true;
            }
            return false;
          })
        ) {
          firstUnseenComment.isRoot = false;
          return true;
        }
        return false;
      });
      const secondUnseen = nextSlice
        .slice(counter + 1)
        .find((comment: Comment) => {
          if (comment.node.seen === false) {
            return true;
          }
          if (
            comment.node.allChildComments &&
            comment.node.allChildComments.edges.some(
              (c) => c.node.seen === false
            )
          ) {
            secondUnseenComment.isRoot = false;
            return true;
          }
          return false;
        });
      if (firstUnseen) {
        firstUnseenComment.virtuosoIndex = commentsHere.findIndex(
          (comment: Comment) => {
            return (
              comment.node.id === firstUnseen?.node.id ||
              (comment.node.allChildComments &&
                comment.node.allChildComments.edges.some(
                  (c) => c.node.id === firstUnseen?.node.id
                ))
            );
          }
        );
        firstUnseenComment.nodeID = firstUnseen.node.id;
      }
      if (secondUnseen) {
        secondUnseenComment.virtuosoIndex = commentsHere.findIndex(
          (comment: Comment) => {
            return (
              comment.node.id === secondUnseen?.node.id ||
              (comment.node.allChildComments &&
                comment.node.allChildComments.edges.some(
                  (c) => c.node.id === secondUnseen?.node.id
                ))
            );
          }
        );
        secondUnseenComment.nodeID = secondUnseen.node.id;
      }
      if (firstUnseen) {
        if (secondUnseen) {
          return [firstUnseenComment, secondUnseenComment];
        }
        return [firstUnseenComment];
      } else {
        return undefined;
      }
    },
    []
  );

  useEffect(() => {
    const indexOfTraversalFocus = comments.findIndex((comment) => {
      return (
        comment.node.id === local.commentWithTraversalFocus ||
        (comment.node.allChildComments &&
          comment.node.allChildComments.edges.some(
            (c) => c.node.id === local.commentWithTraversalFocus
          ))
      );
    });
    const sliceIndex = indexOfTraversalFocus === -1 ? 0 : indexOfTraversalFocus;
    const nextSlice = comments.slice(sliceIndex);
    const nextUnseen = lookForNextUnseen(comments, nextSlice);
    if (nextUnseen && nextUnseen[0]) {
      setLocal({
        firstNextUnseenComment: nextUnseen[0],
      });
      if (nextUnseen[1]) {
        setLocal({
          secondNextUnseenComment: nextUnseen[1],
        });
      }
    } else {
      if (hasMore && !isLoadingMore) {
        void loadMoreAndEmit();
      }
    }
  }, [
    local.commentWithTraversalFocus,
    comments,
    isLoadingMore,
    hasMore,
    loadMoreAndEmit,
    lookForNextUnseen,
    setLocal,
  ]);

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
                <AllCommentsTabCommentContainer
                  key={comment.node.id}
                  viewer={viewer}
                  comment={comment.node}
                  story={story}
                  settings={settings}
                  isLast={index === comments.length - 1}
                />
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
