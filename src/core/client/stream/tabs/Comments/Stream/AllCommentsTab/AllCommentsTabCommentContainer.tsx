import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import FadeInTransition from "coral-framework/components/FadeInTransition";
import { HorizontalGutter } from "coral-ui/components/v2";

import { AllCommentsTabCommentContainer_comment$key as AllCommentsTabCommentContainer_comment } from "coral-stream/__generated__/AllCommentsTabCommentContainer_comment.graphql";
import { AllCommentsTabCommentContainer_settings$key as AllCommentsTabCommentContainer_settings } from "coral-stream/__generated__/AllCommentsTabCommentContainer_settings.graphql";
import { AllCommentsTabCommentContainer_story$key as AllCommentsTabCommentContainer_story } from "coral-stream/__generated__/AllCommentsTabCommentContainer_story.graphql";
import { AllCommentsTabCommentContainer_viewer$key as AllCommentsTabCommentContainer_viewer } from "coral-stream/__generated__/AllCommentsTabCommentContainer_viewer.graphql";

import CollapsableComment from "../../Comment/CollapsableComment";
import CommentContainer from "../../Comment/CommentContainer";
import { useCommentSeenEnabled } from "../../commentSeen";
import DeletedTombstoneContainer from "../../DeletedTombstoneContainer";
import IgnoredTombstoneOrHideContainer from "../../IgnoredTombstoneOrHideContainer";
import ReplyListContainer from "../../ReplyList/ReplyListContainer";

import styles from "./AllCommentsTabCommentContainer.css";

interface Props {
  viewer: AllCommentsTabCommentContainer_viewer | null;
  comment: AllCommentsTabCommentContainer_comment;
  settings: AllCommentsTabCommentContainer_settings;
  story: AllCommentsTabCommentContainer_story;
  isLast: boolean;
}

const AllCommentsTabCommentContainer: FunctionComponent<Props> = ({
  viewer,
  comment,
  settings,
  story,
  isLast,
}) => {
  const viewerData = useFragment(
    graphql`
      fragment AllCommentsTabCommentContainer_viewer on User {
        id
        ...ReplyListContainer1_viewer
        ...CommentContainer_viewer
        ...IgnoredTombstoneOrHideContainer_viewer
      }
    `,
    viewer
  );
  const storyData = useFragment(
    graphql`
      fragment AllCommentsTabCommentContainer_story on Story {
        ...ReplyListContainer1_story
        ...CommentContainer_story
      }
    `,
    story
  );
  const settingsData = useFragment(
    graphql`
      fragment AllCommentsTabCommentContainer_settings on Settings {
        ...ReplyListContainer1_settings
        ...CommentContainer_settings
      }
    `,
    settings
  );
  const commentData = useFragment(
    graphql`
      fragment AllCommentsTabCommentContainer_comment on Comment {
        id
        enteredLive
        seen
        ...CommentContainer_comment
        ...ReplyListContainer1_comment
        ...IgnoredTombstoneOrHideContainer_comment
        ...DeletedTombstoneContainer_comment
      }
    `,
    comment
  );

  const commentSeenEnabled = useCommentSeenEnabled();
  const canCommitCommentSeen =
    !!(viewerData && viewerData.id) && commentSeenEnabled;
  const commentSeen = canCommitCommentSeen && commentData.seen;
  return (
    <IgnoredTombstoneOrHideContainer viewer={viewerData} comment={commentData}>
      <FadeInTransition active={!!commentData.enteredLive}>
        <CollapsableComment>
          {({ collapsed, toggleCollapsed }) => (
            <HorizontalGutter
              className={cn({
                [styles.borderedCommentSeen]:
                  commentSeen && !collapsed && !isLast,
                [styles.borderedCommentNotSeen]:
                  !commentSeen && !collapsed && !isLast,
              })}
              spacing={commentSeenEnabled ? 0 : undefined}
            >
              <DeletedTombstoneContainer comment={commentData}>
                <CommentContainer
                  collapsed={collapsed}
                  viewer={viewerData}
                  settings={settingsData}
                  comment={commentData}
                  story={storyData}
                  toggleCollapsed={toggleCollapsed}
                />
              </DeletedTombstoneContainer>
              {!collapsed && (
                <div>
                  <ReplyListContainer
                    settings={settingsData}
                    viewer={viewerData}
                    comment={commentData}
                    story={storyData}
                  />
                </div>
              )}
            </HorizontalGutter>
          )}
        </CollapsableComment>
      </FadeInTransition>
    </IgnoredTombstoneOrHideContainer>
  );
};

export default AllCommentsTabCommentContainer;
