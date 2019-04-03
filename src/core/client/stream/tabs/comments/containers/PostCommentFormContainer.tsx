import { FORM_ERROR } from "final-form";
import React, { Component } from "react";

import { withContext } from "talk-framework/lib/bootstrap";
import {
  InvalidRequestError,
  ModerationNudgeError,
} from "talk-framework/lib/errors";
import {
  graphql,
  withFragmentContainer,
  withLocalStateContainer,
} from "talk-framework/lib/relay";
import { PromisifiedStorage } from "talk-framework/lib/storage";
import { PropTypesOf } from "talk-framework/types";
import { PostCommentFormContainer_settings as SettingsData } from "talk-stream/__generated__/PostCommentFormContainer_settings.graphql";
import { PostCommentFormContainer_story as StoryData } from "talk-stream/__generated__/PostCommentFormContainer_story.graphql";
import { PostCommentFormContainerLocal as Local } from "talk-stream/__generated__/PostCommentFormContainerLocal.graphql";
import {
  RefreshSettingsFetch,
  withRefreshSettingsFetch,
} from "talk-stream/fetches";
import {
  CreateCommentMutation,
  withCreateCommentMutation,
} from "talk-stream/mutations";

import PostCommentForm from "../components/PostCommentForm";
import PostCommentFormClosed from "../components/PostCommentFormClosed";
import PostCommentFormClosedSitewide from "../components/PostCommentFormClosedSitewide";
import PostCommentFormFake from "../components/PostCommentFormFake";
import {
  getSubmitStatus,
  shouldTriggerSettingsRefresh,
  SubmitStatus,
} from "../helpers";

interface Props {
  createComment: CreateCommentMutation;
  refreshSettings: RefreshSettingsFetch;
  sessionStorage: PromisifiedStorage;
  settings: SettingsData;
  local: Local;
  story: StoryData;
}

interface State {
  /** nudge will turn on the nudging behavior on the server */
  nudge: boolean;
  initialValues?: PropTypesOf<typeof PostCommentForm>["initialValues"];
  initialized: boolean;
  keepFormWhenClosed: boolean;
  submitStatus: SubmitStatus | null;
}

const contextKey = "postCommentFormBody";

export class PostCommentFormContainer extends Component<Props, State> {
  public state: State = {
    initialized: false,
    nudge: true,
    keepFormWhenClosed:
      this.props.local.loggedIn &&
      !this.props.story.isClosed &&
      !this.props.settings.disableCommenting.enabled,
    submitStatus: null,
  };

  constructor(props: Props) {
    super(props);
    this.init();
  }

  private async init() {
    const body = await this.props.sessionStorage.getItem(contextKey);
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

  private disableNudge = () => {
    if (this.state.nudge) {
      this.setState({ nudge: false });
    }
  };

  private handleOnSubmit: PropTypesOf<
    typeof PostCommentForm
  >["onSubmit"] = async (input, form) => {
    try {
      const submitStatus = getSubmitStatus(
        await this.props.createComment({
          storyID: this.props.story.id,
          nudge: this.state.nudge,
          ...input,
        })
      );
      if (submitStatus !== "RETRY") {
        form.reset({});
      }
      this.setState({ submitStatus, nudge: true });
    } catch (error) {
      if (error instanceof InvalidRequestError) {
        if (shouldTriggerSettingsRefresh(error.code)) {
          await this.props.refreshSettings({ storyID: this.props.story.id });
        }
        return error.invalidArgs;
      }
      /**
       * Comment was caught in one of the moderation filters on the server.
       * We give the user another change to submit the comment, and we
       * turn off the nudging behavior on the next try.
       */
      if (error instanceof ModerationNudgeError) {
        this.disableNudge();
        return { [FORM_ERROR]: error.message };
      }
      // tslint:disable-next-line:no-console
      console.error(error);
    }
    return;
  };

  private handleOnChange: PropTypesOf<typeof PostCommentForm>["onChange"] = (
    state,
    form
  ) => {
    if (this.state.submitStatus && state.dirty) {
      this.setState({ submitStatus: null });
    }
    if (state.values.body) {
      this.props.sessionStorage.setItem(contextKey, state.values.body);
    } else {
      this.props.sessionStorage.removeItem(contextKey);
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
    if (!this.state.keepFormWhenClosed) {
      if (this.props.settings.disableCommenting.enabled) {
        return (
          <PostCommentFormClosedSitewide
            story={this.props.story}
            message={this.props.settings.disableCommenting.message}
            showMessageBox={this.props.story.settings.messageBox.enabled}
          />
        );
      }
      if (this.props.story.isClosed) {
        return (
          <PostCommentFormClosed
            story={this.props.story}
            message={this.props.settings.closeCommenting.message}
            showMessageBox={this.props.story.settings.messageBox.enabled}
          />
        );
      }
    }
    if (!this.props.local.loggedIn) {
      return (
        <PostCommentFormFake
          story={this.props.story}
          showMessageBox={this.props.story.settings.messageBox.enabled}
        />
      );
    }
    return (
      <PostCommentForm
        story={this.props.story}
        onSubmit={this.handleOnSubmit}
        onChange={this.handleOnChange}
        initialValues={this.state.initialValues}
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
          this.props.settings.closeCommenting.message
        }
        submitStatus={this.state.submitStatus}
        showMessageBox={this.props.story.settings.messageBox.enabled}
      />
    );
  }
}

const enhanced = withContext(({ sessionStorage }) => ({
  sessionStorage,
}))(
  withCreateCommentMutation(
    withRefreshSettingsFetch(
      withLocalStateContainer(
        graphql`
          fragment PostCommentFormContainerLocal on Local {
            loggedIn
          }
        `
      )(
        withFragmentContainer<Props>({
          settings: graphql`
            fragment PostCommentFormContainer_settings on Settings {
              charCount {
                enabled
                min
                max
              }
              disableCommenting {
                enabled
                message
              }
              closeCommenting {
                message
              }
            }
          `,
          story: graphql`
            fragment PostCommentFormContainer_story on Story {
              id
              isClosed
              ...MessageBoxContainer_story
              settings {
                messageBox {
                  enabled
                }
              }
            }
          `,
        })(PostCommentFormContainer)
      )
    )
  )
);
export type PostCommentFormContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
