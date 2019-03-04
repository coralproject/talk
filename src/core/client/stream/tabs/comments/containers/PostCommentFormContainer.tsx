import React, { Component } from "react";

import { withContext } from "talk-framework/lib/bootstrap";
import { InvalidRequestError } from "talk-framework/lib/errors";
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

import PostCommentForm, {
  PostCommentFormProps,
} from "../components/PostCommentForm";
import PostCommentFormCollapsed from "../components/PostCommentFormCollapsed";
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
  initialValues?: PostCommentFormProps["initialValues"];
  initialized: boolean;
  keepFormWhenClosed: boolean;
  submitStatus: SubmitStatus | null;
}

const contextKey = "postCommentFormBody";

export class PostCommentFormContainer extends Component<Props, State> {
  public state: State = {
    initialized: false,
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

  private handleOnSubmit: PostCommentFormProps["onSubmit"] = async (
    input,
    form
  ) => {
    try {
      const submitStatus = getSubmitStatus(
        await this.props.createComment({
          storyID: this.props.story.id,
          ...input,
        })
      );
      if (submitStatus !== "RETRY") {
        form.reset({});
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

  private handleOnChange: PostCommentFormProps["onChange"] = (state, form) => {
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
    if (
      !this.state.keepFormWhenClosed &&
      (this.props.settings.disableCommenting.enabled ||
        this.props.story.isClosed)
    ) {
      return (
        <PostCommentFormCollapsed
          closedSitewide={this.props.settings.disableCommenting.enabled}
          closedMessage={
            (this.props.settings.disableCommenting.enabled &&
              this.props.settings.disableCommenting.message) ||
            this.props.settings.closedMessage
          }
        />
      );
    }
    if (!this.props.local.loggedIn) {
      return <PostCommentFormFake />;
    }
    return (
      <PostCommentForm
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
          this.props.settings.closedMessage
        }
        submitStatus={this.state.submitStatus}
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
              closedMessage
            }
          `,
          story: graphql`
            fragment PostCommentFormContainer_story on Story {
              id
              isClosed
            }
          `,
        })(PostCommentFormContainer)
      )
    )
  )
);
export type PostCommentFormContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
