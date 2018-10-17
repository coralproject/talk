import { Localized } from "fluent-react/compat";
import * as React from "react";
import { StatelessComponent } from "react";
import { HorizontalGutter, Typography } from "talk-ui/components";
import HistoryCommentContainer from "../containers/HistoryCommentContainer";

import { PropTypesOf } from "talk-framework/types";

interface CommentHistoryProps {
  asset: PropTypesOf<typeof HistoryCommentContainer>["asset"];
  comments: Array<
    { id: string } & PropTypesOf<typeof HistoryCommentContainer>["comment"]
  >;
}

const CommentHistory: StatelessComponent<CommentHistoryProps> = props => {
  return (
    <HorizontalGutter size="double">
      <Localized id="profile-historyComment-commentHistory">
        <Typography variant="heading3">Comment History</Typography>
      </Localized>
      {props.comments.map(comment => (
        <HistoryCommentContainer
          key={comment.id}
          asset={props.asset}
          comment={comment}
        />
      ))}
    </HorizontalGutter>
  );
};

export default CommentHistory;
