import { clearLongTimeout, LongTimeout, setLongTimeout } from "long-settimeout";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Responsive from "react-responsive";
import { graphql } from "relay-runtime";

import { isBeforeDate } from "coral-common/utils";
import { getModerationLink } from "coral-framework/helpers";
import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";
import { GQLUSER_STATUS } from "coral-framework/schema";
import { Ability, can } from "coral-stream/permissions";
import { ReactionButtonContainer } from "coral-stream/tabs/shared/ReactionButton";
import { ReportButton } from "coral-stream/tabs/shared/ReportFlow";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { LiveCommentActionsContainer_comment } from "coral-stream/__generated__/LiveCommentActionsContainer_comment.graphql";
import { LiveCommentActionsContainer_local } from "coral-stream/__generated__/LiveCommentActionsContainer_local.graphql";
import { LiveCommentActionsContainer_settings } from "coral-stream/__generated__/LiveCommentActionsContainer_settings.graphql";
import { LiveCommentActionsContainer_story } from "coral-stream/__generated__/LiveCommentActionsContainer_story.graphql";
import { LiveCommentActionsContainer_viewer } from "coral-stream/__generated__/LiveCommentActionsContainer_viewer.graphql";

import ShortcutIcon from "../ShortcutIcon";

import styles from "./LiveCommentActionsContainer.css";

interface Props {
  story: LiveCommentActionsContainer_story;
  comment: LiveCommentActionsContainer_comment;
  viewer: LiveCommentActionsContainer_viewer | null;
  settings: LiveCommentActionsContainer_settings;

  onConversation?: (comment: LiveCommentActionsContainer_comment) => void;
  onReply?: (comment: LiveCommentActionsContainer_comment) => void;
  showReport?: boolean;
  onToggleReport?: () => void;

  onEdit?: () => void;
}

