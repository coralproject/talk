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
import { useCoralContext, withContext } from "coral-framework/lib/bootstrap";
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
import { Icon } from "coral-ui/components/v2";
import { Button, CallOut } from "coral-ui/components/v3";

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
  showJumpToComment?: boolean;
}

const ReplyCommentFormContainer: FunctionComponent<Props> = (props) => {
  const { pym, renderWindow } = useCoralContext();
  const commentSeenEnabled = useCommentSeenEnabled();

  const [nudge, setNudge] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [initialValues, setInitialValues] = useState<
    ReplyCommentFormProps["initialValues"] | undefined
  >(undefined);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [showJumpToComment, setShowJumpToComment] = useState(false);
  const [jumpToCommentID, setJumpToCommentID] = useState<string | null>(null);

  const contextKey = `replyCommentFormBody-${props.comment.id}`;
  const rteRef = useRef<CoralRTE | null>(null);

  useEffect(() => {
    async function fetchBody() {
      const body = await props.sessionStorage.getItem(contextKey);

      if (body) {
        setInitialValues({
          body,
        });
      }

      setInitialized(true);
    }

    void fetchBody();
  }, [contextKey, props.sessionStorage]);

  const handleRTERef = useCallback(
    (rte: CoralRTE | null) => {
      rteRef.current = rte;
      if (rteRef && props.autofocus) {
        // Delay focus a bit until iframe had a change to resize.
        setTimeout(
          () => rteRef && rteRef.current && rteRef.current.focus(),
          100
        );
      }
    },
    [props]
  );

  const handleOnCancelOrDismiss = useCallback(() => {
    void props.sessionStorage.removeItem(contextKey);
    if (props.onClose) {
      props.onClose();
    }
  }, [contextKey, props]);

  const disableNudge = useCallback(() => {
    if (nudge) {
      setNudge(false);
    }
  }, [nudge]);

  const handleOnSubmit: ReplyCommentFormProps["onSubmit"] = useCallback(
    async (input) => {
      try {
        const response = getSubmissionResponse(
          await props.createCommentReply({
            storyID: props.story.id,
            parentID: props.comment.id,
            // Assuming comment revision exists otherwise we would
            // not be seeing the reply form options as we we tombstone
            // deleted comments without revision history
            parentRevisionID: props.comment.revision!.id,
            local: props.localReply,
            nudge,
            body: input.body,
            media: input.media,
          })
        );

        if (response.status !== "RETRY") {
          void props.sessionStorage.removeItem(contextKey);

          if (response.status === "APPROVED" && props.showJumpToComment) {
            setJumpToCommentID(response.commentID);
            setShowJumpToComment(true);

            return;
          } else if (response.status === "APPROVED" && props.onClose) {
            props.onClose();
            return;
          }
        }

        setNudge(true);
        setSubmitStatus(response.status);
      } catch (error) {
        if (error instanceof InvalidRequestError) {
          if (shouldTriggerSettingsRefresh(error.code)) {
            await props.refreshSettings({ storyID: props.story.id });
          }

          if (shouldTriggerViewerRefresh(error.code)) {
            await props.refreshViewer();
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
    [contextKey, disableNudge, nudge, props]
  );

  const handleOnChange: ReplyCommentFormProps["onChange"] = useCallback(
    (state, form) => {
      if (state.values.body) {
        void props.sessionStorage.setItem(contextKey, state.values.body);
      } else {
        void props.sessionStorage.removeItem(contextKey);
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
    [contextKey, props.sessionStorage]
  );

  const jumpToComment = useCallback(() => {
    const commentID = jumpToCommentID;
    if (!commentID || !pym) {
      return;
    }

    if (props.onClose) {
      props.onClose();
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
  }, [commentSeenEnabled, jumpToCommentID, props, pym, renderWindow]);

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
    <ReplyCommentForm
      siteID={props.comment.site.id}
      id={props.comment.id}
      rteConfig={props.settings.rte}
      onSubmit={handleOnSubmit}
      onChange={handleOnChange}
      mediaConfig={props.settings.media}
      initialValues={initialValues}
      onCancel={handleOnCancelOrDismiss}
      rteRef={handleRTERef}
      parentUsername={props.comment.author && props.comment.author.username}
      min={
        (props.settings.charCount.enabled && props.settings.charCount.min) ||
        null
      }
      max={
        (props.settings.charCount.enabled && props.settings.charCount.max) ||
        null
      }
      disabled={
        props.settings.disableCommenting.enabled || props.story.isClosed
      }
      disabledMessage={
        (props.settings.disableCommenting.enabled &&
          props.settings.disableCommenting.message) ||
        props.settings.closeCommenting.message
      }
    />
  );
};

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
