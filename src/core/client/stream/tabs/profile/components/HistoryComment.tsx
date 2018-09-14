import * as React from "react";
import { StatelessComponent } from "react";
import { Flex, RelativeTime, Typography } from "talk-ui/components";
import HTMLContent from "../../../components/HTMLContent";

export interface CommentHistoryProps {
  comment: {
    body: string | null;
    createdAt: string;
  };
}

const HistoryComment: StatelessComponent<CommentHistoryProps> = props => {
  return (
    <Flex>
      <Typography variant="bodyCopy">
        {props.comment.body && <HTMLContent>{props.comment.body}</HTMLContent>}
      </Typography>
      <div>
        <RelativeTime date={props.comment.createdAt} />
      </div>
    </Flex>
  );
};

export default HistoryComment;
