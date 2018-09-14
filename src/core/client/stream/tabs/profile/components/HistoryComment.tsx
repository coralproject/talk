import * as React from "react";
import { StatelessComponent } from "react";
import Timestamp from "talk-stream/components/Timestamp";
import {
  BaseButton,
  Flex,
  HorizontalGutter,
  Icon,
  Typography,
} from "talk-ui/components";
import HTMLContent from "../../../components/HTMLContent";
import * as styles from "./HistoryComment.css";

export interface CommentHistoryProps {
  comment: {
    body: string | null;
    createdAt: string;
    replyCount: number | null;
  };
  goToConversation: () => void;
}

const HistoryComment: StatelessComponent<CommentHistoryProps> = props => {
  return (
    <HorizontalGutter>
      <Flex direction="row" justifyContent="space-between">
        <Typography variant="bodyCopy">
          {props.comment.body && (
            <HTMLContent>{props.comment.body}</HTMLContent>
          )}
        </Typography>
        <HorizontalGutter className={styles.sideBar}>
          <Flex direction="row" alignItems="center" itemGutter="half">
            <Icon className={styles.icon}>launch</Icon>
            <BaseButton
              className={styles.button}
              onClick={props.goToConversation}
              anchor
            >
              View Conversation
            </BaseButton>
          </Flex>
          <Flex direction="row" alignItems="center" itemGutter="half">
            <Icon className={styles.icon}>schedule</Icon>
            <Timestamp>{props.comment.createdAt}</Timestamp>
          </Flex>
        </HorizontalGutter>
      </Flex>
      {!!props.comment.replyCount && (
        <Flex
          direction="row"
          alignItems="center"
          itemGutter="half"
          className={styles.text}
        >
          <Icon className={styles.icon}>reply</Icon>
          <span>Replies {props.comment.replyCount}</span>
        </Flex>
      )}
    </HorizontalGutter>
  );
};

export default HistoryComment;
