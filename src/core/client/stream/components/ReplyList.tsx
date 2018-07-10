import * as React from "react";
import { StatelessComponent } from "react";

import { Button } from "talk-ui/components";

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
      <div id={`talk-reply-list--log--${props.commentID}`} role="log">
        {props.comments.map(comment => (
          <CommentContainer key={comment.id} data={comment} gutterBottom />
        ))}
        {props.hasMore && (
          <Button
            id={`talk-reply-list--show-all--${props.commentID}`}
            onClick={props.onShowAll}
            disabled={props.disableShowAll}
            secondary
            invert
            fullWidth
            aria-controls={`talk-reply-list--log--${props.commentID}`}
          >
            Show All Replies
          </Button>
        )}
      </div>
    </Indent>
  );
};

export default ReplyList;
