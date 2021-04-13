import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
import React, {
  EventHandler,
  FocusEvent,
  FunctionComponent,
  MouseEvent,
  Ref,
} from "react";

import { OnSubmit } from "coral-framework/lib/form";
import { AriaInfo } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import CommentForm from "../../Comments/Stream/CommentForm";
import { OnChangeHandler } from "../../Comments/Stream/CommentForm/CommentForm";
import PostCommentSubmitStatusContainer from "../../Comments/Stream/PostCommentForm/PostCommentSubmitStatusContainer";

import styles from "./LiveReplyCommentForm.css";

export interface LiveCommentFormProps {
  className?: string;
  onSubmit: OnSubmit<any>;
  onCancel?: EventHandler<MouseEvent<any>>;
  onChange?: OnChangeHandler;
  initialValues?: any;
  rteRef?: Ref<CoralRTE>;
  min: number | null;
  max: number | null;
  disabled?: boolean;
  siteID: string;
  disabledMessage?: React.ReactNode;
  rteConfig: PropTypesOf<typeof CommentForm>["rteConfig"];
  mediaConfig: PropTypesOf<typeof CommentForm>["mediaConfig"];
  submitStatus: PropTypesOf<PostCommentSubmitStatusContainer>["status"];
  onFocus?: EventHandler<FocusEvent>;
  onBlur?: EventHandler<FocusEvent>;
  autoFocus?: boolean;
}

const classes: PropTypesOf<typeof CommentForm>["classes"] = {
  // TODO (@cvle): Setup the right classes.
  /*
  root: CLASSES.editComment.$root,
  disabledMessage: CLASSES.editComment.expiredTime,
  cancelButton: CLASSES.editComment.cancel,
  submitButton: CLASSES.editComment.submit,
  rteFocus: CLASSES.editComment.rteFocus,
  */
};

const LiveCommentForm: FunctionComponent<LiveCommentFormProps> = (props) => {
  const inputID = "liveChat-replyCommentForm-field";

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

  return (
    <div className={styles.root}>
      <Localized
        id="liveChat-replyCommentForm-rte"
        attrs={{ placeholder: true, submitButtonTitle: true }}
      >
        <CommentForm
          classes={classes}
          rteRef={props.rteRef}
          siteID={props.siteID}
          onSubmit={props.onSubmit}
          onChange={props.onChange}
          initialValues={props.initialValues}
          min={props.min}
          max={props.max}
          disabled={props.disabled}
          disabledMessage={props.disabledMessage}
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onCancel={props.onCancel}
          mediaConfig={mediaConfig}
          placeholder="Write a reply..."
          bodyInputID={inputID}
          bodyLabel={
            <>
              <Localized id="liveChat-replyCommentForm-rteLabel">
                <AriaInfo component="label" htmlFor={inputID}>
                  Write a reply...
                </AriaInfo>
              </Localized>
            </>
          }
          rteConfig={props.rteConfig}
          mode="chat"
          submitStatus={
            <PostCommentSubmitStatusContainer status={props.submitStatus} />
          }
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus={props.autoFocus}
          autoHideToolbar
          focusAfterSubmit
          submitButtonTitle="Submit"
          featureOverrides={{
            bold: true,
            italic: true,
            blockquote: true,
            bulletList: false,
          }}
        />
      </Localized>
    </div>
  );
};

export default LiveCommentForm;
