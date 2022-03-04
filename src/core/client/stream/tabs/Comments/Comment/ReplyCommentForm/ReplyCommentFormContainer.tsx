import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { graphql, useFragment } from "react-relay";

import { ERROR_CODES } from "coral-common/errors";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  InvalidRequestError,
  ModerationNudgeError,
} from "coral-framework/lib/errors";
import { useFetch } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import WarningError from "coral-stream/common/WarningError";
import { Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

import { ReplyCommentFormContainer_comment$key as CommentData } from "coral-stream/__generated__/ReplyCommentFormContainer_comment.graphql";
import { ReplyCommentFormContainer_settings$key as SettingsData } from "coral-stream/__generated__/ReplyCommentFormContainer_settings.graphql";
import { ReplyCommentFormContainer_story$key as StoryData } from "coral-stream/__generated__/ReplyCommentFormContainer_story.graphql";

import { useCommentSeenEnabled } from "../../commentSeen";
import {
  shouldTriggerSettingsRefresh,
  shouldTriggerViewerRefresh,
  SubmitStatus,
} from "../../helpers";
import { getSubmissionResponse } from "../../helpers/getSubmitStatus";
import RefreshSettingsFetch from "../../RefreshSettingsFetch";
import RefreshViewerFetch from "../../RefreshViewerFetch";
import { RTE_RESET_VALUE } from "../../RTE/RTE";
import computeCommentElementID from "../computeCommentElementID";
import ReplyEditSubmitStatus from "../ReplyEditSubmitStatus";
import {
  CreateCommentReplyMutation,
  withCreateCommentReplyMutation,
} from "./CreateCommentReplyMutation";
import ReplyCommentForm, { ReplyCommentFormProps } from "./ReplyCommentForm";
import ReplyEditedWarningContainer from "./ReplyEditedWarningContainer";

interface Props {
  createCommentReply: CreateCommentReplyMutation;
  comment: CommentData;
  settings: SettingsData;
  story: StoryData;
  onClose?: () => void;
  localReply?: boolean;
  showJumpToComment?: boolean;
}

const ReplyCommentFormContainer: FunctionComponent<Props> = ({
  comment,
  onClose,
  createCommentReply,
  story,
  localReply,
  settings,
}) => {
  const settingsData = useFragment(
    graphql`
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
    settings
  );
  const storyData = useFragment(
    graphql`
      fragment ReplyCommentFormContainer_story on Story {
        id
        isClosed
      }
    `,
    story
  );
  const commentData = useFragment(
    graphql`
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
        ...ReplyEditedWarningContainer_comment
      }
    `,
    comment
  );

  const { pym, renderWindow, sessionStorage, browserInfo } = useCoralContext();
  // Disable autofocus on ios and enable for the rest.
  const autofocus = !browserInfo.ios;
  const commentSeenEnabled = useCommentSeenEnabled();
  const refreshSettings = useFetch(RefreshSettingsFetch);
  const refreshViewer = useFetch(RefreshViewerFetch);

  const [nudge, setNudge] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [initialValues, setInitialValues] = useState<
    ReplyCommentFormProps["initialValues"] | undefined
  >(undefined);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [showJumpToComment, setShowJumpToComment] = useState(false);
  const [jumpToCommentID, setJumpToCommentID] = useState<string | null>(null);

  const contextKey = `replyCommentFormBody-${commentData.id}`;
  const rteRef = useRef<CoralRTE | null>(null);

  useEffect(() => {
    async function fetchBody() {
      const body = await sessionStorage.getItem(contextKey);

      if (body) {
        setInitialValues({
          body,
        });
      }

      setInitialized(true);
    }

    void fetchBody();
  }, [contextKey, sessionStorage]);

  const handleRTERef = useCallback(
    (rte: CoralRTE | null) => {
      rteRef.current = rte;
      if (rteRef && autofocus) {
        // Delay focus a bit until iframe had a change to resize.
        setTimeout(
          () => rteRef && rteRef.current && rteRef.current.focus(),
          100
        );
      }
    },
    [autofocus]
  );

  const handleOnCancelOrDismiss = useCallback(() => {
    void sessionStorage.removeItem(contextKey);
    if (onClose) {
      onClose();
    }
  }, [contextKey, onClose, sessionStorage]);

  const disableNudge = useCallback(() => {
    if (nudge) {
      setNudge(false);
    }
  }, [nudge]);

  const handleOnSubmit: ReplyCommentFormProps["onSubmit"] = useCallback(
    async (input) => {
      try {
        const response = getSubmissionResponse(
          await createCommentReply({
            storyID: storyData.id,
            parentID: commentData.id,
            // Assuming comment revision exists otherwise we would
            // not be seeing the reply form options as we we tombstone
            // deleted comments without revision history
            parentRevisionID: commentData.revision!.id,
            local: localReply,
            nudge,
            body: input.body,
            media: input.media,
          })
        );

        if (response.status !== "RETRY") {
          void sessionStorage.removeItem(contextKey);

          if (response.status === "APPROVED" && showJumpToComment) {
            setJumpToCommentID(response.commentID);
            setShowJumpToComment(true);

            return;
          } else if (response.status === "APPROVED" && onClose) {
            onClose();
            return;
          }
        }

        setNudge(true);
        setSubmitStatus(response.status);
      } catch (error) {
        if (error instanceof InvalidRequestError) {
          if (shouldTriggerSettingsRefresh(error.code)) {
            await refreshSettings({ storyID: storyData.id });
          }

          if (shouldTriggerViewerRefresh(error.code)) {
            await refreshViewer();
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
          disableNudge();
          return { [FORM_ERROR]: error.message };
        }

        // eslint-disable-next-line no-console
        console.error(error);
      }
      return;
    },
    [
      commentData.id,
      commentData.revision,
      contextKey,
      createCommentReply,
      disableNudge,
      localReply,
      nudge,
      onClose,
      refreshSettings,
      refreshViewer,
      sessionStorage,
      showJumpToComment,
      storyData.id,
    ]
  );

  const handleOnChange: ReplyCommentFormProps["onChange"] = useCallback(
    (state, form) => {
      if (state.values.body) {
        void sessionStorage.setItem(contextKey, state.values.body);
      } else {
        void sessionStorage.removeItem(contextKey);
      }
      // Reset errors whenever user clears the form.
      if (
        state.touched &&
        state.touched.body &&
        (!state.values.body || state.values.body === RTE_RESET_VALUE)
      ) {
        form.restart({ body: RTE_RESET_VALUE });
      }
    },
    [contextKey, sessionStorage]
  );

  const jumpToComment = useCallback(() => {
    const commentID = jumpToCommentID;
    if (!commentID || !pym) {
      return;
    }

    if (onClose) {
      onClose();
    }

    const elementID = computeCommentElementID(commentID);
    setTimeout(() => {
      const elem = renderWindow.document.getElementById(elementID);
      if (elem) {
        const offset =
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          elem.getBoundingClientRect().top +
          renderWindow.pageYOffset -
          (commentSeenEnabled ? 150 : 0);
        pym.scrollParentToChildPos(offset);
        elem.focus();
      }
    }, 300);
  }, [commentSeenEnabled, jumpToCommentID, onClose, pym, renderWindow]);

  if (!initialized) {
    return null;
  }

  if (showJumpToComment) {
    return (
      <CallOut
        title={
          <Localized id="comments-jumpToComment-title">
            Your reply has posted below
          </Localized>
        }
        icon={<Icon>question_answer</Icon>}
        iconColor="none"
        color="primary"
        aria-live="polite"
      >
        <Localized id="comments-jumpToComment-GoToReply">
          <Button onClick={jumpToComment} variant="flat" underline>
            Go to reply
          </Button>
        </Localized>
      </CallOut>
    );
  }

  if (submitStatus && submitStatus !== "RETRY") {
    return (
      <ReplyEditSubmitStatus
        status={submitStatus}
        onDismiss={handleOnCancelOrDismiss}
        buttonClassName={CLASSES.createReplyComment.dismiss}
        inReviewClassName={CLASSES.createReplyComment.inReview}
      />
    );
  }

  return (
    <>
      <ReplyEditedWarningContainer comment={commentData} />
      <ReplyCommentForm
        siteID={commentData.site.id}
        id={commentData.id}
        rteConfig={settingsData.rte}
        onSubmit={handleOnSubmit}
        onChange={handleOnChange}
        mediaConfig={settingsData.media}
        initialValues={initialValues}
        onCancel={handleOnCancelOrDismiss}
        rteRef={handleRTERef}
        parentUsername={commentData.author && commentData.author.username}
        min={
          (settingsData.charCount.enabled && settingsData.charCount.min) || null
        }
        max={
          (settingsData.charCount.enabled && settingsData.charCount.max) || null
        }
        disabled={settingsData.disableCommenting.enabled || storyData.isClosed}
        disabledMessage={
          (settingsData.disableCommenting.enabled &&
            settingsData.disableCommenting.message) ||
          settingsData.closeCommenting.message
        }
      />
    </>
  );
};

const enhanced = withCreateCommentReplyMutation(ReplyCommentFormContainer);
export default enhanced;
