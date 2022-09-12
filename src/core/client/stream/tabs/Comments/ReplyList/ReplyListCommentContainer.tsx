import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import FadeInTransition from "coral-framework/components/FadeInTransition";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { HorizontalGutter } from "coral-ui/components/v2";

import { ReplyListCommentContainer_comment } from "coral-stream/__generated__/ReplyListCommentContainer_comment.graphql";
import { ReplyListCommentContainer_settings } from "coral-stream/__generated__/ReplyListCommentContainer_settings.graphql";
import { ReplyListCommentContainer_story } from "coral-stream/__generated__/ReplyListCommentContainer_story.graphql";
import { ReplyListCommentContainer_viewer } from "coral-stream/__generated__/ReplyListCommentContainer_viewer.graphql";

import CollapsableComment from "../Comment/CollapsableComment";
import CommentContainer from "../Comment/CommentContainer";
import { isReplyFlattened } from "../Comment/flattenReplies";
import { useCommentSeenEnabled } from "../commentSeen";
import DeletedTombstoneContainer from "../DeletedTombstoneContainer";
import IgnoredTombstoneOrHideContainer from "../IgnoredTombstoneOrHideContainer";

import styles from "./ReplyListCommentContainer.css";

interface Props {
  viewer: ReplyListCommentContainer_viewer | null;
  comment: ReplyListCommentContainer_comment;
  settings: ReplyListCommentContainer_settings;
  story: ReplyListCommentContainer_story;
  allowIgnoredTombstoneReveal?: boolean;
  localReply?: boolean;
  indentLevel?: number;
  disableReplies?: boolean;
  showRemoveAnswered?: boolean;
  replyListElement?: React.ReactElement<any> | null;
  showConversationLink?: boolean;
}

const ReplyListCommentContainer: FunctionComponent<Props> = ({
  viewer,
  comment,
  settings,
  story,
  allowIgnoredTombstoneReveal,
  localReply,
  indentLevel,
  disableReplies,
  showRemoveAnswered,
  showConversationLink,
  replyListElement,
}) => {
  const commentSeenEnabled = useCommentSeenEnabled();
  return (
    <FadeInTransition active={Boolean(comment.enteredLive)}>
      <IgnoredTombstoneOrHideContainer
        viewer={viewer}
        comment={comment}
        allowTombstoneReveal={allowIgnoredTombstoneReveal}
      >
        <HorizontalGutter spacing={commentSeenEnabled ? 0 : undefined}>
          <CollapsableComment>
            {({ collapsed, toggleCollapsed }) => {
              const collapseEnabled = !isReplyFlattened(
                settings.flattenReplies,
                indentLevel
              );
              return (
                <>
                  <DeletedTombstoneContainer comment={comment}>
                    <CommentContainer
                      viewer={viewer}
                      comment={comment}
                      story={story}
                      collapsed={collapsed && collapseEnabled}
                      settings={settings}
                      indentLevel={indentLevel}
                      localReply={localReply}
                      disableReplies={disableReplies}
                      showConversationLink={!!showConversationLink}
                      toggleCollapsed={
                        collapseEnabled ? toggleCollapsed : undefined
                      }
                      showRemoveAnswered={showRemoveAnswered}
                    />
                  </DeletedTombstoneContainer>
                  <div
                    className={cn({
                      [styles.hiddenReplies]: collapsed && collapseEnabled,
                    })}
                  >
                    {replyListElement}
                  </div>
                </>
              );
            }}
          </CollapsableComment>
        </HorizontalGutter>
      </IgnoredTombstoneOrHideContainer>
    </FadeInTransition>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment ReplyListCommentContainer_viewer on User {
      ...CommentContainer_viewer
      ...IgnoredTombstoneOrHideContainer_viewer
    }
  `,
  story: graphql`
    fragment ReplyListCommentContainer_story on Story {
      ...CommentContainer_story
    }
  `,
  settings: graphql`
    fragment ReplyListCommentContainer_settings on Settings {
      ...CommentContainer_settings
      flattenReplies
      featureFlags
    }
  `,
  comment: graphql`
    fragment ReplyListCommentContainer_comment on Comment {
      enteredLive
      ...CommentContainer_comment
      ...IgnoredTombstoneOrHideContainer_comment
      ...DeletedTombstoneContainer_comment
    }
  `,
})(ReplyListCommentContainer);

export default enhanced;
