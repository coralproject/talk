import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import HTMLContent from "coral-stream/common/HTMLContent";
import Timestamp from "coral-stream/common/Timestamp";
import InReplyTo from "coral-stream/tabs/Comments/Comment/InReplyTo";
import { Button, Flex, HorizontalGutter, Icon } from "coral-ui/components/v2";

import styles from "./HistoryComment.css";

export interface HistoryCommentProps {
  id: string;
  body: string | null;
  createdAt: string;
  replyCount: number | null;
  reactionCount: number | null;
  reactionSettings: {
    label: string;
    icon: string;
  };
  parentAuthorName?: string | null;
  story: {
    metadata: {
      title: string | null;
    } | null;
  };
  conversationURL: string;
  onGotoConversation: (e: React.MouseEvent) => void;
}

const HistoryComment: FunctionComponent<HistoryCommentProps> = (props) => {
  return (
    <HorizontalGutter
      className={cn(styles.root, CLASSES.myComment.$root)}
      data-testid={`historyComment-${props.id}`}
    >
      <div className={CLASSES.myComment.commentOn}>
        <Localized id="profile-historyComment-comment-on">
          <span className={styles.commentOn}>Comment on:</span>
        </Localized>
        <div className={cn(styles.storyTitle, CLASSES.myComment.story)}>
          {props.story.metadata ? props.story.metadata.title : "N/A"}
        </div>
      </div>
      <div>
        <Timestamp className={CLASSES.myComment.timestamp}>
          {props.createdAt}
        </Timestamp>
        {props.parentAuthorName && (
          <div className={styles.subBar}>
            <InReplyTo username={props.parentAuthorName} />
          </div>
        )}
        <div className={styles.content}>
          {props.body && (
            <HTMLContent className={CLASSES.myComment.content}>
              {props.body}
            </HTMLContent>
          )}
        </div>
      </div>
      <Flex
        direction="row"
        alignItems="center"
        itemGutter="double"
        className={styles.footer}
      >
        {!!props.reactionCount && (
          <div className={cn(styles.reactions, CLASSES.myComment.reactions)}>
            <Icon className={styles.icon}>{props.reactionSettings.icon}</Icon>
            <span>
              {props.reactionSettings.label} {props.reactionCount}
            </span>
          </div>
        )}
        {!!props.replyCount && (
          <div className={cn(styles.replies, CLASSES.myComment.replies)}>
            <Icon className={styles.icon}>reply</Icon>
            <Localized
              id="profile-historyComment-replies"
              $replyCount={props.replyCount}
            >
              <span>{"Replies {$replyCount}"}</span>
            </Localized>
          </div>
        )}
        <Button
          target="_parent"
          href={props.conversationURL}
          onClick={props.onGotoConversation}
          className={cn(
            styles.viewConversation,
            CLASSES.myComment.viewConversationButton
          )}
          variant="textUnderlined"
          uppercase={false}
          color="regular"
          size="regular"
          classes={{
            variantTextUnderlined: styles.variantTextUnderlined,
            colorRegular: styles.colorRegular,
            mouseHover: styles.mouseHover,
            active: styles.active,
            disabled: styles.disabled,
            sizeRegular: styles.sizeRegular,
          }}
        >
          <Flex justifyContent="center">
            <Icon className={styles.viewConversationIcon} size="sm">
              open_in_new
            </Icon>
            <Localized id="profile-historyComment-viewConversation">
              View Conversation
            </Localized>
          </Flex>
        </Button>
      </Flex>
    </HorizontalGutter>
  );
};

export default HistoryComment;
