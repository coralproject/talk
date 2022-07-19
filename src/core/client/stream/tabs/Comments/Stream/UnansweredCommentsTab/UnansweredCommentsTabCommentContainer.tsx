import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import FadeInTransition from "coral-framework/components/FadeInTransition";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { UnansweredCommentsTabCommentContainer_comment } from "coral-stream/__generated__/UnansweredCommentsTabCommentContainer_comment.graphql";
import { UnansweredCommentsTabCommentContainer_settings } from "coral-stream/__generated__/UnansweredCommentsTabCommentContainer_settings.graphql";
import { UnansweredCommentsTabCommentContainer_story } from "coral-stream/__generated__/UnansweredCommentsTabCommentContainer_story.graphql";
import { UnansweredCommentsTabCommentContainer_viewer } from "coral-stream/__generated__/UnansweredCommentsTabCommentContainer_viewer.graphql";

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
  return (
    <IgnoredTombstoneOrHideContainer viewer={viewer} comment={comment}>
      <FadeInTransition active={!!comment.enteredLive}>
        <CollapsableComment>
          {({ collapsed, toggleCollapsed }) => (
            <HorizontalGutter
              className={cn({
                [styles.borderedComment]: !collapsed && !isLast,
              })}
            >
              <CommentContainer
                collapsed={collapsed}
                viewer={viewer}
                settings={settings}
                comment={comment}
                story={story}
                toggleCollapsed={toggleCollapsed}
              />
              <div
                className={cn({
                  [styles.hiddenReplies]: collapsed,
                })}
              >
                <ReplyListContainer
                  settings={settings}
                  viewer={viewer}
                  comment={comment}
                  story={story}
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

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment UnansweredCommentsTabCommentContainer_viewer on User {
      ...ReplyListContainer1_viewer
      ...CommentContainer_viewer
      ...IgnoredTombstoneOrHideContainer_viewer
    }
  `,
  story: graphql`
    fragment UnansweredCommentsTabCommentContainer_story on Story {
      ...ReplyListContainer1_story
      ...CommentContainer_story
    }
  `,
  settings: graphql`
    fragment UnansweredCommentsTabCommentContainer_settings on Settings {
      ...ReplyListContainer1_settings
      ...CommentContainer_settings
    }
  `,
  comment: graphql`
    fragment UnansweredCommentsTabCommentContainer_comment on Comment {
      enteredLive
      ...CommentContainer_comment
      ...ReplyListContainer1_comment
      ...IgnoredTombstoneOrHideContainer_comment
    }
  `,
})(UnansweredCommentsTabCommentContainer);

export default enhanced;
