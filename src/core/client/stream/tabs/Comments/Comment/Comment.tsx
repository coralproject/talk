import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import HTMLContent from "coral-stream/common/HTMLContent";
import Timestamp from "coral-stream/common/Timestamp";
import { Flex, HorizontalGutter } from "coral-ui/components";

import EditedMarker from "./EditedMarker";
import InReplyTo from "./InReplyTo";
import TopBarLeft from "./TopBarLeft";

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
  userTags?: React.ReactNode;
  collapsed?: boolean;
}

const Comment: FunctionComponent<CommentProps> = (props) => {
  return (
    <HorizontalGutter
      role="article"
      size="half"
      className={cn(styles.root, {
        [styles.highlight]: props.highlight,
      })}
    >
      <Flex
        direction="row"
        justifyContent="space-between"
        className={CLASSES.comment.topBar.$root}
      >
        <TopBarLeft>
          <Flex direction="row" alignItems="center" itemGutter="half">
            {props.username && props.username}
            {props.userTags}
          </Flex>
          <Flex direction="row" alignItems="baseline" itemGutter>
            <Timestamp
              className={cn(styles.timestamp, CLASSES.comment.topBar.timestamp)}
            >
              {props.createdAt}
            </Timestamp>
            {props.showEditedMarker && (
              <EditedMarker className={CLASSES.comment.topBar.edited} />
            )}
          </Flex>
        </TopBarLeft>
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
        {props.footer}
      </HorizontalGutter>
    </HorizontalGutter>
  );
};

export default Comment;
