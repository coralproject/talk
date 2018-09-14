import * as React from "react";
import { StatelessComponent } from "react";
import { CommentHistoryContainer_me as MeData } from "talk-stream/__generated__/CommentHistoryContainer_me.graphql";
import { HorizontalGutter, Typography } from "talk-ui/components";
import HistoryComment from "./HistoryComment";

export interface CommentHistoryProps {
  me: MeData;
}

const CommentHistory: StatelessComponent<CommentHistoryProps> = props => {
  const comments = props.me.comments.edges.map(edge => edge.node);
  return (
    <HorizontalGutter size="double">
      <Typography variant="heading3">Comment History</Typography>
      {comments.map(comment => (
        <HistoryComment key={comment.id} comment={comment} />
      ))}
    </HorizontalGutter>
  );
};

export default CommentHistory;
