import React from "react";
import { graphql } from "react-relay";

import { getURLWithCommentID } from "talk-framework/helpers";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { HistoryCommentContainer_asset as AssetData } from "talk-stream/__generated__/HistoryCommentContainer_asset.graphql";
import { HistoryCommentContainer_comment as CommentData } from "talk-stream/__generated__/HistoryCommentContainer_comment.graphql";
import {
  SetCommentIDMutation,
  withSetCommentIDMutation,
} from "talk-stream/mutations";
import HistoryComment from "../components/HistoryComment";

interface HistoryCommentContainerProps {
  setCommentID: SetCommentIDMutation;
  asset: AssetData;
  comment: CommentData;
}

export class HistoryCommentContainer extends React.Component<
  HistoryCommentContainerProps
> {
  private handleGoToConversation = (e: React.MouseEvent) => {
    if (this.props.asset.id === this.props.comment.asset.id) {
      this.props.setCommentID({ id: this.props.comment.id });
      e.preventDefault();
    }
  };
  public render() {
    return (
      <HistoryComment
        {...this.props.comment}
        conversationURL={getURLWithCommentID(
          this.props.comment.asset.url,
          this.props.comment.id
        )}
        onGotoConversation={this.handleGoToConversation}
      />
    );
  }
}

const enhanced = withSetCommentIDMutation(
  withFragmentContainer<HistoryCommentContainerProps>({
    asset: graphql`
      fragment HistoryCommentContainer_asset on Asset {
        id
      }
    `,
    comment: graphql`
      fragment HistoryCommentContainer_comment on Comment {
        id
        body
        createdAt
        replyCount
        asset {
          id
          title
          url
        }
      }
    `,
  })(HistoryCommentContainer)
);

export default enhanced;
