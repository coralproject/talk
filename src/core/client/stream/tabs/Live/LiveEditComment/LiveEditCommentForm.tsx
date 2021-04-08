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

export interface LiveEditCommentFormProps {
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
  rteConfig: PropTypesOf<typeof CommentForm>["rteConfig"];
  mediaConfig: PropTypesOf<typeof CommentForm>["mediaConfig"];
  showToolbar?: boolean;
  editableUntil?: string;
  onFocus?: EventHandler<FocusEvent>;
  onBlur?: EventHandler<FocusEvent>;
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

const LiveEditCommentForm: FunctionComponent<LiveEditCommentFormProps> = (
  props
) => {
  const inputID = "liveChat-editCommentForm-field";

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
    <div>
      <Localized
        id="liveChat-editCommentForm-rte"
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
          disabledMessage={
            <Localized id="liveChat-editCommentForm-editTimeExpired">
              Edit time has expired. You can no longer edit this comment. Why
              not post another one?
            </Localized>
          }
          onFocus={props.onFocus}
          onBlur={props.onBlur}
          onCancel={props.onCancel}
          mediaConfig={mediaConfig}
          placeholder="Edit Comment"
          bodyInputID={inputID}
          bodyLabel={
            <>
              <Localized id="liveChat-editCommentForm-rteLabel">
                <AriaInfo component="label" htmlFor={inputID}>
                  Edit message
                </AriaInfo>
              </Localized>
            </>
          }
          rteConfig={props.rteConfig}
          mode="chat"
          submitButtonTitle="Save changes"
          autoHideToolbar
          focusAfterSubmit
        />
      </Localized>
    </div>
  );
};

export default LiveEditCommentForm;
