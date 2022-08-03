import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import FadeInTransition from "coral-framework/components/FadeInTransition";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { AllCommentsTabCommentContainer_comment } from "coral-stream/__generated__/AllCommentsTabCommentContainer_comment.graphql";
import { AllCommentsTabCommentContainer_settings } from "coral-stream/__generated__/AllCommentsTabCommentContainer_settings.graphql";
import { AllCommentsTabCommentContainer_story } from "coral-stream/__generated__/AllCommentsTabCommentContainer_story.graphql";
import { AllCommentsTabCommentContainer_viewer } from "coral-stream/__generated__/AllCommentsTabCommentContainer_viewer.graphql";

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
  const commentSeenEnabled = useCommentSeenEnabled();
  const canCommitCommentSeen = !!(viewer && viewer.id) && commentSeenEnabled;
  const commentSeen = canCommitCommentSeen && comment.seen;
  return (
    <IgnoredTombstoneOrHideContainer viewer={viewer} comment={comment}>
      <FadeInTransition active={!!comment.enteredLive}>
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
              <DeletedTombstoneContainer comment={comment}>
                <CommentContainer
                  collapsed={collapsed}
                  viewer={viewer}
                  settings={settings}
                  comment={comment}
                  story={story}
                  toggleCollapsed={toggleCollapsed}
                />
              </DeletedTombstoneContainer>
              {!collapsed && (
                <div>
                  <ReplyListContainer
                    settings={settings}
                    viewer={viewer}
                    comment={comment}
                    story={story}
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

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment AllCommentsTabCommentContainer_viewer on User {
      id
      ...ReplyListContainer1_viewer
      ...CommentContainer_viewer
      ...IgnoredTombstoneOrHideContainer_viewer
    }
  `,
  story: graphql`
    fragment AllCommentsTabCommentContainer_story on Story {
      ...ReplyListContainer1_story
      ...CommentContainer_story
    }
  `,
  settings: graphql`
    fragment AllCommentsTabCommentContainer_settings on Settings {
      ...ReplyListContainer1_settings
      ...CommentContainer_settings
    }
  `,
  comment: graphql`
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
})(AllCommentsTabCommentContainer);

export default enhanced;
