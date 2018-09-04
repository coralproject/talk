import React, { Component } from "react";
import { graphql } from "react-relay";

import { withContext } from "talk-framework/lib/bootstrap";
import { BadUserInputError } from "talk-framework/lib/errors";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { PymStorage } from "talk-framework/lib/storage";
import { PropTypesOf } from "talk-framework/types";
import { ReplyCommentFormContainer_asset as AssetData } from "talk-stream/__generated__/ReplyCommentFormContainer_asset.graphql";
import { ReplyCommentFormContainer_comment as CommentData } from "talk-stream/__generated__/ReplyCommentFormContainer_comment.graphql";

import ReplyCommentForm, {
  ReplyCommentFormProps,
} from "../components/ReplyCommentForm";
import { CreateCommentMutation, withCreateCommentMutation } from "../mutations";

interface InnerProps {
  createComment: CreateCommentMutation;
  pymSessionStorage: PymStorage;
  comment: CommentData;
  asset: AssetData;
  onClose?: () => void;
}

interface State {
  initialValues?: ReplyCommentFormProps["initialValues"];
  initialized: boolean;
}

export class ReplyCommentFormContainer extends Component<InnerProps, State> {
  public state: State = { initialized: false };
  private contextKey = `replyCommentFormBody-${this.props.comment.id}`;

  constructor(props: InnerProps) {
    super(props);
    this.init();
  }

  private async init() {
    const body = await this.props.pymSessionStorage.getItem(this.contextKey);
    if (body) {
      this.setState({
        initialValues: {
          body,
        },
      });
    }
    this.setState({
      initialized: true,
    });
  }

  private handleOnCancel = () => {
    this.props.pymSessionStorage.removeItem(this.contextKey);
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  private handleOnSubmit: ReplyCommentFormProps["onSubmit"] = async (
    input,
    form
  ) => {
    try {
      await this.props.createComment({
        assetID: this.props.asset.id,
        parentID: this.props.comment.id,
        ...input,
      });
      this.props.pymSessionStorage.removeItem(this.contextKey);
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

  private handleOnChange: ReplyCommentFormProps["onChange"] = state => {
    if (state.values.body) {
      this.props.pymSessionStorage.setItem(this.contextKey, state.values.body);
    } else {
      this.props.pymSessionStorage.removeItem(this.contextKey);
    }
  };

  public render() {
    if (!this.state.initialized) {
      return null;
    }
    return (
      <ReplyCommentForm
        onSubmit={this.handleOnSubmit}
        onChange={this.handleOnChange}
        initialValues={this.state.initialValues}
        onCancel={this.handleOnCancel}
      />
    );
  }
}
const enhanced = withContext(({ pymSessionStorage }) => ({
  pymSessionStorage,
}))(
  withCreateCommentMutation(
    withFragmentContainer<InnerProps>({
      asset: graphql`
        fragment ReplyCommentFormContainer_asset on Asset {
          id
        }
      `,
      comment: graphql`
        fragment ReplyCommentFormContainer_comment on Comment {
          id
        }
      `,
    })(ReplyCommentFormContainer)
  )
);
export type PostCommentFormContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
