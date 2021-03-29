import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
import { clearLongTimeout, LongTimeout, setLongTimeout } from "long-settimeout";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { graphql } from "react-relay";

import { InvalidRequestError } from "coral-framework/lib/errors";
import { useViewerEvent } from "coral-framework/lib/events";
import { useMutation, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import { LiveCreateCommentFocusEvent } from "coral-stream/events";
import ReplyEditSubmitStatus from "coral-stream/tabs/Comments/Comment/ReplyEditSubmitStatus";
import {
  getSubmitStatus,
  shouldTriggerSettingsRefresh,
  SubmitStatus,
} from "coral-stream/tabs/shared/helpers";
import { Flex, Icon } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import { LiveEditCommentFormContainer_comment } from "coral-stream/__generated__/LiveEditCommentFormContainer_comment.graphql";
import { LiveEditCommentFormContainer_settings } from "coral-stream/__generated__/LiveEditCommentFormContainer_settings.graphql";
import { LiveEditCommentFormContainer_story } from "coral-stream/__generated__/LiveEditCommentFormContainer_story.graphql";
import { LiveEditCommentFormContainer_viewer } from "coral-stream/__generated__/LiveEditCommentFormContainer_viewer.graphql";

import LivePostCommentForm from "../LivePostCommentForm";
import { LiveEditCommentMutation } from "./LiveEditCommentMutation";

import styles from "./LiveEditCommentFormContainer.css";

interface Props {
  comment: LiveEditCommentFormContainer_comment;
  story: LiveEditCommentFormContainer_story;
  settings: LiveEditCommentFormContainer_settings;
  viewer: LiveEditCommentFormContainer_viewer | null;

  autofocus: boolean;

  onClose: () => void;
  onRefreshSettings: (settings: { storyID: string }) => void;
}

const LiveEditCommentFormContainer: FunctionComponent<Props> = ({
  comment,
  story,
  settings,
  viewer,
  autofocus,
  onClose,
  onRefreshSettings,
}) => {
  const editComment = useMutation(LiveEditCommentMutation);

  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

  const initialValues = {
    body: comment.body || "",
  };

  // TODO @nick-funk, hook up media config when we have designs
  const mediaConfig = {
    external: {
      enabled: false,
    },
    youtube: {
      enabled: false,
    },
    twitter: {
      enabled: false,
    },
    giphy: {
      enabled: false,
      key: "",
      maxRating: "",
    },
  };

  const [expired, setExpired] = useState<boolean>(false);

  useEffect(() => {
    let expiredTimer: LongTimeout | undefined;
    const ms = new Date(comment.editing.editableUntil!).getTime() - Date.now();
    if (ms > 0) {
      expiredTimer = setLongTimeout(() => setExpired(true), ms);
    }

    return () => {
      if (expiredTimer) {
        clearLongTimeout(expiredTimer);
      }
    };
  }, [comment.editing.editableUntil, setExpired]);

  const handleOnSubmit = useCallback(
    async (input, form) => {
      try {
        const status = getSubmitStatus(
          await editComment({
            commentID: comment.id,
            body: input.body,
            media: input.media,
          })
        );
        if (status !== "RETRY") {
          if (status === "APPROVED" && onClose) {
            onClose();
            return;
          }
        }
        setSubmitStatus(status);
      } catch (error) {
        if (error instanceof InvalidRequestError) {
          if (shouldTriggerSettingsRefresh(error.code)) {
            onRefreshSettings({ storyID: story.id });
          }
          return error.invalidArgs;
        }
        // eslint-disable-next-line no-console
        console.error(error);
      }
      return;
    },
    [comment.id, editComment, onClose, onRefreshSettings, story.id]
  );

  const handleOnCancelOrClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleRTERef = useCallback(
    (rte: CoralRTE | null) => {
      if (rte && autofocus) {
        rte.focus();
      }
    },
    [autofocus]
  );

  const emitFocusEvent = useViewerEvent(LiveCreateCommentFocusEvent);
  const onFocus = useCallback(() => {
    emitFocusEvent();
  }, [emitFocusEvent]);

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
    <>
      <div className={styles.root}>
        <hr className={styles.hr} />
        <div className={styles.title}>
          <Flex alignItems="center" justifyContent="flex-start">
            <Button
              className={styles.closeButton}
              onClick={handleOnCancelOrClose}
              color="none"
              paddingSize="extraSmall"
            >
              <Icon className={styles.closeIcon}>cancel</Icon>
            </Button>
            Edit message
          </Flex>
        </div>

        <LivePostCommentForm
          siteID={comment.site.id}
          onSubmit={handleOnSubmit}
          initialValues={initialValues}
          mediaConfig={mediaConfig}
          rteConfig={settings.rte}
          min={settings.charCount.enabled ? settings.charCount.min : null}
          max={settings.charCount.enabled ? settings.charCount.max : null}
          disabled={expired}
          disabledMessage={
            <Localized id="comments-editCommentForm-editTimeExpired">
              Edit time has expired. You can no longer edit this comment. Why
              not post another one?
            </Localized>
          }
          submitStatus={submitStatus}
          rteRef={handleRTERef}
          onFocus={onFocus}
        />
      </div>
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  comment: graphql`
    fragment LiveEditCommentFormContainer_comment on Comment {
      id
      body
      createdAt
      author {
        username
      }
      editing {
        editableUntil
      }
      site {
        id
      }
      revision {
        id
      }
      ...LiveCommentBodyContainer_comment
    }
  `,
  story: graphql`
    fragment LiveEditCommentFormContainer_story on Story {
      id
      ...LiveCommentBodyContainer_story
    }
  `,
  settings: graphql`
    fragment LiveEditCommentFormContainer_settings on Settings {
      charCount {
        enabled
        min
        max
      }
      rte {
        ...RTEContainer_config
      }
      ...LiveCommentBodyContainer_settings
    }
  `,
  viewer: graphql`
    fragment LiveEditCommentFormContainer_viewer on User {
      ...LiveCommentBodyContainer_viewer
    }
  `,
})(LiveEditCommentFormContainer);

export default enhanced;
