import { Localized } from "fluent-react/compat";
import * as React from "react";
import { FunctionComponent } from "react";
import Timestamp from "talk-stream/components/Timestamp";
import {
  Flex,
  HorizontalGutter,
  Icon,
  TextLink,
  Typography,
} from "talk-ui/components";

import HTMLContent from "../../../components/HTMLContent";

import styles from "./HistoryComment.css";

export interface HistoryCommentProps {
  id: string;
  body: string | null;
  createdAt: string;
  replyCount: number | null;
  story: {
    metadata: {
      title: string | null;
    } | null;
  };
  conversationURL: string;
  onGotoConversation: (e: React.MouseEvent) => void;
}

const HistoryComment: FunctionComponent<HistoryCommentProps> = props => {
  return (
    <HorizontalGutter data-testid={`historyComment-${props.id}`}>
      <Localized
        id="profile-historyComment-story"
        $title={props.story.metadata ? props.story.metadata.title : "N/A"} // FIXME: (wyattjoh) When a title for a Story isn't available, we need a fallback.
      >
        <Typography variant="heading4">{"Story: {$title}"}</Typography>
      </Localized>
      <Timestamp>{props.createdAt}</Timestamp>
      <Typography variant="bodyCopy" container="div">
        {props.body && <HTMLContent>{props.body}</HTMLContent>}
      </Typography>
      <Flex direction="row" alignItems="center" itemGutter>
        {!!props.replyCount && (
          <div className={styles.replies}>
            <Icon className={styles.icon}>reply</Icon>
            <Localized
              id="profile-historyComment-replies"
              $replyCount={props.replyCount}
            >
              <span>{"Replies {$replyCount}"}</span>
            </Localized>
          </div>
        )}
        <Localized id="profile-historyComment-viewConversation">
          <TextLink
            target="_parent"
            href={props.conversationURL}
            onClick={props.onGotoConversation}
            className={styles.viewConversation}
          >
            View Conversation
          </TextLink>
        </Localized>
      </Flex>
    </HorizontalGutter>
  );
};

export default HistoryComment;
