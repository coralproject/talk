import { CoralRTE } from "@coralproject/rte";
import React, { Component } from "react";
import { graphql } from "react-relay";

import { withContext } from "talk-framework/lib/bootstrap";
import { InvalidRequestError } from "talk-framework/lib/errors";
import { withFragmentContainer } from "talk-framework/lib/relay";
import { PromisifiedStorage } from "talk-framework/lib/storage";
import { PropTypesOf } from "talk-framework/types";
import { ReplyCommentFormContainer_comment as CommentData } from "talk-stream/__generated__/ReplyCommentFormContainer_comment.graphql";
import { ReplyCommentFormContainer_settings as SettingsData } from "talk-stream/__generated__/ReplyCommentFormContainer_settings.graphql";
import { ReplyCommentFormContainer_story as StoryData } from "talk-stream/__generated__/ReplyCommentFormContainer_story.graphql";
import {
  RefreshSettingsFetch,
  withRefreshSettingsFetch,
} from "talk-stream/fetches";
import {
  CreateCommentReplyMutation,
  withCreateCommentReplyMutation,
} from "talk-stream/mutations";

import ReplyCommentForm, {
  ReplyCommentFormProps,
} from "../components/ReplyCommentForm";
import ReplyEditSubmitStatus from "../components/ReplyEditSubmitStatus";
import {
  getSubmitStatus,
  shouldTriggerSettingsRefresh,
  SubmitStatus,
} from "../helpers";

interface Props {
  createCommentReply: CreateCommentReplyMutation;
  sessionStorage: PromisifiedStorage;
  comment: CommentData;
  settings: SettingsData;
  story: StoryData;
  onClose?: () => void;
  autofocus: boolean;
  localReply?: boolean;
  refreshSettings: RefreshSettingsFetch;
}

interface State {
  initialValues?: ReplyCommentFormProps["initialValues"];
  initialized: boolean;
  submitStatus: SubmitStatus | null;
}

export class ReplyCommentFormContainer extends Component<Props, State> {
  public state: State = {
    initialized: false,
    submitStatus: null,
  };
  private contextKey = `replyCommentFormBody-${this.props.comment.id}`;

  constructor(props: Props) {
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

  private handleOnCancelOrDismiss = () => {
    this.props.sessionStorage.removeItem(this.contextKey);
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  private handleOnSubmit: ReplyCommentFormProps["onSubmit"] = async input => {
    try {
      const submitStatus = getSubmitStatus(
        await this.props.createCommentReply({
          storyID: this.props.story.id,
          parentID: this.props.comment.id,
          parentRevisionID: this.props.comment.revision.id,
          local: this.props.localReply,
          ...input,
        })
      );
      if (submitStatus !== "RETRY") {
        this.props.sessionStorage.removeItem(this.contextKey);
        if (submitStatus === "APPROVED" && this.props.onClose) {
          this.props.onClose();
          return;
        }
      }
      this.setState({ submitStatus });
    } catch (error) {
      if (error instanceof InvalidRequestError) {
        if (shouldTriggerSettingsRefresh(error.code)) {
          await this.props.refreshSettings({ storyID: this.props.story.id });
        }
        return error.invalidArgs;
      }
      // tslint:disable-next-line:no-console
      console.error(error);
    }
    return;
  };

  private handleOnChange: ReplyCommentFormProps["onChange"] = (state, form) => {
    if (state.values.body) {
      this.props.sessionStorage.setItem(this.contextKey, state.values.body);
    } else {
      this.props.sessionStorage.removeItem(this.contextKey);
    }
    // Reset errors whenever user clears the form.
    if (state.touched && state.touched.body && !state.values.body) {
      form.reset({});
    }
  };

  public render() {
    if (!this.state.initialized) {
      return null;
    }
    if (this.state.submitStatus && this.state.submitStatus !== "RETRY") {
      return (
        <ReplyEditSubmitStatus
          status={this.state.submitStatus}
          onDismiss={this.handleOnCancelOrDismiss}
        />
      );
    }
    return (
      <ReplyCommentForm
        id={this.props.comment.id}
        onSubmit={this.handleOnSubmit}
        onChange={this.handleOnChange}
        initialValues={this.state.initialValues}
        onCancel={this.handleOnCancelOrDismiss}
        rteRef={this.handleRTERef}
        parentUsername={
          this.props.comment.author && this.props.comment.author.username
        }
        min={
          (this.props.settings.charCount.enabled &&
            this.props.settings.charCount.min) ||
          null
        }
        max={
          (this.props.settings.charCount.enabled &&
            this.props.settings.charCount.max) ||
          null
        }
        disabled={
          this.props.settings.disableCommenting.enabled ||
          this.props.story.isClosed
        }
        disabledMessage={
          (this.props.settings.disableCommenting.enabled &&
            this.props.settings.disableCommenting.message) ||
          this.props.settings.closedMessage
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
  withRefreshSettingsFetch(
    withCreateCommentReplyMutation(
      withFragmentContainer<Props>({
        settings: graphql`
          fragment ReplyCommentFormContainer_settings on Settings {
            charCount {
              enabled
              min
              max
            }
            disableCommenting {
              enabled
              message
            }
            closedMessage
          }
        `,
        story: graphql`
          fragment ReplyCommentFormContainer_story on Story {
            id
            isClosed
          }
        `,
        comment: graphql`
          fragment ReplyCommentFormContainer_comment on Comment {
            id
            author {
              username
            }
            revision {
              id
            }
          }
        `,
      })(ReplyCommentFormContainer)
    )
  )
);
export type PostCommentFormContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
