import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import Timestamp from "talk-stream/components/Timestamp";
import {
  Button,
  Flex,
  HorizontalGutter,
  Icon,
  Typography,
} from "talk-ui/components";
import HTMLContent from "../../../components/HTMLContent";
import * as styles from "./HistoryComment.css";

export interface HistoryCommentProps {
  body: string | null;
  createdAt: string;
  replyCount: number | null;
  asset: {
    title: string | null;
  };
  conversationURL: string;
  onGotoConversation: (e: React.MouseEvent) => void;
}

const HistoryComment: StatelessComponent<HistoryCommentProps> = props => {
  return (
    <HorizontalGutter>
      <Flex direction="row" justifyContent="space-between">
        <Typography variant="bodyCopy" container="div">
          {props.body && (
            <HTMLContent className={styles.body}>{props.body}</HTMLContent>
          )}
        </Typography>
        <Flex className={styles.sideBar} direction="column">
          <Flex direction="row" alignItems="center" itemGutter="half">
            <Button
              variant="underlined"
              target="_parent"
              href={props.conversationURL}
              onClick={props.onGotoConversation}
              anchor
            >
              <Icon>launch</Icon>
              <Localized id="profile-historyComment-viewConversation">
                <span>View Conversation</span>
              </Localized>
            </Button>
          </Flex>
          <Flex direction="row" alignItems="center" itemGutter="half">
            <Icon className={styles.icon}>schedule</Icon>
            <Timestamp>{props.createdAt}</Timestamp>
          </Flex>
        </Flex>
      </Flex>
      {!!props.replyCount && (
        <Flex
          direction="row"
          alignItems="center"
          itemGutter="half"
          className={styles.replies}
        >
          <Icon className={styles.icon}>reply</Icon>
          <Localized
            id="profile-historyComment-replies"
            $replyCount={props.replyCount}
          >
            <span>{"Replies {$replyCount}"}</span>
          </Localized>
        </Flex>
      )}
      <Localized id="profile-historyComment-story" $title={props.asset.title}>
        <span className={styles.story}>{"Story: {$title}"}</span>
      </Localized>
    </HorizontalGutter>
  );
};

export default HistoryComment;
