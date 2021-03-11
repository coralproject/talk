import React, { FunctionComponent, useCallback, useRef } from "react";
import { graphql } from "react-relay";

import getHTMLPlainText from "coral-common/helpers/getHTMLPlainText";
import { useToggleState } from "coral-framework/hooks";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { ReportFlowContainer } from "coral-stream/tabs/shared/ReportFlow";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { LiveCommentContainer_comment } from "coral-stream/__generated__/LiveCommentContainer_comment.graphql";
import { LiveCommentContainer_settings } from "coral-stream/__generated__/LiveCommentContainer_settings.graphql";
import { LiveCommentContainer_story } from "coral-stream/__generated__/LiveCommentContainer_story.graphql";
import { LiveCommentContainer_viewer } from "coral-stream/__generated__/LiveCommentContainer_viewer.graphql";
import { LiveCommentConversationContainer_comment } from "coral-stream/__generated__/LiveCommentConversationContainer_comment.graphql";

import InView from "../InView";
import ShortcutIcon from "../ShortcutIcon";
import LiveCommentActionsContainer from "./LiveCommentActionsContainer";
import LiveCommentBodyContainer from "./LiveCommentBodyContainer";

import styles from "./LiveCommentContainer.css";

interface Props {
  story: LiveCommentContainer_story;
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
  onReplyTo: (comment: LiveCommentConversationContainer_comment) => void;
  onShowConversation: (
    comment: LiveCommentConversationContainer_comment
  ) => void;
}

const LiveCommentContainer: FunctionComponent<Props> = ({
  story,
  comment,
  cursor,
  viewer,
  settings,
  onInView,
  onShowConversation,
}) => {
  const rootRef = useRef<HTMLDivElement>(null);

  const [showReportFlow, , toggleShowReportFlow] = useToggleState(false);

  const ignored = Boolean(
    comment.author &&
      viewer &&
      viewer.ignoredUsers.some((u) => Boolean(u.id === comment.author!.id))
  );

  const inView = useCallback(() => {
    onInView(true, comment.id, comment.createdAt, cursor);
  }, [comment.createdAt, comment.id, cursor, onInView]);

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

  if (ignored) {
    return null;
  }

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
                <Flex
                  justifyContent="flex-start"
                  alignItems="center"
                  className={styles.parentButton}
                >
                  <div className={styles.parentUser}>
                    {comment.parent.author?.username}:
                  </div>
                  <div className={styles.parentBody}>
                    {getHTMLPlainText(comment.parent?.body || "")}
                  </div>
                </Flex>
              </Button>
            </Flex>
          </div>
        )}

        <LiveCommentBodyContainer
          comment={comment}
          settings={settings}
          viewer={viewer}
          story={story}
        />

        <div id={`comment-${comment.id}`}>
          <LiveCommentActionsContainer
            story={story}
            comment={comment}
            viewer={viewer}
            settings={settings}
            onReply={comment.parent ? onConversationParent : onConversation}
            onConversation={
              comment.parent ? onConversationParent : onConversation
            }
            onToggleReport={toggleShowReportFlow}
          />
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
  story: graphql`
    fragment LiveCommentContainer_story on Story {
      ...LiveCommentActionsContainer_story
      ...LiveCommentBodyContainer_story
    }
  `,
  viewer: graphql`
    fragment LiveCommentContainer_viewer on User {
      id
      ignoredUsers {
        id
      }
      ...ReportFlowContainer_viewer
      ...LiveCommentActionsContainer_viewer
      ...LiveCommentBodyContainer_viewer
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

      ...ReportFlowContainer_comment
      ...LiveCommentActionsContainer_comment
      ...LiveCommentConversationContainer_comment
      ...LiveCommentBodyContainer_comment
    }
  `,
  settings: graphql`
    fragment LiveCommentContainer_settings on Settings {
      ...ReportFlowContainer_settings
      ...LiveCommentActionsContainer_settings
      ...LiveCommentBodyContainer_settings
    }
  `,
})(LiveCommentContainer);

export default enhanced;
