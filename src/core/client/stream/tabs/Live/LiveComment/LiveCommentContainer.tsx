import React, { FunctionComponent, useCallback, useRef } from "react";
import { graphql } from "react-relay";

import getHTMLPlainText from "coral-common/helpers/getHTMLPlainText";
import { useToggleState } from "coral-framework/hooks";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { ReactionButtonContainer } from "coral-stream/tabs/shared/ReactionButton";
import ReportFlowContainer, {
  ReportButton,
} from "coral-stream/tabs/shared/ReportFlow";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { LiveCommentContainer_comment } from "coral-stream/__generated__/LiveCommentContainer_comment.graphql";
import { LiveCommentContainer_settings } from "coral-stream/__generated__/LiveCommentContainer_settings.graphql";
import { LiveCommentContainer_viewer } from "coral-stream/__generated__/LiveCommentContainer_viewer.graphql";
import { LiveCommentReplyContainer_comment } from "coral-stream/__generated__/LiveCommentReplyContainer_comment.graphql";

import InView from "../InView";
import ShortcutIcon from "../ShortcutIcon";
import LiveCommentBody from "./LiveCommentBody";

import styles from "./LiveCommentContainer.css";

interface Props {
  viewer: LiveCommentContainer_viewer | null;
  comment: LiveCommentContainer_comment;
  cursor: string;
  settings: LiveCommentContainer_settings;
  onInView: (
    visible: boolean,
    id: string,
    createdAt: string,
    cursor: string
  ) => void;
  onReplyTo: (comment: LiveCommentReplyContainer_comment) => void;
  onShowConversation: (comment: LiveCommentReplyContainer_comment) => void;
}

const LiveCommentContainer: FunctionComponent<Props> = ({
  comment,
  cursor,
  viewer,
  settings,
  onInView,
  onReplyTo,
  onShowConversation,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const [showReportFlow, , toggleShowReportFlow] = useToggleState(false);

  const isViewerBanned = false;
  const isViewerSuspended = false;
  const isViewerWarned = false;

  const inView = useCallback(() => {
    onInView(true, comment.id, comment.createdAt, cursor);
  }, [comment.createdAt, comment.id, cursor, onInView]);

  const onReply = useCallback(() => {
    if (!comment || !comment.revision) {
      return;
    }

    onReplyTo(comment as any);
  }, [comment, onReplyTo]);

  const onConversationParent = useCallback(() => {
    if (!comment || !comment.parent) {
      return;
    }

    onShowConversation(comment.parent as any);
  }, [comment, onShowConversation]);

  const onConversation = useCallback(() => {
    if (!comment || !comment.revision) {
      return;
    }

    onShowConversation(comment as any);
  }, [comment, onShowConversation]);

  return (
    <div ref={rootRef} className={styles.root} id={`comment-${comment.id}-top`}>
      <div className={styles.comment}>
        <InView onInView={inView} />
        {comment.parent && (
          <div className={styles.parent}>
            <Flex justifyContent="flex-start" alignItems="center">
              <ShortcutIcon
                width="36px"
                height="20px"
                className={styles.parentArrow}
              />
              <Button
                variant="none"
                paddingSize="none"
                fontFamily="none"
                fontSize="none"
                fontWeight="none"
                textAlign="left"
                onClick={onConversationParent}
              >
                <Flex justifyContent="flex-start" alignItems="center">
                  <div className={styles.parentUser}>
                    {comment.parent.author?.username}
                  </div>
                  <div className={styles.parentBody}>
                    {getHTMLPlainText(comment.parent?.body || "")}
                  </div>
                </Flex>
              </Button>
            </Flex>
          </div>
        )}

        <LiveCommentBody
          author={comment.author}
          createdAt={comment.createdAt}
          body={comment.body}
        />

        <div id={`comment-${comment.id}`}>
          <Flex
            justifyContent="flex-start"
            alignItems="center"
            className={styles.actionBar}
          >
            <div className={styles.leftActions}>
              {viewer && (
                <ReactionButtonContainer
                  reactedClassName=""
                  comment={comment}
                  settings={settings}
                  viewer={viewer}
                  readOnly={
                    isViewerBanned || isViewerSuspended || isViewerWarned
                  }
                  isQA={false}
                />
              )}
              {viewer && (
                <Button
                  className={styles.replyButton}
                  variant="none"
                  onClick={comment.parent ? onConversationParent : onReply}
                >
                  <ShortcutIcon
                    width="16px"
                    height="16px"
                    className={styles.replyIcon}
                  />
                </Button>
              )}
              {comment.replyCount > 0 && (
                <Button
                  className={styles.conversationButton}
                  variant="none"
                  onClick={onConversation}
                  paddingSize="extraSmall"
                >
                  Conversation
                </Button>
              )}
            </div>

            <Flex className={styles.rightActions} justifyContent="flex-end">
              {viewer && (
                <ReportButton
                  onClick={toggleShowReportFlow}
                  open={showReportFlow}
                  viewer={viewer}
                  comment={comment}
                />
              )}
            </Flex>
          </Flex>
        </div>
        {showReportFlow && (
          <ReportFlowContainer
            viewer={viewer}
            comment={comment}
            settings={settings}
            onClose={toggleShowReportFlow}
          />
        )}
      </div>
      <div id={`comment-${comment.id}-bottom`}></div>
    </div>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment LiveCommentContainer_viewer on User {
      id
      ...ReportFlowContainer_viewer
      ...ReportButton_viewer
      ...ReactionButtonContainer_viewer
    }
  `,
  comment: graphql`
    fragment LiveCommentContainer_comment on Comment {
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
        id
        parent {
          id
        }
        revision {
          id
        }
        author {
          id
          username
        }
        createdAt
        body
      }
      replyCount

      ...ReportButton_comment
      ...ReportFlowContainer_comment
      ...ReactionButtonContainer_comment
      ...LiveCommentReplyContainer_comment
    }
  `,
  settings: graphql`
    fragment LiveCommentContainer_settings on Settings {
      ...ReportFlowContainer_settings
      ...ReactionButtonContainer_settings
    }
  `,
})(LiveCommentContainer);

export default enhanced;
