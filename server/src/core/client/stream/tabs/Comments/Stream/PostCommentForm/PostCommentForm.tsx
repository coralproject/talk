import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent, useCallback } from "react";

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
  id: string;
  text: string;
}

interface Translations {
  placeholder: TranslationEntry;
  label: TranslationEntry;
}

const translations: Record<Mode, Translations> = {
  rating: {
    placeholder: {
      id: "comments-addAReviewForm-rte",
      text: "Add a review (optional)",
    },
    label: {
      id: "comments-addAReviewForm-rteLabel",
      text: "Add a review (optional)",
    },
  },
  comments: {
    placeholder: {
      id: "comments-postCommentForm-rte",
      text: "Post a comment",
    },
    label: {
      id: "comments-postCommentForm-rteLabel",
      text: "Post a comment",
    },
  },
  question: {
    placeholder: {
      id: "qa-postQuestionForm-rte",
      text: "Post a question",
    },
    label: {
      id: "qa-postQuestionForm-rteLabel",
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
}

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
      <CommentForm
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
        placeHolderId={translation.placeholder.id}
        placeholder={translation.placeholder.text}
        mediaConfig={mediaConfig}
        onFocus={onFocus}
        classNameRoot="createComment"
        bodyInputID="comments-postCommentForm-field"
        bodyLabel={
          <Localized id={translation.label.id}>
            <AriaInfo
              component="label"
              htmlFor="comments-postCommentForm-field"
            >
              {translation.label.text}
            </AriaInfo>
          </Localized>
        }
        submitStatus={
          <PostCommentSubmitStatusContainer status={submitStatus} />
        }
      />
    </div>
  );
};

export default PostCommentForm;
