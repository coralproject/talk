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
        >
          Show All Replies
        </Button>
      )}
    </Indent>
  );
};

export default ReplyList;
