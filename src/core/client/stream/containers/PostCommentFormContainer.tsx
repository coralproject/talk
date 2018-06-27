import React, { Component } from "react";

import { BadUserInputError } from "talk-framework/lib/errors";
import { PropTypesOf } from "talk-framework/types";

import PostCommentForm, {
  PostCommentFormProps,
} from "../components/PostCommentForm";
import { CreateCommentMutation, withCreateCommentMutation } from "../mutations";

interface InnerProps {
  createComment: CreateCommentMutation;
}

class PostCommentFormContainer extends Component<InnerProps> {
  private onSubmit: PostCommentFormProps["onSubmit"] = async (input, form) => {
    try {
      await this.props.createComment({
        // TODO: assetID must be set.
        assetID: null,
        ...input,
      });
      form.reset();
    } catch (error) {
      if (error instanceof BadUserInputError) {
        return error.invalidArgsLocalized;
      }
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
