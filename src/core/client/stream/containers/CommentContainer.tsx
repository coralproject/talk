import React, { Component } from "react";
import { graphql } from "react-relay";

import withFragmentContainer from "talk-framework/lib/relay/withFragmentContainer";
import { PropTypesOf } from "talk-framework/types";
import { CommentContainer_asset as AssetData } from "talk-stream/__generated__/CommentContainer_asset.graphql";
import { CommentContainer_comment as CommentData } from "talk-stream/__generated__/CommentContainer_comment.graphql";

import Comment from "../components/Comment";
import ReplyButton from "../components/Comment/ReplyButton";
import ReplyCommentFormContainer from ".//ReplyCommentFormContainer";
import PermalinkButtonContainer from "./PermalinkButtonContainer";

interface InnerProps {
  comment: CommentData;
  asset: AssetData;
  indentLevel?: number;
}

interface State {
  showReplyDialog: boolean;
}

export class CommentContainer extends Component<InnerProps, State> {
  public state = {
    showReplyDialog: false,
  };

  private openReplyDialog = () => {
    this.setState(state => ({
      showReplyDialog: true,
    }));
  };

  private closeReplyDialog = () => {
    this.setState(state => ({
      showReplyDialog: false,
    }));
  };

  public render() {
    const { comment, asset, ...rest } = this.props;
    const { showReplyDialog } = this.state;
    return (
      <>
        <Comment
          {...rest}
          {...comment}
          footer={
            <>
              <ReplyButton
                id={`comments-commentContainer-replyButton-${comment.id}`}
                onClick={this.openReplyDialog}
                active={showReplyDialog}
              />
              <PermalinkButtonContainer commentID={comment.id} />
            </>
          }
        />
        {showReplyDialog && (
          <ReplyCommentFormContainer
            comment={comment}
            asset={asset}
            onClose={this.closeReplyDialog}
          />
        )}
      </>
    );
  }
}

const enhanced = withFragmentContainer<InnerProps>({
  asset: graphql`
    fragment CommentContainer_asset on Asset {
      ...ReplyCommentFormContainer_asset
    }
  `,
  comment: graphql`
    fragment CommentContainer_comment on Comment {
      id
      author {
        username
      }
      body
      createdAt
      ...ReplyCommentFormContainer_comment
    }
  `,
})(CommentContainer);

export type CommentContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
