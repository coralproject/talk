import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { HorizontalGutter, Typography } from "talk-ui/components";
import HistoryComment from "./HistoryComment";

interface Comment {
  readonly id: string;
  readonly body: string | null;
  readonly createdAt: any;
  readonly replyCount: number | null;
  readonly asset: {
    readonly title: string | null;
  };
}

interface CommentsHistoryProps {
  onGoToConversation: (id: string) => void;
  comments: Comment[];
}

const CommentsHistory: StatelessComponent<CommentsHistoryProps> = props => {
  return (
    <HorizontalGutter>
      <Localized id="profile-historyComment-commentHistory">
        <Typography variant="heading3">Comment History</Typography>
      </Localized>
      {props.comments.map(comment => (
        <HistoryComment
          key={comment.id}
          comment={comment}
          onGoToConversation={() => props.onGoToConversation(comment.id)}
        />
      ))}
    </HorizontalGutter>
  );
};

export default CommentsHistory;
