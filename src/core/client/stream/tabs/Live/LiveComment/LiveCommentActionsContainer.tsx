import React, { FunctionComponent, useMemo } from "react";
import { graphql } from "relay-runtime";

import { getModerationLink } from "coral-framework/helpers";
import { useLocal, withFragmentContainer } from "coral-framework/lib/relay";
import { Ability, can } from "coral-stream/permissions";
import { ReactionButtonContainer } from "coral-stream/tabs/shared/ReactionButton";
import { ReportButton } from "coral-stream/tabs/shared/ReportFlow";
import { Flex } from "coral-ui/components/v2";
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

  onConversation?: () => void;
  onReply?: () => void;
  showReport?: boolean;
  onToggleReport?: () => void;
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
}) => {
  const isViewerBanned = false;
  const isViewerSuspended = false;
  const isViewerWarned = false;

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
      role
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
