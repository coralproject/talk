import * as React from "react";
import { StatelessComponent } from "react";
import Timestamp from "talk-stream/components/Timestamp";
import { Flex, Icon, Typography } from "talk-ui/components";
import HTMLContent from "../../../components/HTMLContent";
import * as styles from "./HistoryComment.css";

export interface CommentHistoryProps {
  comment: {
    body: string | null;
    createdAt: string;
  };
}

const HistoryComment: StatelessComponent<CommentHistoryProps> = props => {
  return (
    <Flex direction="row" justifyContent="space-between">
      <Typography variant="bodyCopy">
        {props.comment.body && <HTMLContent>{props.comment.body}</HTMLContent>}
      </Typography>
      <Flex
        direction="row"
        alignItems="baseline"
        itemGutter="half"
        className={styles.sideBar}
      >
        <Icon className={styles.icon}>schedule</Icon>
        <Timestamp>{props.comment.createdAt}</Timestamp>
      </Flex>
    </Flex>
  );
};

export default HistoryComment;
