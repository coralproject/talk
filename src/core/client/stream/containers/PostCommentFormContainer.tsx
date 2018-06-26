import React, { Component } from "react";

import { BadUserInputError } from "talk-framework/lib/errors";
import { PropTypesOf } from "talk-framework/types";

import PostCommentForm, {
  PostCommentFormProps,
} from "../components/PostCommentForm";
import { PostCommentMutation, withPostCommentMutation } from "../mutations";

interface InnerProps {
  postComment: PostCommentMutation;
}

class PostCommentFormContainer extends Component<InnerProps> {
  private onSubmit: PostCommentFormProps["onSubmit"] = async (input, form) => {
    try {
      await this.props.postComment(input);
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

const enhanced = withPostCommentMutation(PostCommentFormContainer);
export type PostCommentFormContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
