import React, { Component } from "react";

import { BadUserInputError } from "talk-framework/lib/errors";
import { PropTypesOf } from "talk-framework/types";

import PostCommentForm, {
  PostCommentFormProps,
} from "../components/PostCommentForm";
import { CreateCommentMutation, withCreateCommentMutation } from "../mutations";

interface InnerProps {
  createComment: CreateCommentMutation;
  assetID: string;
}

class PostCommentFormContainer extends Component<InnerProps> {
  private onSubmit: PostCommentFormProps["onSubmit"] = async (input, form) => {
    try {
      await this.props.createComment({
        assetID: this.props.assetID,
        ...input,
      });
      form.reset();
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
    return <PostCommentForm onSubmit={this.onSubmit} />;
  }
}

const enhanced = withCreateCommentMutation(PostCommentFormContainer);
export type PostCommentFormContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
