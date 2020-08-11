import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import HTMLContent from "coral-stream/common/HTMLContent";
import Timestamp from "coral-stream/common/Timestamp";
import { Flex, HorizontalGutter, MatchMedia } from "coral-ui/components/v2";

import EditedMarker from "./EditedMarker";
import InReplyTo from "./InReplyTo";

import styles from "./Comment.css";

export interface CommentProps {
  className?: string;
  username: React.ReactNode;
  body: string | null;
  createdAt: string;
  topBarRight?: React.ReactNode;
  footer?: React.ReactNode;
  showEditedMarker?: boolean;
  highlight?: boolean;
  parentAuthorName?: string | null;
  tags?: React.ReactNode | null;
  badges?: React.ReactNode | null;
  collapsed?: boolean;
  media?: React.ReactNode;
}

const Comment: FunctionComponent<CommentProps> = (props) => {
  return (
    <HorizontalGutter
      role="article"
      size="half"
      className={cn(styles.root, {
        [styles.highlight]: props.highlight,
        [CLASSES.comment.highlight]: props.highlight,
      })}
    >
      <Flex
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        className={CLASSES.comment.topBar.$root}
      >
        <Flex alignItems="center" wrap>
          {props.username && (
            <MatchMedia lteWidth="mobile">
              {(matches) => (
                <div
                  className={cn(styles.username, {
                    [styles.usernameFullRow]: matches,
                  })}
                >
                  {props.username}
                </div>
              )}
            </MatchMedia>
          )}
          <Flex direction="row" alignItems="center" wrap>
            {props.tags && (
              <Flex alignItems="center" className={styles.tags}>
                {props.tags}
              </Flex>
            )}
            {props.badges && (
              <Flex alignItems="center" className={styles.badges}>
                {props.badges}
              </Flex>
            )}
            <Timestamp
              className={cn(styles.timestamp, CLASSES.comment.topBar.timestamp)}
            >
              {props.createdAt}
            </Timestamp>
            {props.showEditedMarker && (
              <EditedMarker className={CLASSES.comment.topBar.edited} />
            )}
          </Flex>
        </Flex>
        {props.topBarRight && <div>{props.topBarRight}</div>}
      </Flex>

      {props.parentAuthorName && (
        <div className={styles.subBar}>
          <InReplyTo username={props.parentAuthorName} />
        </div>
      )}
      <HorizontalGutter size="oneAndAHalf">
        <HTMLContent className={CLASSES.comment.content}>
          {props.body || ""}
        </HTMLContent>
        {props.media}
        {props.footer}
      </HorizontalGutter>
    </HorizontalGutter>
  );
};

export default Comment;
