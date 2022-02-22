// import { Localized } from "@fluent/react/compat";
// import CLASSES from "coral-stream/classes";
import { AllCommentsTabContainer_settings } from "coral-stream/__generated__/AllCommentsTabContainer_settings.graphql";
import { AllCommentsTabContainer_story } from "coral-stream/__generated__/AllCommentsTabContainer_story.graphql";
import { AllCommentsTabContainer_viewer } from "coral-stream/__generated__/AllCommentsTabContainer_viewer.graphql";
// import { Button } from "coral-ui/components/v3";
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
        // components={{
        //   Footer: () => {
        //     return (
        //       <div
        //         style={{
        //           padding: "1rem",
        //           textAlign: "center",
        //         }}
        //       >
        //         {hasMore && (
        //           <Localized id="comments-loadMore">
        //             <Button
        //               key={`comments-loadMore-${story.comments.edges.length}`}
        //               id="comments-loadMore"
        //               onClick={loadMoreAndEmit}
        //               color="secondary"
        //               variant="outlined"
        //               fullWidth
        //               disabled={isLoadingMore}
        //               aria-controls="comments-allComments-log"
        //               className={CLASSES.allCommentsTabPane.loadMoreButton}
        //               // Added for keyboard shortcut support.
        //               data-key-stop
        //               data-is-load-more
        //             >
        //               Load More
        //             </Button>
        //           </Localized>
        //         )}
        //       </div>
        //     );
        //   },
        // }}
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
