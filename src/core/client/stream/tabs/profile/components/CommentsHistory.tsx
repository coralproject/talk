import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { HorizontalGutter, Typography } from "talk-ui/components";
import HistoryComment from "./HistoryComment";

interface Comment {
  id: string;
  body: string | null;
  createdAt: any;
  replyCount: number | null;
  asset: {
    title: string | null;
  };
  conversationURL: string;
  onGotoConversation: (e: React.MouseEvent) => void;
}

interface CommentsHistoryProps {
  comments: Comment[];
}

const CommentsHistory: StatelessComponent<CommentsHistoryProps> = props => {
  return (
    <HorizontalGutter>
      <Localized id="profile-historyComment-commentHistory">
        <Typography variant="heading3">Comment History</Typography>
      </Localized>
      {props.comments.map(comment => (
        <HistoryComment key={comment.id} {...comment} />
      ))}
    </HorizontalGutter>
  );
};

export default CommentsHistory;
