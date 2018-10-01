import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { HorizontalGutter, Typography } from "talk-ui/components";
import HistoryComment from "./HistoryComment";

interface Me {
  readonly comments: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly body: string | null;
        readonly createdAt: any;
        readonly replyCount: number | null;
        readonly asset: {
          readonly title: string | null;
        };
      };
    }>;
  };
}

interface CommentsHistoryProps {
  onGoToConversation: (id: string) => void;
  me: Me;
}

const CommentsHistory: StatelessComponent<CommentsHistoryProps> = props => {
  const comments = props.me.comments.edges.map(edge => edge.node);
  return (
    <HorizontalGutter>
      <Localized id="profile-historyComment-commentHistory">
        <Typography variant="heading3">Comment History</Typography>
      </Localized>
      {comments.map(comment => (
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
