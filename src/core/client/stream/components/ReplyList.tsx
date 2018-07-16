import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";

import { Button, Flex } from "talk-ui/components";

import CommentContainer from "../containers/CommentContainer";
import Indent from "./Indent";

export interface ReplyListProps {
  commentID: string;
  comments: ReadonlyArray<{ id: string }>;
  onShowAll: () => void;
  hasMore: boolean;
  disableShowAll: boolean;
}

const ReplyList: StatelessComponent<ReplyListProps> = props => {
  return (
    <Indent>
      <Flex
        direction="column"
        id={`talk-comments-replyList-log--${props.commentID}`}
        role="log"
        itemGutter
      >
        {props.comments.map(comment => (
          <CommentContainer key={comment.id} data={comment} />
        ))}
        {props.hasMore && (
          <Localized id="comments-replyList-showAll">
            <Button
              id={`talk-comments-replyList-showAll--${props.commentID}`}
              aria-controls={`talk-comments-replyList-log--${props.commentID}`}
              onClick={props.onShowAll}
              disabled={props.disableShowAll}
              secondary
              invert
              fullWidth
            >
              Show All Replies
            </Button>
          </Localized>
        )}
      </Flex>
    </Indent>
  );
};

export default ReplyList;
