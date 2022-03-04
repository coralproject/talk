import React, { FunctionComponent, useCallback } from "react";
import { graphql, useFragment } from "react-relay";

import { useViewerEvent } from "coral-framework/lib/events";
import { useMutation } from "coral-framework/lib/relay";
import { ViewConversationEvent } from "coral-stream/events";
import { SetCommentIDMutation } from "coral-stream/mutations";

import { HistoryCommentContainer_comment$key as CommentData } from "coral-stream/__generated__/HistoryCommentContainer_comment.graphql";
import { HistoryCommentContainer_settings$key as SettingsData } from "coral-stream/__generated__/HistoryCommentContainer_settings.graphql";
import { HistoryCommentContainer_story$key as StoryData } from "coral-stream/__generated__/HistoryCommentContainer_story.graphql";

import MediaSectionContainer from "../../Comments/Comment/MediaSection";
import HistoryComment from "./HistoryComment";
import HistoryCommentFooterContainer from "./HistoryCommentFooterContainer";

interface Props {
  story: StoryData;
  comment: CommentData;
  settings: SettingsData;
}

const HistoryCommentContainer: FunctionComponent<Props> = ({
  story,
  comment,
  settings,
}) => {
  const storyData = useFragment(
    graphql`
      fragment HistoryCommentContainer_story on Story {
        id
      }
    `,
    story
  );
  const settingsData = useFragment(
    graphql`
      fragment HistoryCommentContainer_settings on Settings {
        ...HistoryCommentFooterContainer_settings
        ...MediaSectionContainer_settings
      }
    `,
    settings
  );
  const commentData = useFragment(
    graphql`
      fragment HistoryCommentContainer_comment on Comment {
        id
        body
        createdAt
        ...MediaSectionContainer_comment
        parent {
          id
          author {
            username
          }
        }
        rating
        story {
          id
          url
          metadata {
            title
          }
          settings {
            mode
          }
        }
        ...HistoryCommentFooterContainer_comment
      }
    `,
    comment
  );

  const setCommentID = useMutation(SetCommentIDMutation);
  const emitViewConversationEvent = useViewerEvent(ViewConversationEvent);
  const handleGotoConversation = useCallback(
    (e: React.MouseEvent) => {
      if (storyData.id === commentData.story.id) {
        void setCommentID({ id: commentData.id });
        emitViewConversationEvent({
          from: "COMMENT_HISTORY",
          commentID: commentData.id,
        });
        e.preventDefault();
      }
    },
    [
      storyData.id,
      commentData.story.id,
      commentData.id,
      setCommentID,
      emitViewConversationEvent,
    ]
  );

  return (
    <HistoryComment
      {...commentData}
      footer={
        <HistoryCommentFooterContainer
          comment={commentData}
          settings={settingsData}
          onGotoConversation={handleGotoConversation}
        />
      }
      parent={commentData.parent}
      media={
        <MediaSectionContainer comment={commentData} settings={settingsData} />
      }
    />
  );
};

export default HistoryCommentContainer;
