import cn from "classnames";
import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import HTMLContent from "coral-stream/common/HTMLContent";
import Timestamp from "coral-stream/common/Timestamp";
import {
  Flex,
  HorizontalGutter,
  Icon,
  TextLink,
  Typography,
} from "coral-ui/components";

import styles from "./HistoryComment.css";

export interface HistoryCommentProps {
  id: string;
  body: string | null;
  createdAt: string;
  replyCount: number | null;
  story: {
    metadata: {
      title: string | null;
    } | null;
  };
  conversationURL: string;
  onGotoConversation: (e: React.MouseEvent) => void;
}

const HistoryComment: FunctionComponent<HistoryCommentProps> = props => {
  return (
    <HorizontalGutter
      className={CLASSES.myComment.$root}
      data-testid={`historyComment-${props.id}`}
    >
      <div>
        <Localized id="profile-historyComment-comment-on">
          <Typography variant="detail" className={styles.commentOn}>
            Comment on:
          </Typography>
        </Localized>
        <Typography
          variant="heading4"
          color="textDark"
          className={CLASSES.myComment.story}
        >
          {props.story.metadata ? props.story.metadata.title : "N/A"}
        </Typography>
      </div>
      <div>
        <Timestamp className={CLASSES.myComment.timestamp}>
          {props.createdAt}
        </Timestamp>
        <Typography variant="bodyCopy" container="div">
          {props.body && (
            <HTMLContent className={CLASSES.myComment.content}>
              {props.body}
            </HTMLContent>
          )}
        </Typography>
      </div>
      <Flex direction="row" alignItems="center" itemGutter>
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
        <Localized id="profile-historyComment-viewConversation">
          <TextLink
            target="_parent"
            href={props.conversationURL}
            onClick={props.onGotoConversation}
            className={cn(
              styles.viewConversation,
              CLASSES.myComment.viewConversationButton
            )}
          >
            View Conversation
          </TextLink>
        </Localized>
      </Flex>
    </HorizontalGutter>
  );
};

export default HistoryComment;