const LiveCommentActionsContainer: FunctionComponent<Props> = ({
  story,
  comment,
  viewer,
  settings,
  onConversation,
  onReply,
  showReport,
  onToggleReport,
  onEdit,
}) => {
  const isViewerBanned = !!viewer?.status.current.includes(
    GQLUSER_STATUS.BANNED
  );
  const isViewerSuspended = !!viewer?.status.current.includes(
    GQLUSER_STATUS.SUSPENDED
  );
  const isViewerWarned = !!viewer?.status.current.includes(
    GQLUSER_STATUS.WARNED
  );

  const isViewerComment =
    // Can't edit a comment if you aren't logged in!
    !!viewer &&
    // Can't edit a comment if there isn't an author on it!
    !!comment.author &&
    // Can't edit a comment if the comment isn't the viewers!
    viewer.id === comment.author.id;

  const [{ accessToken }] = useLocal<LiveCommentActionsContainer_local>(graphql`
    fragment LiveCommentActionsContainer_local on Local {
      accessToken
    }
  `);

  const showModerationCaret: boolean =
    !!viewer && story.canModerate && can(viewer, Ability.MODERATE);

  const moderationLinkSuffix =
    !!accessToken &&
    settings.auth.integrations.sso.enabled &&
    settings.auth.integrations.sso.targetFilter.admin &&
    `#accessToken=${accessToken}`;

  const gotoModerateCommentHref = useMemo(() => {
    let link = getModerationLink({ commentID: comment.id });
    if (moderationLinkSuffix) {
      link += moderationLinkSuffix;
    }

    return link;
  }, [comment.id, moderationLinkSuffix]);

  // The editable initial value is the result of the the funtion here.
  const [editable, setEditable] = useState(() => {
    // Can't edit a comment that the viewer didn't write! If the user is banned
    // or suspended too they can't edit.
    if (
      !isViewerComment ||
      isViewerBanned ||
      isViewerSuspended ||
      isViewerWarned
    ) {
      return false;
    }

    // Can't edit a comment if the editable date is before the current date!
    if (
      !comment.editing.editableUntil ||
      !isBeforeDate(comment.editing.editableUntil)
    ) {
      return false;
    }

    // Comment is editable!
    return true;
  });

  useEffect(() => {
    // If the comment is not editable now, it can't be editable in the future,
    // so exit!
    if (!editable) {
      return;
    }

    // The comment is editable, we should register a callback to remove that
    // status when it is no longer editable. We know that the `editableUntil` is
    // available because it was editable!
    const editableFor =
      new Date(comment.editing.editableUntil!).getTime() - Date.now();
    if (editableFor <= 0) {
      // Can't schedule a timer for the past! The comment is no longer editable.
      setEditable(false);
      return;
    }

    // Setup the timeout.
    const timeout: LongTimeout | null = setLongTimeout(() => {
      // Mark the comment as not editable.
      setEditable(false);
    }, editableFor);

    return () => {
      // When this component is disposed, also clear the timeout.
      clearLongTimeout(timeout);
    };
  }, [comment.editing.editableUntil, editable]);

  const handleOnConversation = useCallback(() => {
    if (!onConversation) {
      return;
    }

    onConversation(comment);
  }, [comment, onConversation]);

  const handleOnReply = useCallback(() => {
    if (!onReply) {
      return;
    }

    onReply(comment);
  }, [comment, onReply]);

  const handleOnEdit = useCallback(() => {
    if (!onEdit) {
      return;
    }

    onEdit();
  }, [onEdit]);

  const leftActions = useMemo(() => {
    return (
      <>
        {viewer && (
          <ReactionButtonContainer
            reactedClassName=""
            comment={comment}
            settings={settings}
            viewer={viewer}
            readOnly={isViewerBanned || isViewerSuspended || isViewerWarned}
            isQA={false}
            isChat
            className={styles.action}
          />
        )}
        {onReply && (
          <Button
            className={styles.replyButton}
            variant="none"
            onClick={handleOnReply}
          >
            <Flex justifyContent="flex-start" alignItems="center">
              <ShortcutIcon
                width="16px"
                height="16px"
                className={styles.replyIcon}
                ariaLabel="Reply"
              />
              <Responsive minWidth={400}>
                <span className={styles.action}>Reply</span>
              </Responsive>
            </Flex>
          </Button>
        )}
        {comment.replyCount > 0 && onConversation && (
          <Button
            className={styles.conversationButton}
            variant="none"
            onClick={handleOnConversation}
            paddingSize="extraSmall"
          >
            <Flex justifyContent="flex-start" alignItems="center">
              <Icon
                className={styles.conversationIcon}
                aria-label="Read conversation"
              >
                forum
              </Icon>
              <Responsive minWidth={400}>
                <span className={styles.action}>Read Conversation</span>
              </Responsive>
            </Flex>
          </Button>
        )}
        {editable && onEdit && (
          <Button
            className={styles.editButton}
            variant="none"
            onClick={handleOnEdit}
            paddingSize="extraSmall"
          >
            <Flex justifyContent="flex-start" alignItems="center">
              <Icon className={styles.editIcon} aria-label="Edit comment">
                create
              </Icon>
              <Responsive minWidth={400}>
                <span className={styles.action}>Edit</span>
              </Responsive>
            </Flex>
          </Button>
        )}
      </>
    );
  }, [
    comment,
    editable,
    handleOnConversation,
    handleOnEdit,
    handleOnReply,
    isViewerBanned,
    isViewerSuspended,
    isViewerWarned,
    onConversation,
    onEdit,
    onReply,
    settings,
    viewer,
  ]);

  return (
    <Flex
      justifyContent="flex-start"
      alignItems="center"
      className={styles.actionBar}
    >
      <Responsive minWidth={400}>
        <div className={styles.leftActionsWide}>{leftActions}</div>
      </Responsive>
      <Responsive maxWidth={400}>
        <div className={styles.leftActions}>{leftActions}</div>
      </Responsive>

      <Flex className={styles.rightActions} justifyContent="flex-end">
        {viewer &&
          !isViewerBanned &&
          !isViewerSuspended &&
          !isViewerWarned &&
          !showModerationCaret &&
          onToggleReport && (
            <ReportButton
              onClick={onToggleReport}
              open={showReport}
              viewer={viewer}
              comment={comment}
            />
          )}
        {showModerationCaret && (
          <Button
            href={gotoModerateCommentHref}
            target="_blank"
            variant="flat"
            fontSize="small"
            paddingSize="extraSmall"
          >
            Moderate
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment LiveCommentActionsContainer_story on Story {
      canModerate
    }
  `,
  viewer: graphql`
    fragment LiveCommentActionsContainer_viewer on User {
      id
      role
      status {
        current
      }
      ...ReportFlowContainer_viewer
      ...ReportButton_viewer
      ...ReactionButtonContainer_viewer
    }
  `,
  comment: graphql`
    fragment LiveCommentActionsContainer_comment on Comment {
      id
      parent {
        id
      }
      replyCount
      editing {
        editableUntil
      }
      author {
        id
      }
      ...ReportButton_comment
      ...ReportFlowContainer_comment
      ...ReactionButtonContainer_comment
      ...LiveCommentConversationContainer_comment
      ...LiveEditCommentFormContainer_comment
    }
  `,
  settings: graphql`
    fragment LiveCommentActionsContainer_settings on Settings {
      ...ReportFlowContainer_settings
      ...ReactionButtonContainer_settings
      auth {
        integrations {
          sso {
            enabled
            targetFilter {
              admin
            }
          }
        }
      }
    }
  `,
})(LiveCommentActionsContainer);

export default enhanced;
