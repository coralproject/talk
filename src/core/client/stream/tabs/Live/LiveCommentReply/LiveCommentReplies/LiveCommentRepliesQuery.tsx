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
        query LiveCommentRepliesQuery(
          $storyID: ID!
          $commentID: ID!
          $cursor: Cursor
        ) {
          story(id: $storyID) {
            ...LiveCommentRepliesStreamContainer_story
          }
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
        storyID,
        cursor,
      }}
      render={(data) => {
        if (
          !data ||
          !data.props ||
          !data.props.comment ||
          !data.props.viewer ||
          !data.props.settings ||
          !data.props.story
        ) {
          return <Spinner />;
        }

        return (
          <LiveCommentRepliesStreamContainer
            comment={data.props.comment}
            viewer={data.props.viewer}
            settings={data.props.settings}
            story={data.props.story}
            cursor={cursor}
          />
        );
      }}
    />
  );
};

export default LiveCommentRepliesQuery;
