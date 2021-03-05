import React, { FunctionComponent, useCallback, useState } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { LiveCommentConversationContainer_comment } from "coral-stream/__generated__/LiveCommentConversationContainer_comment.graphql";
import { LiveCommentConversationContainer_settings } from "coral-stream/__generated__/LiveCommentConversationContainer_settings.graphql";
import { LiveCommentConversationContainer_story } from "coral-stream/__generated__/LiveCommentConversationContainer_story.graphql";
import { LiveCommentConversationContainer_viewer } from "coral-stream/__generated__/LiveCommentConversationContainer_viewer.graphql";

import ShortcutIcon from "../ShortcutIcon";
import LiveCommentRepliesQuery from "./LiveCommentReplies/LiveCommentRepliesQuery";
import LiveCreateCommentReplyFormContainer from "./LiveCreateCommentReplyFormContainer";

import styles from "./LiveCommentConversationContainer.css";

interface Props {
  settings: LiveCommentConversationContainer_settings;
  viewer: LiveCommentConversationContainer_viewer | null;
  story: LiveCommentConversationContainer_story;
  comment: LiveCommentConversationContainer_comment;

  visible?: boolean;
  onClose: () => void;
  onSubmitted?: (commentID: string | undefined, cursor: string) => void;
}

const LiveCommentConversationContainer: FunctionComponent<Props> = ({
  settings,
  viewer,
  story,
  comment,
  onClose,
  onSubmitted,
  visible,
}) => {
  const close = useCallback(() => {
    onClose();
  }, [onClose]);

  const [cursor] = useState(new Date(0).toISOString());

  const submit = useCallback(
    (commentID: string | undefined, cur: string) => {
      if (onSubmitted) {
        onSubmitted(commentID, cur);
      }
    },
    [onSubmitted]
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

        <LiveCommentRepliesQuery
          commentID={comment.id}
          storyID={story.id}
          cursor={cursor}
        />

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
    fragment LiveCommentConversationContainer_story on Story {
      id
      url
      ...LiveCreateCommentReplyFormContainer_story
    }
  `,
  viewer: graphql`
    fragment LiveCommentConversationContainer_viewer on User {
      ...LiveCommentContainer_viewer
      ...LiveCreateCommentReplyFormContainer_viewer
    }
  `,
  settings: graphql`
    fragment LiveCommentConversationContainer_settings on Settings {
      ...LiveCommentContainer_settings
      ...LiveCreateCommentReplyFormContainer_settings
    }
  `,
  comment: graphql`
    fragment LiveCommentConversationContainer_comment on Comment {
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
})(LiveCommentConversationContainer);

export default enhanced;
