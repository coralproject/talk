import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { compact } from "lodash";

import { getURLWithCommentID } from "coral-framework/helpers";
import { useToggleState } from "coral-framework/hooks";
import { withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { BaseButton, ButtonIcon, Flex, Icon } from "coral-ui/components/v2";

import { HistoryCommentFooterContainer_comment } from "coral-stream/__generated__/HistoryCommentFooterContainer_comment.graphql";
import { HistoryCommentFooterContainer_settings } from "coral-stream/__generated__/HistoryCommentFooterContainer_settings.graphql";

import styles from "./HistoryCommentFooterContainer.css";

interface Props {
  comment: HistoryCommentFooterContainer_comment;
  settings: HistoryCommentFooterContainer_settings;
  onGotoConversation: (e: React.MouseEvent) => void;
}

const HistoryCommentFooterContainer: FunctionComponent<Props> = ({
  comment,
  settings,
  onGotoConversation,
}) => {
  const [areDetailsVisible, , toggleDetailVisibility] = useToggleState();
  if (!comment.actionCounts.reaction.total) {
    return null;
  }
  return (
    <>
      <Flex spacing={2}>
        <BaseButton
          onClick={toggleDetailVisibility}
          className={cn(
            styles.button,
            styles.reactionsButton,
            {
              [styles.activeReactionsButton]: areDetailsVisible,
            },
            CLASSES.myComment.reactions
          )}
        >
          <ButtonIcon>{settings.reaction.icon}</ButtonIcon>
          <span className={cn(styles.reactionsButtonText)}>
            {settings.reaction.label} {comment.actionCounts.reaction.total}
          </span>
          <ButtonIcon className={styles.buttonCaret}>
            {areDetailsVisible ? "expand_less" : "expand_more"}
          </ButtonIcon>
        </BaseButton>
        {!!comment.replyCount && (
          <div className={cn(styles.replies, CLASSES.myComment.replies)}>
            <Icon className={styles.repliesIcon}>reply</Icon>
            <Localized
              id="profile-historyComment-replies"
              $replyCount={comment.replyCount}
            >
              <span>{"Replies {$replyCount}"}</span>
            </Localized>
          </div>
        )}
        <BaseButton
          anchor
          target="_parent"
          href={getURLWithCommentID(comment.story.url, comment.id)}
          onClick={onGotoConversation}
          className={cn(
            styles.button,
            styles.viewConversation,
            CLASSES.myComment.viewConversationButton
          )}
        >
          <Icon className={styles.viewConversationIcon} size="sm">
            open_in_new
          </Icon>
          <Localized id="profile-historyComment-viewConversation">
            <span className={styles.viewConversationText}>
              View Conversation
            </span>
          </Localized>
        </BaseButton>
      </Flex>
      {areDetailsVisible && (
        <Flex className={styles.reacterUsernames} alignItems="flex-start">
          <Icon size="sm" className={styles.reacterUsernamesIcon}>
            {settings.reaction.icon}
          </Icon>
          <div>
            {compact(
              comment.reactions.nodes.map((n) => n.reacter?.username)
            ).join(", ")}
          </div>
        </Flex>
      )}
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment HistoryCommentFooterContainer_comment on Comment {
      id
      reactions {
        nodes {
          id
          reacter {
            username
          }
        }
      }
      story {
        id
        url
        metadata {
          title
        }
        settings {
          mode
        }
      }
      replyCount
      actionCounts {
        reaction {
          total
        }
      }
    }
  `,
  settings: graphql`
    fragment HistoryCommentFooterContainer_settings on Settings {
      reaction {
        label
        icon
      }
    }
  `,
})(HistoryCommentFooterContainer);

export default enhanced;
