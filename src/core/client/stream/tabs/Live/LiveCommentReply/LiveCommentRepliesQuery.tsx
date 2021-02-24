import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";

// import { LiveCommentRepliesQuery } from "coral-stream/__generated__/LiveCommentRepliesQuery.graphql";

import LiveCommentRepliesContainer from "./LiveCommentRepliesContainer";

interface Props {
  commentID: string;
}

const LiveCommentRepliesQuery: FunctionComponent<Props> = ({ commentID }) => {
  return (
    <QueryRenderer<any>
      query={graphql`
        query LiveCommentRepliesQuery($commentID: ID!) {
          comment(id: $commentID) {
            ...LiveCommentRepliesContainer_comment
          }
        }
      `}
      variables={{
        commentID,
      }}
      render={(data) => {
        if (!data || !data.props || !data.props.comment) {
          return null;
        }

        return <LiveCommentRepliesContainer comment={data.props.comment} />;
      }}
    />
  );
};

export default LiveCommentRepliesQuery;
