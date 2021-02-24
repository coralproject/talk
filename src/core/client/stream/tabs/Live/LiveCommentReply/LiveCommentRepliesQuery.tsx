import React, { FunctionComponent } from "react";

interface Props {
  commentID: string;
}

const LiveCommentRepliesQuery: FunctionComponent<Props> = ({ commentID }) => {
  return <div>replies for {commentID}</div>;
};

export default LiveCommentRepliesQuery;
