import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { QueryRenderer } from "coral-framework/lib/relay";
import { Spinner } from "coral-ui/components/v2";

import { LiveCommentRepliesQuery } from "coral-stream/__generated__/LiveCommentRepliesQuery.graphql";
import { LiveReplyContainer_comment } from "coral-stream/__generated__/LiveReplyContainer_comment.graphql";

import LiveCommentRepliesStreamContainer from "./LiveCommentRepliesStreamContainer";

interface Props {
  commentID: string;
  storyID: string;
  cursor: string;

  tailing: boolean;
  setTailing: (value: boolean) => void;

  onCommentInView: (visible: boolean, commentID: string) => void;

  onEdit: (comment: LiveReplyContainer_comment) => void;
  onCancelEdit: () => void;
  editingCommentID?: string;
}

const LiveCommentRepliesQuery: FunctionComponent<Props> = ({
  commentID,
  storyID,
  cursor,
  tailing,
  setTailing,
  onCommentInView,
  onEdit,
  onCancelEdit,
  editingCommentID,
}) => {
  if (!cursor) {
    return <Spinner />;
  }
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
        if (data.error) {
          return <div>{data.error.message}</div>;
        }
        if (
          !data ||
          !data.props ||
          !data.props.comment ||
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
            tailing={tailing}
            setTailing={setTailing}
            onCommentInView={onCommentInView}
            onEdit={onEdit}
            onCancelEdit={onCancelEdit}
            editingCommentID={editingCommentID}
          />
        );
      }}
    />
  );
};

export default LiveCommentRepliesQuery;
