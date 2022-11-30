import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import HTMLContent from "coral-stream/common/HTMLContent";
import Timestamp from "coral-stream/common/Timestamp";
import { Flex, HorizontalGutter, MatchMedia } from "coral-ui/components/v2";
import { StarRating } from "coral-ui/components/v3";

import { CommentContainer_comment as CommentData } from "coral-stream/__generated__/CommentContainer_comment.graphql";

import EditedMarker from "./EditedMarker";
import InReplyTo from "./InReplyTo";

import styles from "./Comment.css";

export interface CommentProps {
  id: string;
  showCommentID: boolean;
  className?: string;
  usernameEl: React.ReactNode;
  body: string | null;
  rating?: number | null;
  createdAt: string;
  topBarRight?: React.ReactNode;
  footer?: React.ReactNode;
  showEditedMarker?: boolean;
  highlight?: boolean;
  readonly parent: CommentData["parent"];
  tags?: React.ReactNode | null;
  badges?: React.ReactNode | null;
  collapsed?: boolean;
  media?: React.ReactNode;
  enableJumpToParent?: boolean;
}

const Comment: FunctionComponent<CommentProps> = (props) => {
  return (
    <HorizontalGutter
      size="half"
      className={cn(props.className, styles.root, {
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
          {props.usernameEl && (
            <MatchMedia lteWidth="mobile">
              {(matches) => (
                <div
                  className={cn(styles.username, {
                    [styles.usernameFullRow]: matches,
                  })}
                >
                  {props.usernameEl}
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
        {props.topBarRight && (
          <Flex wrap justifyContent="flex-end">
            {props.topBarRight}
          </Flex>
        )}
      </Flex>

      {props.parent && (
        <div className={styles.subBar}>
          <InReplyTo
            parent={props.parent}
            enableJumpToParent={props.enableJumpToParent !== false}
          />
        </div>
      )}

      {props.rating && <StarRating rating={props.rating} />}

      <HorizontalGutter size="oneAndAHalf">
        {props.showCommentID && <div>{props.id}</div>}
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
