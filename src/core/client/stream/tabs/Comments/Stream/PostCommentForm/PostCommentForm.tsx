import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, Ref, useCallback } from "react";

import { useViewerEvent } from "coral-framework/lib/events";
import { FormError, OnSubmit } from "coral-framework/lib/form";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { POST_COMMENT_FORM_ID } from "coral-stream/constants";
import { CreateCommentFocusEvent } from "coral-stream/events";
import { AriaInfo } from "coral-ui/components/v2";

import CommentForm from "../CommentForm";
import { OnChangeHandler } from "../CommentForm/CommentForm";
import MessageBoxContainer from "../MessageBoxContainer";
import PostCommentSubmitStatusContainer from "./PostCommentSubmitStatusContainer";

import styles from "./PostCommentForm.css";

interface MediaProps {
  type: "twitter" | "youtube" | "giphy" | "external";
  url: string;
  id: string | null;
}

interface FormProps {
  body: string;
  media?: MediaProps;
}

interface FormSubmitProps extends FormProps, FormError {}

type Mode = "rating" | "question" | "comments";

interface TranslationEntry {
  Localized: React.ReactElement;
  text: string;
}

interface Translations {
  placeholder: TranslationEntry;
  label: TranslationEntry;
}

// TODO: (cvle) refactor this to make translations statically queriable for future tooling support.
const translations: Record<Mode, Translations> = {
  rating: {
    placeholder: {
      Localized: (
        <Localized
          id="comments-addAReviewForm-rte"
          attrs={{ placeholder: true }}
        />
      ),
      text: "Add a review (optional)",
    },
    label: {
      Localized: <Localized id="comments-addAReviewForm-rteLabel" />,
      text: "Add a review (optional)",
    },
  },
  comments: {
    placeholder: {
      Localized: (
        <Localized
          id="comments-postCommentForm-rte"
          attrs={{ placeholder: true }}
        />
      ),
      text: "Post a comment",
    },
    label: {
      Localized: <Localized id="comments-postCommentForm-rteLabel" />,
      text: "Post a comment",
    },
  },
  question: {
    placeholder: {
      Localized: (
        <Localized id="qa-postQuestionForm-rte" attrs={{ placeholder: true }} />
      ),
      text: "Post a question",
    },
    label: {
      Localized: <Localized id="qa-postQuestionForm-rteLabel" />,
      text: "Post a question",
    },
  },
};

interface Props {
  disabled?: boolean;
  disabledMessage?: React.ReactNode;
  initialValues?: FormProps;
  max: number | null;
  mediaConfig: PropTypesOf<typeof CommentForm>["mediaConfig"];
  min: number | null;
  mode?: Mode;
  onChange?: OnChangeHandler;
  onSubmit: OnSubmit<FormSubmitProps>;
  rteConfig: PropTypesOf<typeof CommentForm>["rteConfig"];
  showMessageBox?: boolean;
  siteID: string;
  story: PropTypesOf<typeof MessageBoxContainer>["story"];
  submitStatus: PropTypesOf<PostCommentSubmitStatusContainer>["status"];
  rteRef?: Ref<CoralRTE>;
}

const classes: PropTypesOf<typeof CommentForm>["classes"] = {
  root: CLASSES.createComment.$root,
  disabledMessage: CLASSES.createComment.disabledMessage,
  cancelButton: CLASSES.createComment.cancel,
  submitButton: CLASSES.createComment.submit,
  rteFocus: CLASSES.createComment.rteFocus,
};

const PostCommentForm: FunctionComponent<Props> = ({
  disabled = false,
  disabledMessage,
  initialValues,
  max,
  mediaConfig,
  min,
  mode = "comments",
  onChange,
  onSubmit,
  rteConfig,
  showMessageBox,
  siteID,
  story,
  submitStatus,
  rteRef,
}) => {
  const translation = translations[mode];

  const emitFocusEvent = useViewerEvent(CreateCommentFocusEvent);
  const onFocus = useCallback(() => {
    emitFocusEvent();
  }, [emitFocusEvent]);

  return (
    <div id={POST_COMMENT_FORM_ID} className={CLASSES.createComment.$root}>
      {showMessageBox && (
        <MessageBoxContainer
          story={story}
          className={cn(CLASSES.createComment.message, styles.messageBox)}
        />
      )}
      {React.cloneElement(
        translation.placeholder.Localized,
        {},
        <CommentForm
          classes={classes}
          rteRef={rteRef}
          siteID={siteID}
          onSubmit={onSubmit}
          onChange={onChange}
          min={min}
          topBorder={!showMessageBox && mode !== "rating"}
          initialValues={initialValues}
          max={max}
          disabled={disabled}
          disabledMessage={disabledMessage}
          mode={mode === "rating" ? "rating" : "comment"}
          rteConfig={rteConfig}
          placeholder={translation.placeholder.text}
          mediaConfig={mediaConfig}
          onFocus={onFocus}
          bodyInputID="comments-postCommentForm-field"
          bodyLabel={React.cloneElement(
            translation.label.Localized,
            {},
            <AriaInfo
              component="label"
              htmlFor="comments-postCommentForm-field"
            >
              {translation.label.text}
            </AriaInfo>
          )}
          submitStatus={
            <PostCommentSubmitStatusContainer status={submitStatus} />
          }
        />
      )}
    </div>
  );
};

export default PostCommentForm;
