import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";

import { LiveCommentRepliesQuery } from "coral-stream/__generated__/LiveCommentRepliesQuery.graphql";

import LiveCommentRepliesStreamContainer from "./LiveCommentRepliesStreamContainer";

interface Props {
  commentID: string;
  storyID: string;
  cursor: string;
}

const LiveCommentRepliesQuery: FunctionComponent<Props> = ({
  commentID,
  storyID,
  cursor,
}) => {
  return (
    <QueryRenderer<LiveCommentRepliesQuery>
      query={graphql`
        query LiveCommentRepliesQuery($commentID: ID!, $cursor: Cursor) {
          comment(id: $commentID) {
            ...LiveCommentRepliesStreamContainer_comment
              @arguments(cursor: $cursor)
          }
        }
      `}
      variables={{
        commentID,
        cursor,
      }}
      render={(data) => {
        if (!data || !data.props || !data.props.comment) {
          return null;
        }

        return (
          <LiveCommentRepliesStreamContainer
            comment={data.props.comment}
            storyID={storyID}
            cursor={cursor}
          />
        );
      }}
    />
  );
};

export default LiveCommentRepliesQuery;
