import * as React from "react";
import { StatelessComponent } from "react";
import { CommentHistoryContainer_me as MeData } from "talk-stream/__generated__/CommentHistoryContainer_me.graphql";
import { HorizontalGutter } from "talk-ui/components";

export interface CommentHistoryProps {
  me: MeData;
}

const CommentHistory: StatelessComponent<CommentHistoryProps> = props => {
  return <HorizontalGutter size="double">Comments</HorizontalGutter>;
};

export default CommentHistory;
