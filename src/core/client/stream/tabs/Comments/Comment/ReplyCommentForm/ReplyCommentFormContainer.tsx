import { CoralRTE } from "@coralproject/rte";
import { FORM_ERROR } from "final-form";
import React, { Component } from "react";
import { graphql } from "react-relay";

import { ERROR_CODES } from "coral-common/errors";
import { withContext } from "coral-framework/lib/bootstrap";
import {
  InvalidRequestError,
  ModerationNudgeError,
} from "coral-framework/lib/errors";
import {
  FetchProp,
  withFetch,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { PromisifiedStorage } from "coral-framework/lib/storage";
import CLASSES from "coral-stream/classes";
import WarningError from "coral-stream/common/WarningError";

import { ReplyCommentFormContainer_comment as CommentData } from "coral-stream/__generated__/ReplyCommentFormContainer_comment.graphql";
import { ReplyCommentFormContainer_settings as SettingsData } from "coral-stream/__generated__/ReplyCommentFormContainer_settings.graphql";
import { ReplyCommentFormContainer_story as StoryData } from "coral-stream/__generated__/ReplyCommentFormContainer_story.graphql";

import {
  getSubmitStatus,
  shouldTriggerSettingsRefresh,
  shouldTriggerViewerRefresh,
  SubmitStatus,
} from "../../helpers";
import RefreshSettingsFetch from "../../RefreshSettingsFetch";
import RefreshViewerFetch from "../../RefreshViewerFetch";
import { RTE_RESET_VALUE } from "../../RTE/RTE";
import ReplyEditSubmitStatus from "../ReplyEditSubmitStatus";
import {
  CreateCommentReplyMutation,
  withCreateCommentReplyMutation,
} from "./CreateCommentReplyMutation";
import ReplyCommentForm, { ReplyCommentFormProps } from "./ReplyCommentForm";

interface Props {
  createCommentReply: CreateCommentReplyMutation;
  sessionStorage: PromisifiedStorage;
  comment: CommentData;
  settings: SettingsData;
  story: StoryData;
  onClose?: () => void;
  autofocus: boolean;
  localReply?: boolean;
  refreshSettings: FetchProp<typeof RefreshSettingsFetch>;
  refreshViewer: FetchProp<typeof RefreshViewerFetch>;
}

interface State {
  /** nudge will turn on the nudging behavior on the server */
  nudge: boolean;
  initialValues?: ReplyCommentFormProps["initialValues"];
  initialized: boolean;
  submitStatus: SubmitStatus | null;
}

export class ReplyCommentFormContainer extends Component<Props, State> {
  public state: State = {
    nudge: true,
    initialized: false,
    submitStatus: null,
  };
  private contextKey = `replyCommentFormBody-${this.props.comment.id}`;
  private rteRef: CoralRTE | null = null;

  constructor(props: Props) {
    super(props);
    void this.init();
  }

  private handleRTERef = (rte: CoralRTE | null) => {
    this.rteRef = rte;
    if (this.rteRef && this.props.autofocus) {
      // Delay focus a bit until iframe had a change to resize.
      setTimeout(() => this.rteRef && this.rteRef.focus(), 100);
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
    void this.props.sessionStorage.removeItem(this.contextKey);
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  private disableNudge = () => {
    if (this.state.nudge) {
      this.setState({ nudge: false });
    }
  };

  private handleOnSubmit: ReplyCommentFormProps["onSubmit"] = async (input) => {
    try {
      const submitStatus = getSubmitStatus(
        await this.props.createCommentReply({
          storyID: this.props.story.id,
          parentID: this.props.comment.id,
          // Assuming comment revision exists otherwise we would
          // not be seeing the reply form options as we we tombstone
          // deleted comments without revision history
          parentRevisionID: this.props.comment.revision!.id,
          local: this.props.localReply,
          nudge: this.state.nudge,
          body: input.body,
          media: input.media,
        })
      );
      if (submitStatus !== "RETRY") {
        void this.props.sessionStorage.removeItem(this.contextKey);
        if (submitStatus === "APPROVED" && this.props.onClose) {
          this.props.onClose();
          return;
        }
      }
      this.setState({ submitStatus, nudge: true });
    } catch (error) {
      if (error instanceof InvalidRequestError) {
        if (shouldTriggerSettingsRefresh(error.code)) {
          await this.props.refreshSettings({ storyID: this.props.story.id });
        }

        if (shouldTriggerViewerRefresh(error.code)) {
          await this.props.refreshViewer();
        }

        if (error.code === ERROR_CODES.USER_WARNED) {
          return {
            [FORM_ERROR]: <WarningError />,
          };
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

      // eslint-disable-next-line no-console
      console.error(error);
    }
    return;
  };

  private handleOnChange: ReplyCommentFormProps["onChange"] = (state, form) => {
    if (state.values.body) {
      void this.props.sessionStorage.setItem(
        this.contextKey,
        state.values.body
      );
    } else {
      void this.props.sessionStorage.removeItem(this.contextKey);
    }
    // Reset errors whenever user clears the form.
    if (
      state.touched &&
      state.touched.body &&
      (!state.values.body || state.values.body === RTE_RESET_VALUE)
    ) {
      (form as any).restart({ body: RTE_RESET_VALUE });
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
          buttonClassName={CLASSES.createReplyComment.dismiss}
          inReviewClassName={CLASSES.createReplyComment.inReview}
        />
      );
    }
    return (
      <ReplyCommentForm
        siteID={this.props.comment.site.id}
        id={this.props.comment.id}
        rteConfig={this.props.settings.rte}
        onSubmit={this.handleOnSubmit}
        onChange={this.handleOnChange}
        mediaConfig={this.props.settings.media}
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
          this.props.settings.closeCommenting.message
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
  withFetch(RefreshViewerFetch)(
    withFetch(RefreshSettingsFetch)(
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
              closeCommenting {
                message
              }
              media {
                twitter {
                  enabled
                }
                youtube {
                  enabled
                }
                giphy {
                  enabled
                  key
                  maxRating
                }
                external {
                  enabled
                }
              }
              rte {
                ...RTEContainer_config
              }
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
              site {
                id
              }
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
  )
);
export default enhanced;
