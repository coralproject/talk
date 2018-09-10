import { CoralRTE } from "@coralproject/rte";
import React, { Component } from "react";
import { graphql } from "react-relay";

import { isBeforeDate } from "talk-common/utils";
import { withContext } from "talk-framework/lib/bootstrap";
import { BadUserInputError } from "talk-framework/lib/errors";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";

import { EditCommentFormContainer_asset as AssetData } from "talk-stream/__generated__/EditCommentFormContainer_asset.graphql";
import { EditCommentFormContainer_comment as CommentData } from "talk-stream/__generated__/EditCommentFormContainer_comment.graphql";

import EditCommentForm, {
  EditCommentFormProps,
} from "../components/EditCommentForm";
import { EditCommentMutation, withEditCommentMutation } from "../mutations";

interface InnerProps {
  editComment: EditCommentMutation;
  comment: CommentData;
  onClose?: () => void;
  asset: AssetData;
  autofocus: boolean;
}

interface State {
  initialValues?: EditCommentFormProps["initialValues"];
  initialized: boolean;
  expired: boolean;
}

export class EditCommentFormContainer extends Component<InnerProps, State> {
  private expiredTimer: any;

  public state: State = {
    initialized: false,
    expired: !isBeforeDate(this.props.comment.editing.editableUntil),
  };

  constructor(props: InnerProps) {
    super(props);
    this.expiredTimer = this.updateWhenExpired();
  }

  public componentWillUnmount() {
    clearTimeout(this.expiredTimer);
  }

  private updateWhenExpired() {
    const ms =
      new Date(this.props.comment.editing.editableUntil).getTime() - Date.now();
    if (ms > 0) {
      return setTimeout(() => this.setState({ expired: true }), ms);
    }
    return;
  }

  private handleRTERef = (rte: CoralRTE | null) => {
    if (rte && this.props.autofocus) {
      rte.focus();
    }
  };

  private handleOnCancelOrClose = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  private handleOnSubmit: EditCommentFormProps["onSubmit"] = async (
    input,
    form
  ) => {
    try {
      await this.props.editComment({
        assetID: this.props.asset.id,
        commentID: this.props.comment.id,
        body: input.body,
      });
      if (this.props.onClose) {
        this.props.onClose();
      }
    } catch (error) {
      if (error instanceof BadUserInputError) {
        return error.invalidArgsLocalized;
      }
      // tslint:disable-next-line:no-console
      console.error(error);
    }
    return undefined;
  };

  public render() {
    return (
      <EditCommentForm
        id={this.props.comment.id}
        onSubmit={this.handleOnSubmit}
        initialValues={{ body: this.props.comment.body || "" }}
        onCancel={this.handleOnCancelOrClose}
        onClose={this.handleOnCancelOrClose}
        rteRef={this.handleRTERef}
        author={this.props.comment.author}
        createdAt={this.props.comment.createdAt}
        editableUntil={this.props.comment.editing.editableUntil}
        expired={this.state.expired}
      />
    );
  }
}
const enhanced = withContext(({ sessionStorage, browserInfo }) => ({
  // Disable autofocus on ios and enable for the rest.
  autofocus: !browserInfo.ios,
}))(
  withEditCommentMutation(
    withFragmentContainer<InnerProps>({
      asset: graphql`
        fragment EditCommentFormContainer_asset on Asset {
          id
        }
      `,
      comment: graphql`
        fragment EditCommentFormContainer_comment on Comment {
          id
          body
          createdAt
          author {
            username
          }
          editing {
            editableUntil
          }
        }
      `,
    })(EditCommentFormContainer)
  )
);
export type PostCommentFormContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
