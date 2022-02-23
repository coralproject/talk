import { CoralRTE } from "@coralproject/rte";
import { clearLongTimeout, LongTimeout, setLongTimeout } from "long-settimeout";
import React, { Component } from "react";
import { graphql } from "react-relay";

import { isBeforeDate } from "coral-common/utils";
import { withContext } from "coral-framework/lib/bootstrap";
import { InvalidRequestError } from "coral-framework/lib/errors";
import {
  FetchProp,
  withFetch,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";

import { EditCommentFormContainer_comment$data as CommentData } from "coral-stream/__generated__/EditCommentFormContainer_comment.graphql";
import { EditCommentFormContainer_settings$data as SettingsData } from "coral-stream/__generated__/EditCommentFormContainer_settings.graphql";
import { EditCommentFormContainer_story$data as StoryData } from "coral-stream/__generated__/EditCommentFormContainer_story.graphql";

import {
  getSubmitStatus,
  shouldTriggerSettingsRefresh,
  SubmitStatus,
} from "../../helpers";
import RefreshSettingsFetch from "../../RefreshSettingsFetch";
import ReplyEditSubmitStatus from "../ReplyEditSubmitStatus";
import EditCommentForm, { EditCommentFormProps } from "./EditCommentForm";
import {
  EditCommentMutation,
  withEditCommentMutation,
} from "./EditCommentMutation";

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

function getMediaFromComment(comment: CommentData) {
  if (!comment.revision || !comment.revision.media) {
    return;
  }

  switch (comment.revision.media.__typename) {
    case "YouTubeMedia":
      return {
        type: "youtube",
        url: comment.revision.media.url,
      };
    case "GiphyMedia":
      return {
        type: "giphy",
        url: comment.revision.media.url,
      };
    case "TwitterMedia":
      return {
        type: "twitter",
        url: comment.revision.media.url,
      };
    case "ExternalMedia":
      return {
        type: "external",
        url: comment.revision.media.url,
      };
    case "%other":
      return;
  }
}

export class EditCommentFormContainer extends Component<Props, State> {
  private expiredTimer?: LongTimeout;
  private intitialValues = {
    body: this.props.comment.body || "",
    media: getMediaFromComment(this.props.comment),
  };

  public state: State = {
    initialized: false,
    expired:
      !!this.props.comment.editing.editableUntil &&
      !isBeforeDate(this.props.comment.editing.editableUntil),
    submitStatus: null,
  };

  constructor(props: Props) {
    super(props);
    this.expiredTimer = this.updateWhenExpired();
  }

  public componentWillUnmount() {
    if (this.expiredTimer) {
      clearLongTimeout(this.expiredTimer);
    }
  }

  private updateWhenExpired() {
    const ms =
      new Date(this.props.comment.editing.editableUntil!).getTime() -
      Date.now();
    if (ms > 0) {
      return setLongTimeout(() => this.setState({ expired: true }), ms);
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
          media: input.media,
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
      // eslint-disable-next-line no-console
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
          buttonClassName={CLASSES.editComment.dismiss}
          inReviewClassName={CLASSES.editComment.inReview}
        />
      );
    }
    return (
      <EditCommentForm
        siteID={this.props.comment.site.id}
        id={this.props.comment.id}
        rteConfig={this.props.settings.rte}
        onSubmit={this.handleOnSubmit}
        initialValues={this.intitialValues}
        onCancel={this.handleOnCancelOrClose}
        onClose={this.handleOnCancelOrClose}
        rteRef={this.handleRTERef}
        author={this.props.comment.author}
        createdAt={this.props.comment.createdAt}
        editableUntil={this.props.comment.editing.editableUntil!}
        expired={this.state.expired}
        mediaConfig={this.props.settings.media}
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

const enhanced = withContext(({ browserInfo }) => ({
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
            revision {
              id
              media {
                __typename
                ... on GiphyMedia {
                  url
                  title
                  width
                  height
                  still
                  video
                }
                ... on TwitterMedia {
                  url
                  width
                }
                ... on YouTubeMedia {
                  url
                  width
                  height
                }
                ... on ExternalMedia {
                  url
                }
              }
            }
            author {
              username
            }
            editing {
              editableUntil
            }
            site {
              id
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
      })(EditCommentFormContainer)
    )
  )
);
export default enhanced;
