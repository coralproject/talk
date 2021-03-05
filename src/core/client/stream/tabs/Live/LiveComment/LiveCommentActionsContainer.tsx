import React, { FunctionComponent } from "react";
import { graphql } from "relay-runtime";

import { withFragmentContainer } from "coral-framework/lib/relay";
import { ReactionButtonContainer } from "coral-stream/tabs/shared/ReactionButton";
import { ReportButton } from "coral-stream/tabs/shared/ReportFlow";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { LiveCommentActionsContainer_comment } from "coral-stream/__generated__/LiveCommentActionsContainer_comment.graphql";
import { LiveCommentActionsContainer_settings } from "coral-stream/__generated__/LiveCommentActionsContainer_settings.graphql";
import { LiveCommentActionsContainer_viewer } from "coral-stream/__generated__/LiveCommentActionsContainer_viewer.graphql";

import ShortcutIcon from "../ShortcutIcon";

import styles from "./LiveCommentActionsContainer.css";

interface Props {
  comment: LiveCommentActionsContainer_comment;
  viewer: LiveCommentActionsContainer_viewer | null;
  settings: LiveCommentActionsContainer_settings;

  onConversation?: () => void;
  onReply?: () => void;
  showReport?: boolean;
  onToggleReport?: () => void;
}

const LiveCommentActionsContainer: FunctionComponent<Props> = ({
  comment,
  viewer,
  settings,
  onConversation,
  onReply,
  showReport,
  onToggleReport,
}) => {
  const isViewerBanned = false;
  const isViewerSuspended = false;
  const isViewerWarned = false;

  return (
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
            readOnly={isViewerBanned || isViewerSuspended || isViewerWarned}
            isQA={false}
          />
        )}
        {viewer && ((comment.parent && onConversation) || onReply) && (
          <Button
            className={styles.replyButton}
            variant="none"
            onClick={comment.parent ? onConversation : onReply}
          >
            <ShortcutIcon
              width="16px"
              height="16px"
              className={styles.replyIcon}
            />
          </Button>
        )}
        {comment.replyCount > 0 && onConversation && (
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
        {viewer && onToggleReport && (
          <ReportButton
            onClick={onToggleReport}
            open={showReport}
            viewer={viewer}
            comment={comment}
          />
        )}
      </Flex>
    </Flex>
  );
};

const enhanced = withFragmentContainer<Props>({
  viewer: graphql`
    fragment LiveCommentActionsContainer_viewer on User {
      ...ReportFlowContainer_viewer
      ...ReportButton_viewer
      ...ReactionButtonContainer_viewer
    }
  `,
  comment: graphql`
    fragment LiveCommentActionsContainer_comment on Comment {
      parent {
        id
      }
      replyCount
      ...ReportButton_comment
      ...ReportFlowContainer_comment
      ...ReactionButtonContainer_comment
      ...LiveCommentConversationContainer_comment
    }
  `,
  settings: graphql`
    fragment LiveCommentActionsContainer_settings on Settings {
      ...ReportFlowContainer_settings
      ...ReactionButtonContainer_settings
    }
  `,
})(LiveCommentActionsContainer);

export default enhanced;
