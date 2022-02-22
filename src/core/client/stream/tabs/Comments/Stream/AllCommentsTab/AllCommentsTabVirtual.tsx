import { AllCommentsTabContainer_settings } from "coral-stream/__generated__/AllCommentsTabContainer_settings.graphql";
import { AllCommentsTabContainer_story } from "coral-stream/__generated__/AllCommentsTabContainer_story.graphql";
import { AllCommentsTabContainer_viewer } from "coral-stream/__generated__/AllCommentsTabContainer_viewer.graphql";
import React, { FunctionComponent } from "react";
import { Virtuoso } from "react-virtuoso";
import CommentsLinks from "../CommentsLinks";
import AllCommentsTabCommentContainer from "./AllCommentsTabCommentContainer";

interface Props {
  settings: AllCommentsTabContainer_settings;
  viewer: AllCommentsTabContainer_viewer | null;
  story: AllCommentsTabContainer_story;
  loadMoreAndEmit: any;
  hasMore: boolean;
  isLoadingMore: boolean;
  alternateOldestViewEnabled: boolean;
  showGoToDiscussions: any;
}

const AllCommentsTabCommentVirtual: FunctionComponent<Props> = ({
  story,
  settings,
  viewer,
  loadMoreAndEmit,
  hasMore,
  isLoadingMore,
  alternateOldestViewEnabled,
  showGoToDiscussions,
}) => {
  const comments = story.comments.edges;
  return (
    <>
      <Virtuoso
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
      {!alternateOldestViewEnabled && (
        // TODO: Would need to update Top of comments link to scroll to top of comments
        <CommentsLinks
          showGoToDiscussions={showGoToDiscussions}
          showGoToProfile={!!viewer}
        />
      )}
    </>
  );
};

export default AllCommentsTabCommentVirtual;
