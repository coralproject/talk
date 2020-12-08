import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { GQLSTORY_MODE } from "coral-framework/schema";
import CLASSES from "coral-stream/classes";
import HTMLContent from "coral-stream/common/HTMLContent";
import Timestamp from "coral-stream/common/Timestamp";
import InReplyTo from "coral-stream/tabs/Comments/Comment/InReplyTo";
import { Button, Flex, HorizontalGutter, Icon } from "coral-ui/components/v2";
import { StarRating } from "coral-ui/components/v3";

import styles from "./HistoryComment.css";

export interface HistoryCommentProps {
  id: string;
  body: string | null;
  createdAt: string;
  rating: number | null;
  replyCount: number | null;
  parentAuthorName?: string | null;
  story: {
    metadata: {
      title: string | null;
    } | null;
    settings: {
      mode: string;
    };
  };
  conversationURL: string;
  onGotoConversation: (e: React.MouseEvent) => void;
  media: React.ReactNode;
  reactions: React.ReactNode;
}

const HistoryComment: FunctionComponent<HistoryCommentProps> = (props) => {
  return (
    <HorizontalGutter
      className={cn(styles.root, CLASSES.myComment.$root)}
      data-testid={`historyComment-${props.id}`}
    >
      <div>
        <Localized id="profile-historyComment-comment-on">
          <span className={cn(CLASSES.myComment.commentOn, styles.commentOn)}>
            Comment on:
          </span>
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
        <HorizontalGutter>
          {props.story.settings.mode === GQLSTORY_MODE.RATINGS_AND_REVIEWS &&
            props.rating && <StarRating rating={props.rating} />}
          <div className={styles.content}>
            {props.body && (
              <HTMLContent className={CLASSES.myComment.content}>
                {props.body}
              </HTMLContent>
            )}
          </div>
          {props.media}
        </HorizontalGutter>
      </div>
      <Flex
        direction="row"
        alignItems="center"
        itemGutter="double"
        className={styles.footer}
      >
        {props.reactions}
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
          anchor
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
