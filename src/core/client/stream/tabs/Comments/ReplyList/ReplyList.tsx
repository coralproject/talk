import { Localized } from "fluent-react/compat";
import * as React from "react";
import { FunctionComponent } from "react";

import FadeInTransition from "coral-framework/components/FadeInTransition";
import { PropTypesOf } from "coral-framework/types";
import { Button, HorizontalGutter } from "coral-ui/components";

import CommentContainer from "../Comment";
import IgnoredTombstoneOrHideContainer from "../IgnoredTombstoneOrHideContainer";
import Indent from "../Indent";

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
      replyListElement?: React.ReactElement<any>;
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
}

const ReplyList: FunctionComponent<ReplyListProps> = props => {
  return (
    <HorizontalGutter
      id={`coral-comments-replyList-log--${props.comment.id}`}
      data-testid={`commentReplyList-${props.comment.id}`}
      role="log"
    >
      {props.comments.map(comment => (
        <FadeInTransition
          key={comment.id}
          active={Boolean(comment.enteredLive)}
        >
          <IgnoredTombstoneOrHideContainer
            viewer={props.viewer}
            comment={comment}
          >
            <HorizontalGutter key={comment.id}>
              <CommentContainer
                key={comment.id}
                viewer={props.viewer}
                comment={comment}
                story={props.story}
                settings={props.settings}
                indentLevel={props.indentLevel}
                localReply={props.localReply}
                disableReplies={props.disableReplies}
                showConversationLink={!!comment.showConversationLink}
              />
              {comment.replyListElement}
            </HorizontalGutter>
          </IgnoredTombstoneOrHideContainer>
        </FadeInTransition>
      ))}
      {props.hasMore && (
        <Indent level={props.indentLevel} noBorder>
          <Localized id="comments-replyList-showAll">
            <Button
              id={`coral-comments-replyList-showAll--${props.comment.id}`}
              aria-controls={`coral-comments-replyList-log--${
                props.comment.id
              }`}
              onClick={props.onShowAll}
              disabled={props.disableShowAll}
              variant="outlined"
              fullWidth
            >
              Show All Replies
            </Button>
          </Localized>
        </Indent>
      )}
      {Boolean(props.viewNewCount && props.viewNewCount > 0) && (
        <Indent level={props.indentLevel} noBorder>
          <Button
            aria-controls={`coral-comments-replyList-log--${props.comment.id}`}
            onClick={props.onViewNew}
            variant="outlined"
            fullWidth
          >
            Show more replies
          </Button>
        </Indent>
      )}
    </HorizontalGutter>
  );
};

export default ReplyList;
