import { CoralRTE } from "@coralproject/rte";
import { clearLongTimeout, LongTimeout, setLongTimeout } from "long-settimeout";
import React, { FunctionComponent, useEffect, useState } from "react";
import { graphql } from "react-relay";

import { isBeforeDate } from "coral-common/utils";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useFetch, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";

import { EditCommentFormContainer_comment as CommentData } from "coral-stream/__generated__/EditCommentFormContainer_comment.graphql";
import { EditCommentFormContainer_settings as SettingsData } from "coral-stream/__generated__/EditCommentFormContainer_settings.graphql";
import { EditCommentFormContainer_story as StoryData } from "coral-stream/__generated__/EditCommentFormContainer_story.graphql";

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

export const EditCommentFormContainer: FunctionComponent<Props> = ({
  editComment,
  comment,
  settings,
  story,
  onClose,
}) => {
  const { browserInfo } = useCoralContext();
  const refreshSettingsFetch = useFetch(RefreshSettingsFetch);
  const [expired, setExpired] = useState(
    !!comment.editing.editableUntil &&
      !isBeforeDate(comment.editing.editableUntil)
  );
  const [submitStatus, setSubmitStatus] = useState<null | SubmitStatus>(null);
  const [initialValues, setInitialValues] = useState({
    body: comment.body || "",
    media: getMediaFromComment(comment),
  });
  const updateWhenExpired = () => {
    const ms = new Date(comment.editing.editableUntil!).getTime() - Date.now();
    if (ms > 0) {
      return setLongTimeout(() => setExpired(true), ms);
    }
    return;
  };

  const expiredTimer: LongTimeout | undefined = updateWhenExpired();

  useEffect(() => {
    return () => {
      if (expiredTimer) {
        clearLongTimeout(expiredTimer);
      }
    };
  }, []);

  const handleRTERef = (rte: CoralRTE | null) => {
    // Disable autofocus on ios and enable for the rest.
    const autofocus = !browserInfo.ios;
    if (rte && autofocus) {
      rte.focus();
    }
  };

  const handleOnCancelOrClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const handleOnSubmit: EditCommentFormProps["onSubmit"] = async (input) => {
    try {
      const editSubmitStatus = getSubmitStatus(
        await editComment({
          commentID: comment.id,
          body: input.body,
          media: input.media,
        })
      );
      if (editSubmitStatus !== "RETRY") {
        if (editSubmitStatus === "APPROVED" && onClose) {
          onClose();
          return;
        }
      }
      setSubmitStatus(editSubmitStatus);
    } catch (error) {
      if (error instanceof InvalidRequestError) {
        if (shouldTriggerSettingsRefresh(error.code)) {
          setInitialValues({
            body: input.body || "",
            media: getMediaFromComment(comment),
          });
          await refreshSettingsFetch({ storyID: story.id });
        }
        return error.invalidArgs;
      }
      // eslint-disable-next-line no-console
      console.error(error);
    }
    return;
  };

  if (submitStatus && submitStatus !== "RETRY") {
    return (
      <ReplyEditSubmitStatus
        status={submitStatus}
        onDismiss={handleOnCancelOrClose}
        buttonClassName={CLASSES.editComment.dismiss}
        inReviewClassName={CLASSES.editComment.inReview}
      />
    );
  }
  return (
    <EditCommentForm
      siteID={comment.site.id}
      id={comment.id}
      rteConfig={settings.rte}
      onSubmit={handleOnSubmit}
      initialValues={initialValues}
      onCancel={handleOnCancelOrClose}
      onClose={handleOnCancelOrClose}
      rteRef={handleRTERef}
      author={comment.author}
      createdAt={comment.createdAt}
      editableUntil={comment.editing.editableUntil!}
      expired={expired}
      mediaConfig={settings.media}
      min={(settings.charCount.enabled && settings.charCount.min) || null}
      max={(settings.charCount.enabled && settings.charCount.max) || null}
    />
  );
};

const enhanced = withEditCommentMutation(
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
);
export default enhanced;
