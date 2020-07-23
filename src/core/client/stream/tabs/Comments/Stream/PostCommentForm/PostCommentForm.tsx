import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import { FormApi, FormState } from "final-form";
import React, { FunctionComponent, useCallback } from "react";

import { useViewerEvent } from "coral-framework/lib/events";
import { FormError, OnSubmit } from "coral-framework/lib/form";
import { GQLSTORY_MODE } from "coral-framework/schema";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { CreateCommentFocusEvent } from "coral-stream/events";
import { AriaInfo } from "coral-ui/components/v2";

import CommentForm from "../CommentForm";
import MessageBoxContainer from "../MessageBoxContainer";
import PostCommentSubmitStatusContainer from "./PostCommentSubmitStatusContainer";

import styles from "./PostCommentForm.css";

interface MediaProps {
  type: "twitter" | "youtube" | "giphy";
  url: string;
  id: string | null;
}

interface FormProps {
  body: string;
  media?: MediaProps;
}

interface FormSubmitProps extends FormProps, FormError {}

interface StorySettings {
  settings?: {
    mode?: "COMMENTS" | "QA" | "%future added value" | null;
  };
}

interface Props {
  onSubmit: OnSubmit<FormSubmitProps>;
  onChange?: (state: FormState<any>, form: FormApi) => void;
  initialValues?: any;
  min: number | null;
  max: number | null;
  disabled?: boolean;
  disabledMessage?: React.ReactNode;
  submitStatus: PropTypesOf<PostCommentSubmitStatusContainer>["status"];
  showMessageBox?: boolean;
  siteID: string;
  story: PropTypesOf<typeof MessageBoxContainer>["story"] & StorySettings;
  rteConfig: PropTypesOf<typeof CommentForm>["rteConfig"];
  mediaConfig: PropTypesOf<typeof CommentForm>["mediaConfig"];
}

const PostCommentForm: FunctionComponent<Props> = (props) => {
  const isQA =
    props.story.settings && props.story.settings.mode === GQLSTORY_MODE.QA;
  const emitFocusEvent = useViewerEvent(CreateCommentFocusEvent);
  const onFocus = useCallback(() => {
    emitFocusEvent();
  }, [emitFocusEvent]);
  return (
    <div className={CLASSES.createComment.$root}>
      {props.showMessageBox && (
        <MessageBoxContainer
          story={props.story}
          className={cn(CLASSES.createComment.message, styles.messageBox)}
        />
      )}
      <CommentForm
        siteID={props.siteID}
        onSubmit={props.onSubmit}
        onChange={props.onChange}
        min={props.min}
        initialValues={props.initialValues}
        max={props.max}
        disabled={props.disabled}
        disabledMessage={props.disabledMessage}
        rteConfig={props.rteConfig}
        placeHolderId="comments-postCommentForm-rte"
        placeholder="Post a comment"
        mediaConfig={props.mediaConfig}
        onFocus={onFocus}
        classNameRoot="createComment"
        bodyInputID="comments-postCommentForm-field"
        bodyLabel={
          isQA ? (
            <Localized id="qa-postQuestionForm-rteLabel">
              <AriaInfo
                component="label"
                htmlFor="comments-postCommentForm-field"
              >
                Post a question
              </AriaInfo>
            </Localized>
          ) : (
            <Localized id="comments-postCommentForm-rteLabel">
              <AriaInfo
                component="label"
                htmlFor="comments-postCommentForm-field"
              >
                Post a comment
              </AriaInfo>
            </Localized>
          )
        }
        submitStatus={
          <PostCommentSubmitStatusContainer status={props.submitStatus} />
        }
        topBorder={false}
      />
    </div>
  );
};

export default PostCommentForm;
