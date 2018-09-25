import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import Timestamp from "talk-stream/components/Timestamp";
import {
  BaseButton,
  ButtonIcon,
  Flex,
  HorizontalGutter,
  Typography,
} from "talk-ui/components";
import HTMLContent from "../../../components/HTMLContent";
import * as styles from "./HistoryComment.css";

export interface HistoryCommentProps {
  comment: {
    body: string | null;
    createdAt: string;
    replyCount: number | null;
  };
  onGoToConversation: () => void;
}

const HistoryComment: StatelessComponent<HistoryCommentProps> = props => {
  return (
    <HorizontalGutter>
      <Flex direction="row" justifyContent="space-between">
        <Typography variant="bodyCopy" container="div">
          {props.comment.body && (
            <HTMLContent>{props.comment.body}</HTMLContent>
          )}
        </Typography>
        <HorizontalGutter className={styles.sideBar}>
          <Flex direction="row" alignItems="center" itemGutter="half">
            <ButtonIcon className={styles.icon}>launch</ButtonIcon>
            <Localized id="profile-historyComment-viewConversation">
              <BaseButton
                className={styles.button}
                onClick={props.onGoToConversation}
                anchor
              >
                View Conversation
              </BaseButton>
            </Localized>
          </Flex>
          <Flex direction="row" alignItems="center" itemGutter="half">
            <ButtonIcon className={styles.icon}>schedule</ButtonIcon>
            <Timestamp>{props.comment.createdAt}</Timestamp>
          </Flex>
        </HorizontalGutter>
      </Flex>
      {!!props.comment.replyCount && (
        <Flex
          direction="row"
          alignItems="center"
          itemGutter="half"
          className={styles.replies}
        >
          <ButtonIcon className={styles.icon}>reply</ButtonIcon>
          <Localized id="profile-historyComment-replies">
            <span>Replies {props.comment.replyCount}</span>
          </Localized>
        </Flex>
      )}
    </HorizontalGutter>
  );
};

export default HistoryComment;
