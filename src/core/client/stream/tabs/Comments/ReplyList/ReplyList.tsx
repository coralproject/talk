import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import FadeInTransition from "coral-framework/components/FadeInTransition";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { HorizontalGutter } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import CommentContainer from "../Comment";
import CollapsableComment from "../Comment/CollapsableComment";
import IgnoredTombstoneOrHideContainer from "../IgnoredTombstoneOrHideContainer";
import Indent from "../Indent";

import styles from "./ReplyList.css";

export interface ReplyListProps {
  story: PropTypesOf<typeof CommentContainer>["story"];
  viewer: PropTypesOf<typeof CommentContainer>["viewer"] &
    PropTypesOf<typeof IgnoredTombstoneOrHideContainer>["viewer"];
  comment: {
    id: string;
  };
  comments: ReadonlyArray<
    {
      id: string;
      replyListElement?: React.ReactElement<any> | null;
      showConversationLink?: boolean;
      enteredLive?: boolean | null;
    } & PropTypesOf<typeof CommentContainer>["comment"] &
      PropTypesOf<typeof IgnoredTombstoneOrHideContainer>["comment"]
  >;
  settings: PropTypesOf<typeof CommentContainer>["settings"];
  onShowAll?: () => void;
  hasMore?: boolean;
  disableShowAll?: boolean;
  indentLevel?: number;
  localReply?: boolean;
  disableReplies?: boolean;
  viewNewCount?: number;
  onViewNew?: () => void;
  allowTombstoneReveal?: boolean;
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
        <FadeInTransition
          key={comment.id}
          active={Boolean(comment.enteredLive)}
        >
          <IgnoredTombstoneOrHideContainer
            viewer={props.viewer}
            comment={comment}
            allowTombstoneReveal={props.allowTombstoneReveal}
          >
            <HorizontalGutter key={comment.id}>
              <CollapsableComment>
                {({ collapsed, toggleCollapsed }) => (
                  <>
                    <CommentContainer
                      key={comment.id}
                      viewer={props.viewer}
                      comment={comment}
                      story={props.story}
                      collapsed={collapsed}
                      settings={props.settings}
                      indentLevel={props.indentLevel}
                      localReply={props.localReply}
                      disableReplies={props.disableReplies}
                      showConversationLink={!!comment.showConversationLink}
                      toggleCollapsed={toggleCollapsed}
                      showRemoveAnswered={props.showRemoveAnswered}
                    />
                    <div
                      className={cn({
                        [styles.hiddenReplies]: collapsed,
                      })}
                    >
                      {comment.replyListElement}
                    </div>
                  </>
                )}
              </CollapsableComment>
            </HorizontalGutter>
          </IgnoredTombstoneOrHideContainer>
        </FadeInTransition>
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
