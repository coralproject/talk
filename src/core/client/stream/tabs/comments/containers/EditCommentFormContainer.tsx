import { CoralRTE } from "@coralproject/rte";
import React, { Component } from "react";
import { graphql } from "react-relay";

import { isBeforeDate } from "talk-common/utils";
import { withContext } from "talk-framework/lib/bootstrap";
import { InvalidRequestError } from "talk-framework/lib/errors";
import {
  FetchProp,
  withFetch,
  withFragmentContainer,
} from "talk-framework/lib/relay";
import { PropTypesOf } from "talk-framework/types";
import { RefreshSettingsFetch } from "talk-stream/fetches";

import { EditCommentFormContainer_comment as CommentData } from "talk-stream/__generated__/EditCommentFormContainer_comment.graphql";
import { EditCommentFormContainer_settings as SettingsData } from "talk-stream/__generated__/EditCommentFormContainer_settings.graphql";
import { EditCommentFormContainer_story as StoryData } from "talk-stream/__generated__/EditCommentFormContainer_story.graphql";
import {
  EditCommentMutation,
  withEditCommentMutation,
} from "talk-stream/mutations";

import EditCommentForm, {
  EditCommentFormProps,
} from "../components/EditCommentForm";
import ReplyEditSubmitStatus from "../components/ReplyEditSubmitStatus";
import {
  getSubmitStatus,
  shouldTriggerSettingsRefresh,
  SubmitStatus,
} from "../helpers";

interface Props {
  editComment: EditCommentMutation;
  comment: CommentData;
  settings: SettingsData;
  story: StoryData;
  onClose?: () => void;
  autofocus: boolean;
  refreshSettings: FetchProp<typeof RefreshSettingsFetch>;
}

interface State {
  initialValues?: EditCommentFormProps["initialValues"];
  initialized: boolean;
  expired: boolean;
  submitStatus: SubmitStatus | null;
}

export class EditCommentFormContainer extends Component<Props, State> {
  private expiredTimer: any;

  public state: State = {
    initialized: false,
    expired: !isBeforeDate(this.props.comment.editing.editableUntil),
    submitStatus: null,
  };

  constructor(props: Props) {
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
      const submitStatus = getSubmitStatus(
        await this.props.editComment({
          commentID: this.props.comment.id,
          body: input.body,
        })
      );
      if (submitStatus !== "RETRY") {
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

  public render() {
    if (this.state.submitStatus && this.state.submitStatus !== "RETRY") {
      return (
        <ReplyEditSubmitStatus
          status={this.state.submitStatus}
          onDismiss={this.handleOnCancelOrClose}
        />
      );
    }
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
      />
    );
  }
}
const enhanced = withContext(({ sessionStorage, browserInfo }) => ({
  // Disable autofocus on ios and enable for the rest.
  autofocus: !browserInfo.ios,
}))(
  withFetch(RefreshSettingsFetch)(
    withEditCommentMutation(
      withFragmentContainer<Props>({
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
        story: graphql`
          fragment EditCommentFormContainer_story on Story {
            id
          }
        `,
        settings: graphql`
          fragment EditCommentFormContainer_settings on Settings {
            charCount {
              enabled
              min
              max
            }
          }
        `,
      })(EditCommentFormContainer)
    )
  )
);
export type PostCommentFormContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
