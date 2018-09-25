import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { CommentsHistoryContainer_me as MeData } from "talk-stream/__generated__/CommentsHistoryContainer_me.graphql";
import { HorizontalGutter, Typography } from "talk-ui/components";
import HistoryComment from "./HistoryComment";

export interface CommentsHistoryProps {
  goToConversation: () => void;
  me: MeData;
}

const CommentsHistory: StatelessComponent<CommentsHistoryProps> = props => {
  const comments = props.me.comments.edges.map(edge => edge.node);
  return (
    <HorizontalGutter size="double">
      <Localized id="profile-commentHistory">
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
