import React from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "coral-framework/helpers";
import { withFragmentContainer } from "coral-framework/lib/relay";
import { HistoryCommentContainer_comment as CommentData } from "coral-stream/__generated__/HistoryCommentContainer_comment.graphql";
import { HistoryCommentContainer_story as StoryData } from "coral-stream/__generated__/HistoryCommentContainer_story.graphql";
import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "coral-stream/mutations";
import HistoryComment from "../components/HistoryComment";

interface HistoryCommentContainerProps {
  setCommentID: SetCommentIDMutation;
  story: StoryData;
  comment: CommentData;
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
    comment: graphql`
      fragment HistoryCommentContainer_comment on Comment {
        id
        body
        createdAt
        replyCount
        story {
          id
          url
          metadata {
            title
          }
        }
      }
    `,
  })(HistoryCommentContainer)
);

export default enhanced;
