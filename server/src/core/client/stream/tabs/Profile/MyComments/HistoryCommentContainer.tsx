import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { useViewerEvent } from "coral-framework/lib/events";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import { ViewConversationEvent } from "coral-stream/events";
import { SetCommentIDMutation } from "coral-stream/mutations";

import { HistoryCommentContainer_comment as CommentData } from "coral-stream/__generated__/HistoryCommentContainer_comment.graphql";
import { HistoryCommentContainer_settings as SettingsData } from "coral-stream/__generated__/HistoryCommentContainer_settings.graphql";
import { HistoryCommentContainer_story as StoryData } from "coral-stream/__generated__/HistoryCommentContainer_story.graphql";

import MediaSectionContainer from "../../Comments/Comment/MediaSection";
import HistoryComment from "./HistoryComment";
import HistoryCommentFooterContainer from "./HistoryCommentFooterContainer";

interface Props {
  story: StoryData;
  comment: CommentData;
  settings: SettingsData;
}

const HistoryCommentContainer: FunctionComponent<Props> = (props) => {
  const setCommentID = useMutation(SetCommentIDMutation);
  const emitViewConversationEvent = useViewerEvent(ViewConversationEvent);
  const handleGotoConversation = useCallback(
    (e: React.MouseEvent) => {
      if (props.story.id === props.comment.story.id) {
        void setCommentID({ id: props.comment.id });
        emitViewConversationEvent({
          from: "COMMENT_HISTORY",
          commentID: props.comment.id,
        });
        e.preventDefault();
      }
    },
    [props.story.id, props.comment.story.id]
  );

  return (
    <HistoryComment
      {...props.comment}
      footer={
        <HistoryCommentFooterContainer
          comment={props.comment}
          settings={props.settings}
          onGotoConversation={handleGotoConversation}
        />
      }
      parent={props.comment.parent}
      media={
        <MediaSectionContainer
          comment={props.comment}
          settings={props.settings}
        />
      }
    />
  );
};

const enhanced = withFragmentContainer<Props>({
  story: graphql`
    fragment HistoryCommentContainer_story on Story {
      id
    }
  `,
  settings: graphql`
    fragment HistoryCommentContainer_settings on Settings {
      ...HistoryCommentFooterContainer_settings
      ...MediaSectionContainer_settings
    }
  `,
  comment: graphql`
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
})(HistoryCommentContainer);

export default enhanced;
