import { Localized } from "@fluent/react/compat";
import { FORM_ERROR } from "final-form";
import React, { FunctionComponent, useEffect, useState } from "react";
import { graphql } from "react-relay";

import { ERROR_CODES } from "coral-common/errors";
import { useCoralContext } from "coral-framework/lib/bootstrap";
import {
  InvalidRequestError,
  ModerationNudgeError,
} from "coral-framework/lib/errors";
import {
  useFetch,
  useMutation,
  withFragmentContainer,
} from "coral-framework/lib/relay";
import { GQLSTORY_MODE, GQLTAG } from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import { ShowAuthPopupMutation } from "coral-stream/common/AuthPopup";
import WarningError from "coral-stream/common/WarningError";
import { SetCommentIDMutation } from "coral-stream/mutations";

import { PostCommentFormContainer_settings } from "coral-stream/__generated__/PostCommentFormContainer_settings.graphql";
import { PostCommentFormContainer_story } from "coral-stream/__generated__/PostCommentFormContainer_story.graphql";
import { PostCommentFormContainer_viewer } from "coral-stream/__generated__/PostCommentFormContainer_viewer.graphql";
import {
  COMMENT_SORT,
  COMMENTS_TAB,
} from "coral-stream/__generated__/StreamContainerLocal.graphql";

import {
  getSubmitStatus,
  shouldTriggerSettingsRefresh,
  shouldTriggerViewerRefresh,
  SubmitStatus,
} from "../../helpers";
import RefreshSettingsFetch from "../../RefreshSettingsFetch";
import RefreshViewerFetch from "../../RefreshViewerFetch";
import { RTE_RESET_VALUE } from "../../RTE/RTE";
import {
  FormProps,
  OnChangeHandler,
  OnSubmitHandler,
} from "../CommentForm/CommentForm";
import { CreateCommentMutation } from "./CreateCommentMutation";
import PostCommentForm from "./PostCommentForm";
import PostCommentFormClosed from "./PostCommentFormClosed";
import PostCommentFormClosedSitewide from "./PostCommentFormClosedSitewide";
import PostCommentFormFake from "./PostCommentFormFake";
import PostReviewOrQuestion, { Toggle } from "./PostReviewOrQuestion";

interface Props {
  settings: PostCommentFormContainer_settings;
  viewer: PostCommentFormContainer_viewer | null;
  story: PostCommentFormContainer_story;
  tab?: COMMENTS_TAB;
  onChangeTab?: (tab: COMMENTS_TAB) => void;
  commentsOrderBy?: COMMENT_SORT;
}

const contextKey = "postCommentFormBody";

/**
 * A temporary variable to save draft when user is not logged in.
 * This will be restored after the stream has refreshed.
 */
let preserveNotLoggedInDraft = "";
let preserveNotLoggedInRatingsTab: Toggle | undefined;

