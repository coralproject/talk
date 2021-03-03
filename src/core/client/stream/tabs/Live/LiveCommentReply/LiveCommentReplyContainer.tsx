import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { LiveCommentReplyContainer_comment } from "coral-stream/__generated__/LiveCommentReplyContainer_comment.graphql";
import { LiveCommentReplyContainer_settings } from "coral-stream/__generated__/LiveCommentReplyContainer_settings.graphql";
import { LiveCommentReplyContainer_story } from "coral-stream/__generated__/LiveCommentReplyContainer_story.graphql";
import { LiveCommentReplyContainer_viewer } from "coral-stream/__generated__/LiveCommentReplyContainer_viewer.graphql";

import ShortcutIcon from "../ShortcutIcon";
import LiveCommentRepliesQuery from "./LiveCommentReplies/LiveCommentRepliesQuery";
import LiveCreateCommentReplyFormContainer from "./LiveCreateCommentReplyFormContainer";

import styles from "./LiveCommentReplyContainer.css";

interface Props {
  settings: LiveCommentReplyContainer_settings;
  viewer: LiveCommentReplyContainer_viewer | null;
  story: LiveCommentReplyContainer_story;
  comment: LiveCommentReplyContainer_comment;

  visible?: boolean;
  showConversation?: boolean;
  onClose: () => void;
  onSubmitted: (commentID: string | undefined, cursor: string) => void;
}

const LiveCommentReplyContainer: FunctionComponent<Props> = ({
  settings,
  viewer,
  story,
  comment,
  onClose,
  onSubmitted,
  visible,
  showConversation,
}) => {
  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  const [cursor] = useState(new Date(0).toISOString());

  const submit = useCallback(
    (commentID: string | undefined, cur: string) => {
      if (!showConversation) {
        onSubmitted(commentID, cur);
      } else {
        // TODO: set cursor and cause refresh
      }
    },
    [onSubmitted, showConversation]
  );

  if (!visible) {
    return null;
  }

  if (!comment.revision) {
    return null;
  }

  return (
    <>
      <div className={styles.overlay}></div>
      <div className={styles.root}>
        <Button className={styles.closeButton} onClick={close} color="none">
          <Icon className={styles.closeIcon}>cancel</Icon>
        </Button>

        {!showConversation ? (
          <div className={styles.title}>
            <Flex justifyContent="flex-start" alignItems="center">
              <ShortcutIcon
                width="14px"
                height="14px"
                className={styles.replyingToIcon}
              />
              <div className={styles.replyingTo}>Replying to</div>
              <div className={styles.username}>
                {comment.author ? comment.author.username || "" : ""}
              </div>
            </Flex>
          </div>
        ) : (
          <div className={styles.title}>
            <Flex justifyContent="flex-start" alignItems="center">
              <Icon className={styles.chatIcon}>chat</Icon>
              <div className={styles.conversationTitle}>Conversation</div>
            </Flex>
          </div>
        )}

        {showConversation && (
          <LiveCommentRepliesQuery
            commentID={comment.id}
            storyID={story.id}
            cursor={cursor}
          />
        )}

        <LiveCreateCommentReplyFormContainer
          settings={settings}
          viewer={viewer}
          story={story}
          parentID={comment.id}
          parentRevisionID={comment.revision.id}
          onSubmitted={submit}
        />
      </div>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment LiveCommentReplyContainer_story on Story {
      id
      url
      ...LiveCreateCommentReplyFormContainer_story
    }
  `,
  viewer: graphql`
    fragment LiveCommentReplyContainer_viewer on User {
      ...LiveCommentContainer_viewer
      ...LiveCreateCommentReplyFormContainer_viewer
    }
  `,
  settings: graphql`
    fragment LiveCommentReplyContainer_settings on Settings {
      ...LiveCommentContainer_settings
      ...LiveCreateCommentReplyFormContainer_settings
    }
  `,
  comment: graphql`
    fragment LiveCommentReplyContainer_comment on Comment {
      id
      revision {
        id
      }
      author {
        id
        username
      }
      body
      createdAt
      parent {
        author {
          id
          username
        }
        createdAt
        body
      }
    }
  `,
})(LiveCommentReplyContainer);

export default enhanced;
