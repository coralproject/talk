import { Localized } from "fluent-react/compat";
import React, { Component } from "react";
import { graphql } from "react-relay";

import { isBeforeDate } from "talk-common/utils";
import withFragmentContainer from "talk-framework/lib/relay/withFragmentContainer";
import { PropTypesOf } from "talk-framework/types";
import { CommentContainer_asset as AssetData } from "talk-stream/__generated__/CommentContainer_asset.graphql";
import { CommentContainer_comment as CommentData } from "talk-stream/__generated__/CommentContainer_comment.graphql";
import { CommentContainer_me as MeData } from "talk-stream/__generated__/CommentContainer_me.graphql";
import {
  ShowAuthPopupMutation,
  withShowAuthPopupMutation,
} from "talk-stream/mutations";

import { Button } from "talk-ui/components";
import Comment from "../components/Comment";
import ReplyButton from "../components/Comment/ReplyButton";
import EditCommentFormContainer from "./EditCommentFormContainer";
import PermalinkButtonContainer from "./PermalinkButtonContainer";
import ReplyCommentFormContainer from "./ReplyCommentFormContainer";

interface InnerProps {
  me: MeData | null;
  comment: CommentData;
  asset: AssetData;
  indentLevel?: number;
  showAuthPopup: ShowAuthPopupMutation;
}

interface State {
  showReplyDialog: boolean;
  showEditDialog: boolean;
  editable: boolean;
}

export class CommentContainer extends Component<InnerProps, State> {
  private uneditableTimer: any;

  public state = {
    showReplyDialog: false,
    showEditDialog: false,
    editable: isBeforeDate(this.props.comment.editing.editableUntil),
  };

  constructor(props: InnerProps) {
    super(props);
    this.uneditableTimer = this.updateWhenNotEditable();
  }

  public componentWillUnmount() {
    clearTimeout(this.uneditableTimer);
  }

  private openReplyDialog = () => {
    if (this.props.me) {
      this.setState(state => ({
        showReplyDialog: true,
      }));
    } else {
      this.props.showAuthPopup({ view: "SIGN_IN" });
    }
  };

  private openEditDialog = () => {
    if (this.props.me) {
      this.setState(state => ({
        showEditDialog: true,
      }));
    } else {
      this.props.showAuthPopup({ view: "SIGN_IN" });
    }
  };

  private closeEditDialog = () => {
    this.setState(state => ({
      showEditDialog: false,
    }));
  };

  private closeReplyDialog = () => {
    this.setState(state => ({
      showReplyDialog: false,
    }));
  };

  private updateWhenNotEditable() {
    const ms =
      new Date(this.props.comment.editing.editableUntil).getTime() - Date.now();
    if (ms > 0) {
      return setTimeout(() => this.setState({ editable: false }), ms);
    }
    return;
  }

  public render() {
    const { comment, asset, indentLevel } = this.props;
    const { showReplyDialog, showEditDialog, editable } = this.state;
    if (showEditDialog) {
      return (
        <EditCommentFormContainer
          asset={asset}
          comment={comment}
          onClose={this.closeEditDialog}
        />
      );
    }
    return (
      <>
        <Comment
          indentLevel={indentLevel}
          author={comment.author}
          body={comment.body}
          createdAt={comment.createdAt}
          topBarRight={
            (editable && (
              <Localized id="comments-commentContainer-editButton">
                <Button
                  id={`comments-commentContainer-editButton-${comment.id}`}
                  color="primary"
                  variant="underlined"
                  onClick={this.openEditDialog}
                >
                  Edit
                </Button>
              </Localized>
            )) ||
            undefined
          }
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

const enhanced = withShowAuthPopupMutation(
  withFragmentContainer<InnerProps>({
    me: graphql`
      fragment CommentContainer_me on User {
        __typename
      }
    `,
    asset: graphql`
      fragment CommentContainer_asset on Asset {
        ...ReplyCommentFormContainer_asset
        ...EditCommentFormContainer_asset
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
        editing {
          editableUntil
        }
        ...ReplyCommentFormContainer_comment
        ...EditCommentFormContainer_comment
      }
    `,
  })(CommentContainer)
);

export type CommentContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
