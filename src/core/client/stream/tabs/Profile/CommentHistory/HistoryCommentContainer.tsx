import React, { FunctionComponent, useCallback } from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { useViewerEvent } from "coral-framework/lib/events";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { ViewConversationEvent } from "coral-stream/events";
import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "coral-stream/mutations";

import { HistoryCommentContainer_comment as CommentData } from "coral-stream/__generated__/HistoryCommentContainer_comment.graphql";
import { HistoryCommentContainer_settings as SettingsData } from "coral-stream/__generated__/HistoryCommentContainer_settings.graphql";
import { HistoryCommentContainer_story as StoryData } from "coral-stream/__generated__/HistoryCommentContainer_story.graphql";

import HistoryComment from "./HistoryComment";

interface Props {
  setCommentID: SetCommentIDMutation;
  story: StoryData;
  comment: CommentData;
  settings: SettingsData;
}

const HistoryCommentContainer: FunctionComponent<Props> = props => {
  const emitViewConversationEvent = useViewerEvent(ViewConversationEvent);
  const handleGotoConversation = useCallback(
    (e: React.MouseEvent) => {
      if (props.story.id === props.comment.story.id) {
        props.setCommentID({ id: props.comment.id });
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
      reactionCount={props.comment.actionCounts.reaction.total}
      reactionSettings={props.settings.reaction}
      parentAuthorName={
        props.comment.parent &&
        props.comment.parent.author &&
        props.comment.parent.author.username
      }
      conversationURL={getURLWithCommentID(
        props.comment.story.url,
        props.comment.id
      )}
      onGotoConversation={handleGotoConversation}
    />
  );
};

const enhanced = withSetCommentIDMutation(
  withFragmentContainer<Props>({
    story: graphql`
      fragment HistoryCommentContainer_story on Story {
        id
      }
    `,
    settings: graphql`
      fragment HistoryCommentContainer_settings on Settings {
        reaction {
          label
          icon
        }
      }
    `,
    comment: graphql`
      fragment HistoryCommentContainer_comment on Comment {
        id
        body
        createdAt
        replyCount
        parent {
          author {
            username
          }
        }
        story {
          id
          url
          metadata {
            title
          }
        }
        actionCounts {
          reaction {
            total
          }
        }
      }
    `,
  })(HistoryCommentContainer)
);

export default enhanced;
