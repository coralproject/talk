import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { Virtuoso } from "react-virtuoso";

import { AllCommentsTabContainer_settings } from "coral-stream/__generated__/AllCommentsTabContainer_settings.graphql";
import { AllCommentsTabContainer_story } from "coral-stream/__generated__/AllCommentsTabContainer_story.graphql";
import { AllCommentsTabContainer_viewer } from "coral-stream/__generated__/AllCommentsTabContainer_viewer.graphql";
import { AllCommentsTabCommentVirtualLocal } from "coral-stream/__generated__/AllCommentsTabCommentVirtualLocal.graphql";

import AllCommentsTabCommentContainer from "./AllCommentsTabCommentContainer";
import { graphql } from "react-relay";
import { useLocal } from "coral-framework/lib/relay";

interface Props {
  settings: AllCommentsTabContainer_settings;
  viewer: AllCommentsTabContainer_viewer | null;
  story: AllCommentsTabContainer_story;
  loadMoreAndEmit: () => {};
  hasMore: boolean;
  isLoadingMore: boolean;
  currentScrollRef: any;
}

const AllCommentsTabCommentVirtual: FunctionComponent<Props> = ({
  story,
  settings,
  viewer,
  loadMoreAndEmit,
  hasMore,
  isLoadingMore,
  currentScrollRef,
}) => {
  const comments = story.comments.edges;
  const [
    lookedThroughAllCommentsForNextUnseen,
    setLookedThroughAllCommentsForNextUnseen,
  ] = useState(false);

  const [local, setLocal] = useLocal<AllCommentsTabCommentVirtualLocal>(graphql`
    fragment AllCommentsTabCommentVirtualLocal on Local {
      commentWithTraversalFocus
      nextUnseenComment {
        id
        virtuosoIndex
        isRoot
      }
    }
  `);

  const lookForNextUnseen = useCallback(
    (indexOfTraversalFocus: number, commentsHere: any) => {
      const sliceIndex =
        indexOfTraversalFocus === -1 ? 0 : indexOfTraversalFocus;
      const nextSlice = commentsHere.slice(sliceIndex);
      let isRoot = true;
      const nextUnseen = nextSlice.find(
        (comment: {
          node: { seen: boolean; allChildComments: { edges: any[] } };
        }) => {
          if (comment.node.seen === false) {
            return true;
          }
          if (
            comment.node.allChildComments.edges.some(
              (c) => c.node.seen === false
            )
          ) {
            isRoot = false;
            return true;
          }
          return false;
        }
      );
      if (nextUnseen) {
        const indexOfFound = commentsHere.findIndex(
          (comment: {
            node: { id: any; allChildComments: { edges: any[] } };
          }) => {
            return (
              comment.node.id === nextUnseen?.node.id ||
              comment.node.allChildComments.edges.some(
                (c) => c.node.id === nextUnseen?.node.id
              )
            );
          }
        );
        return {
          id: nextUnseen?.node.id,
          virtuosoIndex: indexOfFound,
          isRoot,
        };
      } else {
        return undefined;
      }
    },
    []
  );

  useEffect(() => {
    if (!lookedThroughAllCommentsForNextUnseen) {
      const indexOfTraversalFocus = comments.findIndex((comment) => {
        return (
          comment.node.id === local.commentWithTraversalFocus ||
          comment.node.allChildComments.edges.some(
            (c) => c.node.id === local.commentWithTraversalFocus
          )
        );
      });
      const nextUnseen = lookForNextUnseen(indexOfTraversalFocus, comments);
      if (nextUnseen) {
        setLocal({
          nextUnseenComment: nextUnseen,
        });
      } else {
        if (hasMore && !isLoadingMore) {
          (async () => {
            await loadMoreAndEmit();
          })();
        }
        if (!hasMore) {
          // this means that we've looked through all comments, if we've
          // found no next comment and there are also no more comments to load
          setLookedThroughAllCommentsForNextUnseen(true);
        }
      }
    }
  }, [
    local.commentWithTraversalFocus,
    comments,
    isLoadingMore,
    hasMore,
    loadMoreAndEmit,
    lookForNextUnseen,
    lookedThroughAllCommentsForNextUnseen,
    setLocal,
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
        style={{ height: 600 }}
        data={comments}
        overscan={50}
        endReached={() => {
          if (hasMore && !isLoadingMore) {
            loadMoreAndEmit();
          }
        }}
        itemContent={(index, comment) => {
          return (
            <AllCommentsTabCommentContainer
              viewer={viewer}
              comment={comment.node}
              story={story}
              settings={settings}
              isLast={index === story.comments.edges.length - 1}
            />
          );
        }}
      />
    </>
  );
};

export default AllCommentsTabCommentVirtual;
