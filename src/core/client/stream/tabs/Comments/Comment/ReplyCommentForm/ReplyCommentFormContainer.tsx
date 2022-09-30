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
import { graphql } from "react-relay";

import { ERROR_CODES } from "coral-common/errors";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  InvalidRequestError,
  ModerationNudgeError,
} from "coral-framework/lib/errors";
import { useFetch, withFragmentContainer } from "coral-framework/lib/relay";
import CLASSES from "coral-stream/classes";
import WarningError from "coral-stream/common/WarningError";
import { Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";
import { useShadowRootOrDocument } from "coral-ui/encapsulation";

import { ReplyCommentFormContainer_comment as CommentData } from "coral-stream/__generated__/ReplyCommentFormContainer_comment.graphql";
import { ReplyCommentFormContainer_settings as SettingsData } from "coral-stream/__generated__/ReplyCommentFormContainer_settings.graphql";
import { ReplyCommentFormContainer_story as StoryData } from "coral-stream/__generated__/ReplyCommentFormContainer_story.graphql";

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
  const root = useShadowRootOrDocument();
  const { renderWindow, sessionStorage, browserInfo, customScrollContainer } =
    useCoralContext();
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

  const contextKey = `replyCommentFormBody-${comment.id}`;
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
        // Delay focus a bit until iframe had a chance to resize.
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
            storyID: story.id,
            parentID: comment.id,
            // Assuming comment revision exists otherwise we would
            // not be seeing the reply form options as we we tombstone
            // deleted comments without revision history
            parentRevisionID: comment.revision!.id,
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
            await refreshSettings({ storyID: story.id });
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
      comment.id,
      comment.revision,
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
      story.id,
    ]
  );

  const handleOnChange: ReplyCommentFormProps["onChange"] = useCallback(
    (state: any, form: any) => {
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
    if (!commentID) {
      return;
    }

    if (onClose) {
      onClose();
    }

    const elementID = computeCommentElementID(commentID);
    setTimeout(() => {
      const elem = root.getElementById(elementID);
      if (elem) {
        if (customScrollContainer) {
          elem.scrollIntoView();
        } else {
          const offset =
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            elem.getBoundingClientRect().top +
            renderWindow.pageYOffset -
            (commentSeenEnabled ? 150 : 0);
          renderWindow.scrollTo({ top: offset });
        }
        elem.focus();
      }
    }, 300);
  }, [
    commentSeenEnabled,
    jumpToCommentID,
    onClose,
    renderWindow,
    root,
    customScrollContainer,
  ]);

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
      <ReplyEditedWarningContainer comment={comment} />
      <ReplyCommentForm
        siteID={comment.site.id}
        id={comment.id}
        rteConfig={settings.rte}
        onSubmit={handleOnSubmit}
        onChange={handleOnChange}
        mediaConfig={settings.media}
        initialValues={initialValues}
        onCancel={handleOnCancelOrDismiss}
        rteRef={handleRTERef}
        parentUsername={comment.author && comment.author.username}
        min={(settings.charCount.enabled && settings.charCount.min) || null}
        max={(settings.charCount.enabled && settings.charCount.max) || null}
        disabled={settings.disableCommenting.enabled || story.isClosed}
        disabledMessage={
          (settings.disableCommenting.enabled &&
            settings.disableCommenting.message) ||
          settings.closeCommenting.message
        }
      />
    </>
  );
};

const enhanced = withCreateCommentReplyMutation(
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
        ...ReplyEditedWarningContainer_comment
      }
    `,
  })(ReplyCommentFormContainer)
);
export default enhanced;
