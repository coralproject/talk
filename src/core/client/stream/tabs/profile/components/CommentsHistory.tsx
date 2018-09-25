import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { HorizontalGutter, Typography } from "talk-ui/components";
import HistoryComment from "./HistoryComment";

interface Me {
  comments: {
    edges: Array<{
      node: {
        id: string;
        body: string | null;
        createdAt: any;
        replyCount: number | null;
      };
    }>;
  };
}

interface CommentsHistoryProps {
  goToConversation: () => void;
  me: Me;
}

const CommentsHistory: StatelessComponent<CommentsHistoryProps> = props => {
  const comments = props.me.comments.edges.map(edge => edge.node);
  return (
    <HorizontalGutter size="double">
      <Localized id="profile-historyComment-commentHistory">
        <Typography variant="heading3">Comment History</Typography>
      </Localized>
      {comments.map(comment => (
        <HistoryComment
          key={comment.id}
          comment={comment}
          goToConversation={props.goToConversation}
        />
      ))}
    </HorizontalGutter>
  );
};

export default CommentsHistory;
