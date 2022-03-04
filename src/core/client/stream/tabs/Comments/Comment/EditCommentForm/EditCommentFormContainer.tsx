import { CoralRTE } from "@coralproject/rte";
import { clearLongTimeout, LongTimeout, setLongTimeout } from "long-settimeout";
import React, { FunctionComponent, useEffect, useState } from "react";
import { graphql, useFragment } from "react-relay";

import { isBeforeDate } from "coral-common/utils";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import { InvalidRequestError } from "coral-framework/lib/errors";
import { useFetch } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";

import {
  EditCommentFormContainer_comment as CommentData,
  EditCommentFormContainer_comment$key,
} from "coral-stream/__generated__/EditCommentFormContainer_comment.graphql";
import { EditCommentFormContainer_settings$key } from "coral-stream/__generated__/EditCommentFormContainer_settings.graphql";
import { EditCommentFormContainer_story$key } from "coral-stream/__generated__/EditCommentFormContainer_story.graphql";

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
  comment: EditCommentFormContainer_comment$key;
  settings: EditCommentFormContainer_settings$key;
  story: EditCommentFormContainer_story$key;
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
  const commentData = useFragment(
    graphql`
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
    comment
  );
  const storyData = useFragment(
    graphql`
      fragment EditCommentFormContainer_story on Story {
        id
      }
    `,
    story
  );
  const settingsData = useFragment(
    graphql`
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
    settings
  );

  const { browserInfo } = useCoralContext();
  const refreshSettingsFetch = useFetch(RefreshSettingsFetch);
  const [expired, setExpired] = useState(
    !!commentData.editing.editableUntil &&
      !isBeforeDate(commentData.editing.editableUntil)
  );
  const [submitStatus, setSubmitStatus] = useState<null | SubmitStatus>(null);
  const [initialValues, setInitialValues] = useState({
    body: commentData.body || "",
    media: getMediaFromComment(commentData),
  });
  const updateWhenExpired = () => {
    const ms =
      new Date(commentData.editing.editableUntil!).getTime() - Date.now();
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
  }, [expiredTimer]);

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
          commentID: commentData.id,
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
            media: getMediaFromComment(commentData),
          });
          await refreshSettingsFetch({ storyID: storyData.id });
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
      siteID={commentData.site.id}
      id={commentData.id}
      rteConfig={settingsData.rte}
      onSubmit={handleOnSubmit}
      initialValues={initialValues}
      onCancel={handleOnCancelOrClose}
      onClose={handleOnCancelOrClose}
      rteRef={handleRTERef}
      author={commentData.author}
      createdAt={commentData.createdAt}
      editableUntil={commentData.editing.editableUntil!}
      expired={expired}
      mediaConfig={settingsData.media}
      min={
        (settingsData.charCount.enabled && settingsData.charCount.min) || null
      }
      max={
        (settingsData.charCount.enabled && settingsData.charCount.max) || null
      }
    />
  );
};

const enhanced = withEditCommentMutation(EditCommentFormContainer);
export default enhanced;