export const PostCommentFormContainer: FunctionComponent<Props> = ({
  settings,
  viewer,
  story,
  tab,
  onChangeTab,
  commentsOrderBy,
}) => {
  const { sessionStorage } = useCoralContext();
  const refreshSettings = useFetch(RefreshSettingsFetch);
  const refreshViewer = useFetch(RefreshViewerFetch);
  const createComment = useMutation(CreateCommentMutation);
  const showAuthPopup = useMutation(ShowAuthPopupMutation);
  const setCommentID = useMutation(SetCommentIDMutation);

  // nudge will turn on the nudging behavior on the server
  const [nudge, setNudge] = useState(true);
  const [initialValues, setInitialValues] = useState<FormProps>();
  const [draft, setDraft] = useState(preserveNotLoggedInDraft);
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);
  const [toggle, setToggle] = useState<Toggle | undefined>(
    preserveNotLoggedInRatingsTab
  );

  const initialized = !!initialValues;

  const disabled =
    settings.disableCommenting.enabled ||
    story.isClosed ||
    !!viewer?.scheduledDeletionDate;

  const isRatingsAndReviews =
    story.settings.mode === GQLSTORY_MODE.RATINGS_AND_REVIEWS;
  const isQA = story.settings.mode === GQLSTORY_MODE.QA;

  useEffect(() => {
    const init = async () => {
      const body = await sessionStorage.getItem(contextKey);
      if (body) {
        return setInitialValues({ body });
      }

      return setInitialValues({ body: draft });
    };

    preserveNotLoggedInDraft = "";

    void init();

    return () => {
      // Keep comment draft around. User might just have signed in and caused a
      // reload.
      preserveNotLoggedInDraft = draft;
    };
  }, [draft, sessionStorage]);

  const handleOnSubmit: OnSubmitHandler = async (input, form) => {
    try {
      const response = await createComment({
        storyID: story.id,
        nudge,
        commentsOrderBy,
        body: input.body,
        rating: input.rating,
        media: input.media,
      });

      const status = getSubmitStatus(response);

      // Change tab *after* successfully creating comment to try avoiding race condition.
      if (onChangeTab) {
        if (
          response.edge.node.tags.some(({ code }) => code === GQLTAG.REVIEW)
        ) {
          if (tab !== "REVIEWS") {
            onChangeTab("REVIEWS");
          }
        } else if (
          response.edge.node.tags.some(({ code }) => code === GQLTAG.QUESTION)
        ) {
          if (tab !== "QUESTIONS") {
            onChangeTab("QUESTIONS");
          }
        } else if (tab === "FEATURED_COMMENTS") {
          onChangeTab("ALL_COMMENTS");
        }
      }

      if (status !== "RETRY") {
        if (input.rating) {
          setToggle(undefined);
        }

        setDraft("");
        form
          .getRegisteredFields()
          .forEach((name) => form.resetFieldState(name));
        form.initialize({ body: RTE_RESET_VALUE });
      }

      setNudge(true);
      setSubmitStatus(status);
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
  };

  const handleOnChange: OnChangeHandler = (state, form) => {
    if (submitStatus && state.dirty) {
      setSubmitStatus(null);
    }

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
      (form as any).restart({ body: RTE_RESET_VALUE });
    }
  };

  const handleSignIn = () => {
    void showAuthPopup({ view: "SIGN_IN" });
  };

  const onToggle = (t: Toggle) => {
    if (!viewer) {
      // Preserve the current tab we're switching to and trigger the sign in.
      preserveNotLoggedInRatingsTab = t;
      handleSignIn();
      return;
    }

    setToggle(t);
  };

  const onClickReview = () => {
    if (!story.viewerRating?.tags.some(({ code }) => code === GQLTAG.REVIEW)) {
      return;
    }

    void setCommentID({ id: story.viewerRating.id });
  };

  if (!initialized) {
    return null;
  }

  if (!viewer) {
    if (settings.disableCommenting.enabled) {
      return (
        <PostCommentFormClosedSitewide
          story={story}
          message={settings.disableCommenting.message}
          showMessageBox={story.settings.messageBox.enabled}
        />
      );
    }

    if (story.isClosed) {
      return (
        <PostCommentFormClosed
          story={story}
          message={settings.closeCommenting.message}
          showMessageBox={story.settings.messageBox.enabled}
        />
      );
    }

    if (isRatingsAndReviews) {
      return <PostReviewOrQuestion toggle={toggle} onToggle={onToggle} />;
    }

    return (
      <PostCommentFormFake
        rteConfig={settings.rte}
        draft={draft}
        onDraftChange={setDraft}
        story={story}
        showMessageBox={story.settings.messageBox.enabled}
        onSignIn={handleSignIn}
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

  const rating = story.viewerRating?.rating || undefined;
  const showReview = story.viewerRating?.tags.some(
    ({ code }) => code === GQLTAG.REVIEW
  );

  const mode = isRatingsAndReviews
    ? toggle === "RATE_AND_REVIEW"
      ? "rating"
      : "question"
    : isQA
    ? "question"
    : "comments";

  if (isRatingsAndReviews && !toggle) {
    return (
      <PostReviewOrQuestion
        toggle={toggle}
        rating={rating}
        onShowReview={showReview ? onClickReview : undefined}
        onToggle={onToggle}
      />
    );
  }

  return (
    <>
      {isRatingsAndReviews && (
        <PostReviewOrQuestion
          toggle={toggle}
          rating={rating}
          onShowReview={showReview ? onClickReview : undefined}
          onToggle={onToggle}
        />
      )}
      <PostCommentForm
        mode={mode}
        siteID={story.site.id}
        story={story}
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
        showMessageBox={story.settings.messageBox.enabled}
      />
    </>
  );
};

const enhanced = withFragmentContainer<Props>({
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
    fragment PostCommentFormContainer_story on Story {
      id
      isClosed
      site {
        id
      }
      viewerRating {
        id
        tags {
          code
        }
        rating
      }
      settings {
        messageBox {
          enabled
        }
        experts {
          id
        }
        mode
      }
      ...MessageBoxContainer_story
    }
  `,
  viewer: graphql`
    fragment PostCommentFormContainer_viewer on User {
      id
      scheduledDeletionDate
    }
  `,
})(PostCommentFormContainer);

export type PostCommentFormContainerProps = PropTypesOf<typeof enhanced>;

export default enhanced;
