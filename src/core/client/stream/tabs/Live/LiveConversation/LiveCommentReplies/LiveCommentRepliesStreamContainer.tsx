import React, { FunctionComponent } from "react";
import { graphql } from "react-relay";

import { withFragmentContainer } from "coral-framework/lib/relay";

import { LiveCommentRepliesStreamContainer_comment } from "coral-stream/__generated__/LiveCommentRepliesStreamContainer_comment.graphql";
import { LiveCommentRepliesStreamContainer_settings } from "coral-stream/__generated__/LiveCommentRepliesStreamContainer_settings.graphql";
import { LiveCommentRepliesStreamContainer_story } from "coral-stream/__generated__/LiveCommentRepliesStreamContainer_story.graphql";
import { LiveCommentRepliesStreamContainer_viewer } from "coral-stream/__generated__/LiveCommentRepliesStreamContainer_viewer.graphql";
import { LiveReplyContainer_comment } from "coral-stream/__generated__/LiveReplyContainer_comment.graphql";

import LiveCommentRepliesAfterContainer from "./LiveCommentRepliesAfterContainer";
import LiveCommentRepliesBeforeContainer from "./LiveCommentRepliesBeforeContainer";
import LiveCommentRepliesContainer from "./LiveCommentRepliesContainer";

interface Props {
  story: LiveCommentRepliesStreamContainer_story;
  comment: LiveCommentRepliesStreamContainer_comment;
  viewer: LiveCommentRepliesStreamContainer_viewer | null;
  settings: LiveCommentRepliesStreamContainer_settings;
  cursor: string;

  tailing: boolean;
  setTailing: (value: boolean) => void;

  onCommentInView: (visible: boolean, commentID: string) => void;

  onEdit: (comment: LiveReplyContainer_comment) => void;
  onCancelEdit: () => void;
  editingCommentID?: string;

  newlyPostedReply?: boolean;
  onJumpToLive: () => void;
}

const LiveCommentRepliesStreamContainer: FunctionComponent<Props> = ({
  story,
  comment,
  viewer,
  settings,
  cursor,
  tailing,
  setTailing,
  onCommentInView,
  onEdit,
  onCancelEdit,
  editingCommentID,
  newlyPostedReply,
  onJumpToLive,
}) => {
  return (
    <LiveCommentRepliesBeforeContainer
      comment={comment}
      viewer={viewer}
      cursor={cursor}
    >
      {({
        beforeComments,
        beforeHasMore,
        loadMoreBefore,
        isLoadingMoreBefore,
      }) => (
        <LiveCommentRepliesAfterContainer
          comment={comment}
          viewer={viewer}
          cursor={cursor}
        >
          {({
            afterComments,
            afterHasMore,
            loadMoreAfter,
            isLoadingMoreAfter,
          }) => (
            <LiveCommentRepliesContainer
              beforeComments={beforeComments}
              beforeHasMore={beforeHasMore}
              loadMoreBefore={loadMoreBefore}
              isLoadingMoreBefore={isLoadingMoreBefore}
              afterComments={afterComments}
              afterHasMore={afterHasMore}
              loadMoreAfter={loadMoreAfter}
              isLoadingMoreAfter={isLoadingMoreAfter}
              comment={comment}
              viewer={viewer}
              settings={settings}
              story={story}
              tailing={tailing}
              setTailing={setTailing}
              onCommentInView={onCommentInView}
              onEdit={onEdit}
              onCancelEdit={onCancelEdit}
              editingCommentID={editingCommentID}
              newlyPostedReply={newlyPostedReply}
              onJumpToLive={onJumpToLive}
            />
          )}
        </LiveCommentRepliesAfterContainer>
      )}
    </LiveCommentRepliesBeforeContainer>
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment LiveCommentRepliesStreamContainer_story on Story {
      ...LiveCommentRepliesContainer_story
    }
  `,
  comment: graphql`
    fragment LiveCommentRepliesStreamContainer_comment on Comment
      @argumentDefinitions(cursor: { type: "Cursor" }) {
      ...LiveCommentRepliesBeforeContainer_comment @arguments(cursor: $cursor)
      ...LiveCommentRepliesAfterContainer_comment @arguments(cursor: $cursor)
      ...LiveCommentRepliesContainer_comment
    }
  `,
  viewer: graphql`
    fragment LiveCommentRepliesStreamContainer_viewer on User {
      ...LiveCommentRepliesContainer_viewer
      ...LiveCommentRepliesBeforeContainer_viewer
      ...LiveCommentRepliesAfterContainer_viewer
    }
  `,
  settings: graphql`
    fragment LiveCommentRepliesStreamContainer_settings on Settings {
      ...LiveCommentRepliesContainer_settings
    }
  `,
})(LiveCommentRepliesStreamContainer);

export default enhanced;
