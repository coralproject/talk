import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import FadeInTransition from "coral-framework/components/FadeInTransition";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { GQLFEATURE_FLAG } from "coral-framework/schema/";
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
  const commentSeenEnabled = useCommentSeenEnabled();
  const flattenRepliesEnabled = settings.featureFlags?.includes(
    GQLFEATURE_FLAG.FLATTEN_REPLIES
  );
  return (
    <FadeInTransition active={Boolean(comment.enteredLive)}>
      <IgnoredTombstoneOrHideContainer
        viewer={viewer}
        comment={comment}
        allowTombstoneReveal={allowIgnoredTombstoneReveal}
        disableHide={disableHideIgnoredTombstone}
      >
        <HorizontalGutter spacing={commentSeenEnabled ? 0 : undefined}>
          {isReplyFlattened(flattenRepliesEnabled, indentLevel) ? (
            <>
              <DeletedTombstoneContainer comment={comment}>
                <CommentContainer
                  viewer={viewer}
                  comment={comment}
                  story={story}
                  collapsed={false}
                  settings={settings}
                  indentLevel={indentLevel}
                  localReply={localReply}
                  disableReplies={disableReplies}
                  showConversationLink={!!showConversationLink}
                  showRemoveAnswered={showRemoveAnswered}
                />
              </DeletedTombstoneContainer>
              {replyListElement}
            </>
          ) : (
            <CollapsableComment>
              {({ collapsed, toggleCollapsed }) => (
                <>
                  <DeletedTombstoneContainer comment={comment}>
                    <CommentContainer
                      viewer={viewer}
                      comment={comment}
                      story={story}
                      collapsed={collapsed}
                      settings={settings}
                      indentLevel={indentLevel}
                      localReply={localReply}
                      disableReplies={disableReplies}
                      showConversationLink={!!showConversationLink}
                      toggleCollapsed={toggleCollapsed}
                      showRemoveAnswered={showRemoveAnswered}
                    />
                  </DeletedTombstoneContainer>
                  <div
                    className={cn({
                      [styles.hiddenReplies]: collapsed,
                    })}
                  >
                    {replyListElement}
                  </div>
                </>
              )}
            </CollapsableComment>
          )}
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
