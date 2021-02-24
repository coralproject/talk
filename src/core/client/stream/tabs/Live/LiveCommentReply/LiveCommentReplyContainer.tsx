import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";
import TimeStamp from "coral-stream/common/Timestamp";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { LiveCommentReplyContainer_comment } from "coral-stream/__generated__/LiveCommentReplyContainer_comment.graphql";
import { LiveCommentReplyContainer_settings } from "coral-stream/__generated__/LiveCommentReplyContainer_settings.graphql";
import { LiveCommentReplyContainer_story } from "coral-stream/__generated__/LiveCommentReplyContainer_story.graphql";
import { LiveCommentReplyContainer_viewer } from "coral-stream/__generated__/LiveCommentReplyContainer_viewer.graphql";

import LiveCommentRepliesQuery from "./LiveCommentRepliesQuery";
import LiveCreateCommentReplyFormContainer from "./LiveCreateCommentReplyFormContainer";

import styles from "./LiveCommentReplyContainer.css";

interface Props {
  settings: LiveCommentReplyContainer_settings;
  viewer: LiveCommentReplyContainer_viewer;
  story: LiveCommentReplyContainer_story;
  comment: LiveCommentReplyContainer_comment;

  visible?: boolean;
  showReplies?: boolean;
  onClose: () => void;
  onSubmitted: (commentID?: string) => void;
}

const LiveCommentReplyContainer: FunctionComponent<Props> = ({
  settings,
  viewer,
  story,
  comment,
  onClose,
  onSubmitted,
  visible,
  showReplies,
}) => {
  const close = useCallback(() => {
    onClose();
  }, [onClose]);

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
        <div className={styles.parent}>
          <Flex justifyContent="flex-start" alignItems="center">
            <div className={styles.replyTo}>Replying to:</div>
            <div className={styles.username}>
              {comment.author ? comment.author.username || "" : ""}
            </div>
          </Flex>
          <div>
            <TimeStamp>{comment.createdAt}</TimeStamp>
            <div dangerouslySetInnerHTML={{ __html: comment.body || "" }}></div>
          </div>
        </div>

        {showReplies && <LiveCommentRepliesQuery commentID={comment.id} />}

        <LiveCreateCommentReplyFormContainer
          settings={settings}
          viewer={viewer}
          story={story}
          parentID={comment.id}
          parentRevisionID={comment.revision.id}
          onSubmitted={onSubmitted}
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
