import { FORM_ERROR } from "final-form";
import { Localized } from "fluent-react/compat";
import React, { Component } from "react";

import { withContext } from "coral-framework/lib/bootstrap";
import {
  InvalidRequestError,
  ModerationNudgeError,
} from "coral-framework/lib/errors";
import {
  FetchProp,
  graphql,
  withFetch,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { PromisifiedStorage } from "coral-framework/lib/storage";
import { PropTypesOf } from "coral-framework/types";
import { PostCommentFormContainer_settings } from "coral-stream/__generated__/PostCommentFormContainer_settings.graphql";
import { PostCommentFormContainer_story } from "coral-stream/__generated__/PostCommentFormContainer_story.graphql";
import { PostCommentFormContainer_viewer } from "coral-stream/__generated__/PostCommentFormContainer_viewer.graphql";
import { COMMENTS_TAB } from "coral-stream/__generated__/StreamContainerLocal.graphql";
import {
  ShowAuthPopupMutation,
  withShowAuthPopupMutation,
} from "coral-stream/mutations";

import {
  getSubmitStatus,
  shouldTriggerSettingsRefresh,
  SubmitStatus,
} from "../../helpers";
import RefreshSettingsFetch from "../../RefreshSettingsFetch";
import {
  CreateCommentMutation,
  withCreateCommentMutation,
} from "./CreateCommentMutation";
import PostCommentForm from "./PostCommentForm";
import PostCommentFormClosed from "./PostCommentFormClosed";
import PostCommentFormClosedSitewide from "./PostCommentFormClosedSitewide";
import PostCommentFormFake from "./PostCommentFormFake";

interface Props {
  createComment: CreateCommentMutation;
  refreshSettings: FetchProp<typeof RefreshSettingsFetch>;
  sessionStorage: PromisifiedStorage;
  settings: PostCommentFormContainer_settings;
  viewer: PostCommentFormContainer_viewer | null;
  story: PostCommentFormContainer_story;
  showAuthPopup: ShowAuthPopupMutation;
  tab: COMMENTS_TAB;
  onChangeTab: (tab: COMMENTS_TAB) => void;
}

interface State {
  /** nudge will turn on the nudging behavior on the server */
  nudge: boolean;
  initialValues?: PropTypesOf<typeof PostCommentForm>["initialValues"];
  initialized: boolean;
  keepFormWhenClosed: boolean;
  submitStatus: SubmitStatus | null;
  notLoggedInDraft: string;
}

const contextKey = "postCommentFormBody";

/**
 * A temporary variable to save draft when user is not logged in.
 * This will be restored after the stream has refreshed.
 */
let preserveNotLoggedInDraft = "";

export class PostCommentFormContainer extends Component<Props, State> {
  public state: State = {
    initialized: false,
    nudge: true,
    keepFormWhenClosed:
      !!this.props.viewer &&
      !this.props.story.isClosed &&
      !this.props.settings.disableCommenting.enabled,
    submitStatus: null,
    notLoggedInDraft: "",
  };

  constructor(props: Props) {
    super(props);
    // Restore comment draft, if available.
    this.state.notLoggedInDraft = preserveNotLoggedInDraft;
    preserveNotLoggedInDraft = "";
    this.init();
  }

  public componentWillUnmount() {
    // Keep comment draft around. User might just have signed in and caused a reload.
    preserveNotLoggedInDraft = this.state.notLoggedInDraft;
  }

  private async init() {
    const body = await this.props.sessionStorage.getItem(contextKey);
    this.setState({
      initialValues: {
        body: body || this.state.notLoggedInDraft,
      },
    });
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
      if (this.props.tab === "FEATURED_COMMENTS") {
        await this.props.onChangeTab("ALL_COMMENTS");
      }

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

  private handleDraftChange = (draft: string) => {
    this.setState({ notLoggedInDraft: draft });
  };

  private handleSignIn = () => this.props.showAuthPopup({ view: "SIGN_IN" });

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
    if (!this.props.viewer) {
      return (
        <PostCommentFormFake
          draft={this.state.notLoggedInDraft}
          onDraftChange={this.handleDraftChange}
          story={this.props.story}
          showMessageBox={this.props.story.settings.messageBox.enabled}
          onSignIn={this.handleSignIn}
        />
      );
    }

    const scheduledForDeletion: boolean = Boolean(
      this.props.viewer.scheduledDeletionDate !== undefined &&
        this.props.viewer.scheduledDeletionDate !== null
    );

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
          this.props.story.isClosed ||
          scheduledForDeletion
        }
        disabledMessage={
          (this.props.settings.disableCommenting.enabled &&
            this.props.settings.disableCommenting.message) ||
          (this.props.viewer.scheduledDeletionDate && (
            <Localized id="comments-postCommentForm-userScheduledForDeletion-warning">
              Commenting is disabled when your account is scheduled for
              deletion.
            </Localized>
          )) ||
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
  withShowAuthPopupMutation(
    withCreateCommentMutation(
      withFetch(RefreshSettingsFetch)(
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
          viewer: graphql`
            fragment PostCommentFormContainer_viewer on User {
              id
              scheduledDeletionDate
            }
          `,
        })(PostCommentFormContainer)
      )
    )
  )
);
export type PostCommentFormContainerProps = PropTypesOf<typeof enhanced>;
export default enhanced;
