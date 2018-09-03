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
}

interface State {
  showReplyDialog: boolean;
}

export class CommentContainer extends Component<InnerProps, State> {
  public state = {
    showReplyDialog: false,
  };

  private toggleReplyDialog = () => {
    this.setState(state => ({
      showReplyDialog: !state.showReplyDialog,
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
                onClick={this.toggleReplyDialog}
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
            onCancel={this.toggleReplyDialog}
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
