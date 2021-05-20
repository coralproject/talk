import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { HorizontalGutter } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import Indent from "../Indent";
import ReplyListCommentContainer from "./ReplyListCommentContainer";

import styles from "./ReplyList.css";

export interface ReplyListProps {
  story: PropTypesOf<typeof ReplyListCommentContainer>["story"];
  viewer: PropTypesOf<typeof ReplyListCommentContainer>["viewer"];
  comment: {
    id: string;
  };
  comments: ReadonlyArray<
    {
      id: string;
      replyListElement?: React.ReactElement<any> | null;
      showConversationLink?: boolean;
    } & PropTypesOf<typeof ReplyListCommentContainer>["comment"]
  >;
  settings: PropTypesOf<typeof ReplyListCommentContainer>["settings"];
  onShowAll?: () => void;
  hasMore?: boolean;
  disableShowAll?: boolean;
  indentLevel?: number;
  localReply?: boolean;
  disableReplies?: boolean;
  viewNewCount?: number;
  onViewNew?: () => void;
  allowIgnoredTombstoneReveal?: boolean;
  disableHideIgnoredTombstone?: boolean;
  showRemoveAnswered?: boolean;
}

const ReplyList: FunctionComponent<ReplyListProps> = (props) => {
  return (
    <HorizontalGutter
      id={`coral-comments-replyList-log--${props.comment.id}`}
      data-testid={`commentReplyList-${props.comment.id}`}
      role="log"
      className={styles.root}
    >
      {props.comments.map((comment) => (
        <ReplyListCommentContainer
          key={comment.id}
          viewer={props.viewer}
          comment={comment}
          story={props.story}
          settings={props.settings}
          allowIgnoredTombstoneReveal={props.allowIgnoredTombstoneReveal}
          disableHideIgnoredTombstone={props.disableHideIgnoredTombstone}
          localReply={props.localReply}
          indentLevel={props.indentLevel}
          disableReplies={props.disableReplies}
          showRemoveAnswered={props.showRemoveAnswered}
          showConversationLink={comment.showConversationLink}
          replyListElement={comment.replyListElement}
        />
      ))}
      {props.hasMore && (
        <Indent level={props.indentLevel} noBorder>
          <Localized id="comments-replyList-showAll">
            <Button
              id={`coral-comments-replyList-showAll--${props.comment.id}`}
              aria-controls={`coral-comments-replyList-log--${props.comment.id}`}
              className={CLASSES.replyList.showAllButton}
              onClick={props.onShowAll}
              disabled={props.disableShowAll}
              variant="outlined"
              color="secondary"
              fullWidth
              // Added for keyboard shortcut support.
              data-key-stop
              data-is-load-more
            >
              Show All Replies
            </Button>
          </Localized>
        </Indent>
      )}
      {!!props.viewNewCount && (
        <Indent level={props.indentLevel} noBorder>
          <Localized id="comments-replyList-showMoreReplies">
            <Button
              aria-controls={`coral-comments-replyList-log--${props.comment.id}`}
              onClick={props.onViewNew}
              className={CLASSES.replyList.showMoreReplies}
              variant="outlined"
              color="secondary"
              fullWidth
            >
              Show More Replies
            </Button>
          </Localized>
        </Indent>
      )}
    </HorizontalGutter>
  );
};

export default ReplyList;
