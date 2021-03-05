import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";

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
          viewer {
            ...LiveCommentRepliesStreamContainer_viewer
          }
          settings {
            ...LiveCommentRepliesStreamContainer_settings
          }
        }
      `}
      variables={{
        commentID,
        cursor,
      }}
      render={(data) => {
        if (
          !data ||
          !data.props ||
          !data.props.comment ||
          !data.props.viewer ||
          !data.props.settings
        ) {
          return <Spinner />;
        }

        return (
          <LiveCommentRepliesStreamContainer
            comment={data.props.comment}
            viewer={data.props.viewer}
            settings={data.props.settings}
            storyID={storyID}
            cursor={cursor}
          />
        );
      }}
    />
  );
};

export default LiveCommentRepliesQuery;
