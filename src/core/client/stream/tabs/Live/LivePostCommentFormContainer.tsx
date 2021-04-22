import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { graphql } from "react-relay";

import { ERROR_CODES } from "coral-common/errors";
import { usePersistedSessionState } from "coral-framework/hooks";
import {
  InvalidRequestError,
  ModerationNudgeError,
} from "coral-framework/lib/errors";
import { useViewerEvent } from "coral-framework/lib/events";
import {
  useFetch,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { PropTypesOf } from "coral-framework/types";
import { ShowAuthPopupMutation } from "coral-stream/common/AuthPopup";
import WarningError from "coral-stream/common/WarningError";
import { LiveCreateCommentFocusEvent } from "coral-stream/events";
import RefreshSettingsFetch from "coral-stream/tabs/Comments/RefreshSettingsFetch";
import RefreshViewerFetch from "coral-stream/tabs/Comments/RefreshViewerFetch";
import { RTE_RESET_VALUE } from "coral-stream/tabs/Comments/RTE/RTE";
import {
  FormProps,
  OnChangeHandler,
  OnSubmitHandler,
} from "coral-stream/tabs/Comments/Stream/CommentForm/CommentForm";
import PostCommentFormClosed from "coral-stream/tabs/Comments/Stream/PostCommentForm/PostCommentFormClosed";
import PostCommentFormClosedSitewide from "coral-stream/tabs/Comments/Stream/PostCommentForm/PostCommentFormClosedSitewide";
import { Toggle } from "coral-stream/tabs/Comments/Stream/PostCommentForm/PostReviewOrQuestion";
import {
  getSubmitStatus,
  shouldTriggerSettingsRefresh,
  shouldTriggerViewerRefresh,
  SubmitStatus,
} from "coral-stream/tabs/shared/helpers";

import { LivePostCommentFormContainer_settings } from "coral-stream/__generated__/LivePostCommentFormContainer_settings.graphql";
import { LivePostCommentFormContainer_story } from "coral-stream/__generated__/LivePostCommentFormContainer_story.graphql";
import { LivePostCommentFormContainer_viewer } from "coral-stream/__generated__/LivePostCommentFormContainer_viewer.graphql";

import { LiveCreateCommentMutation } from "./LiveCreateCommentMutation";
import LivePostCommentForm from "./LivePostCommentForm";
import LivePostCommentFormFake from "./LivePostCommentFormFake";

interface Props {
  settings: LivePostCommentFormContainer_settings;
  viewer: LivePostCommentFormContainer_viewer | null;
  story: LivePostCommentFormContainer_story;

  onSubmitted: (commentID: string | undefined, cursor: string) => void;
}

export const LivePostCommentFormContainer: FunctionComponent<Props> = ({
  settings,
  viewer,
  story,
  onSubmitted,
}) => {
  const rteRef = useRef<CoralRTE | null>(null);
  const refreshSettings = useFetch(RefreshSettingsFetch);
  const refreshViewer = useFetch(RefreshViewerFetch);
  const createComment = useMutation(LiveCreateCommentMutation);
  const showAuthPopup = useMutation(ShowAuthPopupMutation);

  // keepFormWhenClosed controls the display state when the commenting has been
  // closed. This value should not be updated when the props change, hence why
  // we don't use any deps here!
  const keepFormWhenClosed = useMemo(
    () => !!viewer && !story.isClosed && !settings.disableCommenting.enabled,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // nudge will turn on the nudging behavior on the server
  const [nudge, setNudge] = useState(true);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

  const [draft = "", setDraft, initialDraft] = usePersistedSessionState<string>(
    "LivePostCommentFormContainer:draft"
  );
  const [, setToggle] = usePersistedSessionState<Toggle>(
    "LivePostCommentFormContainer:toggle"
  );

  const [initialValues, setInitialValues] = useState<FormProps>();
  useEffect(() => {
    setInitialValues({ body: initialDraft || "" });
  }, [initialDraft]);

  const disabled =
    settings.disableCommenting.enabled ||
    story.isClosed ||
    !!viewer?.scheduledDeletionDate;

  const handleOnSubmit: OnSubmitHandler = useCallback(
    async (input, form) => {
      try {
        const response = await createComment({
          storyID: story.id,
          nudge,
          body: input.body,
          media: input.media,
        });

        const status = getSubmitStatus(response as any);

        if (status !== "RETRY") {
          // We've submitted the comment, and it returned with a non-retry status,
          // so clear out the persisted values and reset the form.
          setToggle(undefined);
          setDraft(undefined);

          setInitialValues({ body: "" });
          form
            .getRegisteredFields()
            .forEach((name) => form.resetFieldState(name));
          form.initialize({ body: RTE_RESET_VALUE });
        }

        setNudge(true);
        setSubmitStatus(status);

        if (
          status !== "RETRY" &&
          status !== "REJECTED" &&
          status !== "IN_REVIEW"
        ) {
          onSubmitted(response.edge.node.id, response.edge.cursor);
        }
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
          setNudge(false);
          return { [FORM_ERROR]: error.message };
        }
        // eslint-disable-next-line no-console
        console.error(error);
      }
      return;
    },
    [
      createComment,
      nudge,
      onSubmitted,
      refreshSettings,
      refreshViewer,
      setDraft,
      setToggle,
      story.id,
    ]
  );

  /* Handle focus */
  const emitFocusEvent = useViewerEvent(LiveCreateCommentFocusEvent);
  const onFocus = useCallback(() => {
    emitFocusEvent();
  }, [emitFocusEvent]);

  const handleDraftChange = useCallback(
    (body: string) => {
      setDraft(body);
    },
    [setDraft]
  );
  const handleOnChange: OnChangeHandler = useCallback(
    (state, form) => {
      if (submitStatus && state.dirty) {
        setSubmitStatus(null);
      }

      setDraft(state.values.body === RTE_RESET_VALUE ? "" : state.values.body);

      // Reset errors whenever user clears the form.
      if (
        state.touched &&
        state.touched.body &&
        (!state.values.body || state.values.body === RTE_RESET_VALUE)
      ) {
        (form as any).restart({ body: RTE_RESET_VALUE });
      }
    },
    [setDraft, submitStatus]
  );

  const handleSignIn = () => {
    void showAuthPopup({ view: "SIGN_IN" });
  };

  if (!keepFormWhenClosed) {
    if (settings.disableCommenting.enabled) {
      return (
        <PostCommentFormClosedSitewide
          story={story}
          message={settings.disableCommenting.message}
          showMessageBox={false}
        />
      );
    }

    if (story.isClosed) {
      return (
        <PostCommentFormClosed
          story={story}
          message={settings.closeCommenting.message}
          showMessageBox={false}
        />
      );
    }
  }

  if (!viewer) {
    return (
      <LivePostCommentFormFake
        rteConfig={settings.rte}
        draft={draft}
        onDraftChange={handleDraftChange}
        onSignIn={handleSignIn}
        onFocus={onFocus}
      />
    );
  }

  const disabledMessage =
    disabled &&
    (settings.disableCommenting.enabled ? (
      settings.disableCommenting.message
    ) : viewer.scheduledDeletionDate ? (
      <Localized id="comments-postCommentForm-userScheduledForDeletion-warning">
        Commenting is disabled when your account is scheduled for deletion.
      </Localized>
    ) : (
      settings.closeCommenting.message
    ));

  return (
    <>
      <LivePostCommentForm
        siteID={story.site.id}
        onSubmit={handleOnSubmit}
        onChange={handleOnChange}
        initialValues={initialValues}
        mediaConfig={settings.media}
        rteConfig={settings.rte}
        min={settings.charCount.enabled ? settings.charCount.min : null}
        max={settings.charCount.enabled ? settings.charCount.max : null}
        disabled={disabled}
        disabledMessage={disabledMessage}
        submitStatus={submitStatus}
        rteRef={rteRef}
        onFocus={onFocus}
      />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
  settings: graphql`
    fragment LivePostCommentFormContainer_settings on Settings {
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
    fragment LivePostCommentFormContainer_story on Story {
      id
      isClosed
      site {
        id
      }
      ...MessageBoxContainer_story
    }
  `,
  viewer: graphql`
    fragment LivePostCommentFormContainer_viewer on User {
      id
      scheduledDeletionDate
    }
  `,
})(LivePostCommentFormContainer);

export type LivePostCommentFormContainerProps = PropTypesOf<typeof enhanced>;

export default enhanced;
