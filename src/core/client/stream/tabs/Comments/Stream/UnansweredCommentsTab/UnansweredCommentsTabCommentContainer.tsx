import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import FadeInTransition from "coral-framework/components/FadeInTransition";
import { HorizontalGutter } from "coral-ui/components/v2";

import { UnansweredCommentsTabCommentContainer_comment$key as UnansweredCommentsTabCommentContainer_comment } from "coral-stream/__generated__/UnansweredCommentsTabCommentContainer_comment.graphql";
import { UnansweredCommentsTabCommentContainer_settings$key as UnansweredCommentsTabCommentContainer_settings } from "coral-stream/__generated__/UnansweredCommentsTabCommentContainer_settings.graphql";
import { UnansweredCommentsTabCommentContainer_story$key as UnansweredCommentsTabCommentContainer_story } from "coral-stream/__generated__/UnansweredCommentsTabCommentContainer_story.graphql";
import { UnansweredCommentsTabCommentContainer_viewer$key as UnansweredCommentsTabCommentContainer_viewer } from "coral-stream/__generated__/UnansweredCommentsTabCommentContainer_viewer.graphql";

import CollapsableComment from "../../Comment/CollapsableComment";
import CommentContainer from "../../Comment/CommentContainer";
import IgnoredTombstoneOrHideContainer from "../../IgnoredTombstoneOrHideContainer";
import ReplyListContainer from "../../ReplyList/ReplyListContainer";

import styles from "./UnansweredCommentsTabCommentContainer.css";

interface Props {
  viewer: UnansweredCommentsTabCommentContainer_viewer | null;
  comment: UnansweredCommentsTabCommentContainer_comment;
  settings: UnansweredCommentsTabCommentContainer_settings;
  story: UnansweredCommentsTabCommentContainer_story;
  isLast: boolean;
}

const UnansweredCommentsTabCommentContainer: FunctionComponent<Props> = ({
  viewer,
  comment,
  settings,
  story,
  isLast,
}) => {
  const viewerData = useFragment(
    graphql`
      fragment UnansweredCommentsTabCommentContainer_viewer on User {
        ...ReplyListContainer1_viewer
        ...CommentContainer_viewer
        ...IgnoredTombstoneOrHideContainer_viewer
      }
    `,
    viewer
  );
  const storyData = useFragment(
    graphql`
      fragment UnansweredCommentsTabCommentContainer_story on Story {
        ...ReplyListContainer1_story
        ...CommentContainer_story
      }
    `,
    story
  );
  const settingsData = useFragment(
    graphql`
      fragment UnansweredCommentsTabCommentContainer_settings on Settings {
        ...ReplyListContainer1_settings
        ...CommentContainer_settings
      }
    `,
    settings
  );
  const commentData = useFragment(
    graphql`
      fragment UnansweredCommentsTabCommentContainer_comment on Comment {
        enteredLive
        ...CommentContainer_comment
        ...ReplyListContainer1_comment
        ...IgnoredTombstoneOrHideContainer_comment
      }
    `,
    comment
  );

  return (
    <IgnoredTombstoneOrHideContainer viewer={viewerData} comment={commentData}>
      <FadeInTransition active={!!commentData.enteredLive}>
        <CollapsableComment>
          {({ collapsed, toggleCollapsed }) => (
            <HorizontalGutter
              className={cn({
                [styles.borderedComment]: !collapsed && !isLast,
              })}
            >
              <CommentContainer
                collapsed={collapsed}
                viewer={viewerData}
                settings={settingsData}
                comment={commentData}
                story={storyData}
                toggleCollapsed={toggleCollapsed}
              />
              <div
                className={cn({
                  [styles.hiddenReplies]: collapsed,
                })}
              >
                <ReplyListContainer
                  settings={settingsData}
                  viewer={viewerData}
                  comment={commentData}
                  story={storyData}
                  showRemoveAnswered
                />
              </div>
            </HorizontalGutter>
          )}
        </CollapsableComment>
      </FadeInTransition>
    </IgnoredTombstoneOrHideContainer>
  );
};

export default UnansweredCommentsTabCommentContainer;
