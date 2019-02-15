import React, { Component } from "react";

import { withContext } from "talk-framework/lib/bootstrap";
import { InvalidRequestError } from "talk-framework/lib/errors";
import { graphql, withFragmentContainer } from "talk-framework/lib/relay";
import { PromisifiedStorage } from "talk-framework/lib/storage";
import { PropTypesOf } from "talk-framework/types";
import { PostCommentFormContainer_settings as SettingsData } from "talk-stream/__generated__/PostCommentFormContainer_settings.graphql";
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
import { shouldTriggerSettingsRefresh } from "../helpers";

interface Props {
  createComment: CreateCommentMutation;
  refreshSettings: RefreshSettingsFetch;
  storyID: string;
  sessionStorage: PromisifiedStorage;
  settings: SettingsData;
}

interface State {
  initialValues?: PostCommentFormProps["initialValues"];
  initialized: boolean;
}

const contextKey = "postCommentFormBody";

export class PostCommentFormContainer extends Component<Props, State> {
  public state: State = { initialized: false };

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
      await this.props.createComment({
        storyID: this.props.storyID,
        ...input,
      });
      form.reset({});
    } catch (error) {
      if (error instanceof InvalidRequestError) {
        if (shouldTriggerSettingsRefresh(error.code)) {
          await this.props.refreshSettings();
        }
        return error.invalidArgs;
      }
      // tslint:disable-next-line:no-console
      console.error(error);
    }
    return undefined;
  };

  private handleOnChange: PostCommentFormProps["onChange"] = (state, form) => {
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
      />
    );
  }
}

const enhanced = withContext(({ sessionStorage }) => ({
  sessionStorage,
}))(
  withCreateCommentMutation(
    withRefreshSettingsFetch(
      withFragmentContainer<Props>({
        settings: graphql`
          fragment PostCommentFormContainer_settings on Settings {
            charCount {
              enabled
              min
              max
            }
          }
        `,
      })(PostCommentFormContainer)
    )
  )
);
export type PostCommentFormContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
