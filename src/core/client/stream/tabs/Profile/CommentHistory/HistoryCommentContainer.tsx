import React from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";
import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "coral-stream/mutations";

import { HistoryCommentContainer_comment as CommentData } from "coral-stream/__generated__/HistoryCommentContainer_comment.graphql";
import { HistoryCommentContainer_settings as SettingsData } from "coral-stream/__generated__/HistoryCommentContainer_settings.graphql";
import { HistoryCommentContainer_story as StoryData } from "coral-stream/__generated__/HistoryCommentContainer_story.graphql";

import HistoryComment from "./HistoryComment";

interface HistoryCommentContainerProps {
  setCommentID: SetCommentIDMutation;
  story: StoryData;
  comment: CommentData;
  settings: SettingsData;
}

export class HistoryCommentContainer extends React.Component<
  HistoryCommentContainerProps
> {
  private handleGoToConversation = (e: React.MouseEvent) => {
    if (this.props.story.id === this.props.comment.story.id) {
      this.props.setCommentID({ id: this.props.comment.id });
      e.preventDefault();
    }
  };
  public render() {
    return (
      <HistoryComment
        {...this.props.comment}
        reactionCount={this.props.comment.actionCounts.reaction.total}
        reactionSettings={this.props.settings.reaction}
        parentAuthorName={
          this.props.comment.parent &&
          this.props.comment.parent.author &&
          this.props.comment.parent.author.username
        }
        conversationURL={getURLWithCommentID(
          this.props.comment.story.url,
          this.props.comment.id
        )}
        onGotoConversation={this.handleGoToConversation}
      />
    );
  }
}

const enhanced = withSetCommentIDMutation(
  withFragmentContainer<HistoryCommentContainerProps>({
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
