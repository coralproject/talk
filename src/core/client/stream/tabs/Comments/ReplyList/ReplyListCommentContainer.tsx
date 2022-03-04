import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql, useFragment } from "react-relay";

import FadeInTransition from "coral-framework/components/FadeInTransition";
import { HorizontalGutter } from "coral-ui/components/v2";

import { ReplyListCommentContainer_comment$key as ReplyListCommentContainer_comment } from "coral-stream/__generated__/ReplyListCommentContainer_comment.graphql";
import { ReplyListCommentContainer_settings$key as ReplyListCommentContainer_settings } from "coral-stream/__generated__/ReplyListCommentContainer_settings.graphql";
import { ReplyListCommentContainer_story$key as ReplyListCommentContainer_story } from "coral-stream/__generated__/ReplyListCommentContainer_story.graphql";
import { ReplyListCommentContainer_viewer$key as ReplyListCommentContainer_viewer } from "coral-stream/__generated__/ReplyListCommentContainer_viewer.graphql";

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
  disableHideIgnoredTombstone?: boolean;
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
  disableHideIgnoredTombstone,
  localReply,
  indentLevel,
  disableReplies,
  showRemoveAnswered,
  showConversationLink,
  replyListElement,
}) => {
  const viewerData = useFragment(
    graphql`
      fragment ReplyListCommentContainer_viewer on User {
        ...CommentContainer_viewer
        ...IgnoredTombstoneOrHideContainer_viewer
      }
    `,
    viewer
  );
  const storyData = useFragment(
    graphql`
      fragment ReplyListCommentContainer_story on Story {
        ...CommentContainer_story
      }
    `,
    story
  );
  const settingsData = useFragment(
    graphql`
      fragment ReplyListCommentContainer_settings on Settings {
        ...CommentContainer_settings
        flattenReplies
        featureFlags
      }
    `,
    settings
  );
  const commentData = useFragment(
    graphql`
      fragment ReplyListCommentContainer_comment on Comment {
        enteredLive
        ...CommentContainer_comment
        ...IgnoredTombstoneOrHideContainer_comment
        ...DeletedTombstoneContainer_comment
      }
    `,
    comment
  );

  const commentSeenEnabled = useCommentSeenEnabled();
  return (
    <FadeInTransition active={Boolean(commentData.enteredLive)}>
      <IgnoredTombstoneOrHideContainer
        viewer={viewerData}
        comment={commentData}
        allowTombstoneReveal={allowIgnoredTombstoneReveal}
        disableHide={disableHideIgnoredTombstone}
      >
        <HorizontalGutter spacing={commentSeenEnabled ? 0 : undefined}>
          <CollapsableComment>
            {({ collapsed, toggleCollapsed }) => {
              const collapseEnabled = !isReplyFlattened(
                settingsData.flattenReplies,
                indentLevel
              );
              return (
                <>
                  <DeletedTombstoneContainer comment={commentData}>
                    <CommentContainer
                      viewer={viewerData}
                      comment={commentData}
                      story={storyData}
                      collapsed={collapsed && collapseEnabled}
                      settings={settingsData}
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

export default ReplyListCommentContainer;
