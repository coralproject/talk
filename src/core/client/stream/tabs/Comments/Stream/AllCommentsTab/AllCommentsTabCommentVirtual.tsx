import React, { FunctionComponent } from "react";
import { Virtuoso } from "react-virtuoso";

import { AllCommentsTabContainer_settings } from "coral-stream/__generated__/AllCommentsTabContainer_settings.graphql";
import { AllCommentsTabContainer_story } from "coral-stream/__generated__/AllCommentsTabContainer_story.graphql";
import { AllCommentsTabContainer_viewer } from "coral-stream/__generated__/AllCommentsTabContainer_viewer.graphql";

import AllCommentsTabCommentContainer from "./AllCommentsTabCommentContainer";

interface Props {
  settings: AllCommentsTabContainer_settings;
  viewer: AllCommentsTabContainer_viewer | null;
  story: AllCommentsTabContainer_story;
  loadMoreAndEmit: () => {};
  hasMore: boolean;
  isLoadingMore: boolean;
}

const AllCommentsTabCommentVirtual: FunctionComponent<Props> = ({
  story,
  settings,
  viewer,
  loadMoreAndEmit,
  hasMore,
  isLoadingMore,
}) => {
  const comments = story.comments.edges;
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
        style={{ height: 600 }}
        data={comments}
        overscan={20}
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
