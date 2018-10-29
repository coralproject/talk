import { CoralRTE } from "@coralproject/rte";
import React, { Component } from "react";
import { graphql } from "react-relay";

import { withContext } from "talk-framework/lib/bootstrap";
import { BadUserInputError } from "talk-framework/lib/errors";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { PromisifiedStorage } from "talk-framework/lib/storage";
import { PropTypesOf } from "talk-framework/types";
import { ReplyCommentFormContainer_comment as CommentData } from "talk-stream/__generated__/ReplyCommentFormContainer_comment.graphql";
import { ReplyCommentFormContainer_story as StoryData } from "talk-stream/__generated__/ReplyCommentFormContainer_story.graphql";
import {
  CreateCommentMutation,
  withCreateCommentMutation,
} from "talk-stream/mutations";

import ReplyCommentForm, {
  ReplyCommentFormProps,
} from "../components/ReplyCommentForm";

interface InnerProps {
  createComment: CreateCommentMutation;
  sessionStorage: PromisifiedStorage;
  comment: CommentData;
  story: StoryData;
  onClose?: () => void;
  autofocus: boolean;
  localReply?: boolean;
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

  private handleRTERef = (rte: CoralRTE | null) => {
    if (rte && this.props.autofocus) {
      rte.focus();
    }
  };

  private async init() {
    const body = await this.props.sessionStorage.getItem(this.contextKey);
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
    this.props.sessionStorage.removeItem(this.contextKey);
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
        storyID: this.props.story.id,
        parentID: this.props.comment.id,
        local: this.props.localReply,
        ...input,
      });

      this.props.sessionStorage.removeItem(this.contextKey);
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
      this.props.sessionStorage.setItem(this.contextKey, state.values.body);
    } else {
      this.props.sessionStorage.removeItem(this.contextKey);
    }
  };

  public render() {
    if (!this.state.initialized) {
      return null;
    }
    return (
      <ReplyCommentForm
        id={this.props.comment.id}
        onSubmit={this.handleOnSubmit}
        onChange={this.handleOnChange}
        initialValues={this.state.initialValues}
        onCancel={this.handleOnCancel}
        rteRef={this.handleRTERef}
        parentUsername={
          this.props.comment.author && this.props.comment.author.username
        }
      />
    );
  }
}
const enhanced = withContext(({ sessionStorage, browserInfo }) => ({
  sessionStorage,
  // Disable autofocus on ios and enable for the rest.
  autofocus: !browserInfo.ios,
}))(
  withCreateCommentMutation(
    withFragmentContainer<InnerProps>({
      story: graphql`
        fragment ReplyCommentFormContainer_story on Story {
          id
        }
      `,
      comment: graphql`
        fragment ReplyCommentFormContainer_comment on Comment {
          id
          author {
            username
          }
        }
      `,
    })(ReplyCommentFormContainer)
  )
);
export type PostCommentFormContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
