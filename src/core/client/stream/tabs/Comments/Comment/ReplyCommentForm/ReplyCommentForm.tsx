import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
import React, {
  EventHandler,
  FunctionComponent,
  MouseEvent,
  Ref,
  useCallback,
} from "react";

import { useViewerEvent } from "coral-framework/lib/events";
import { OnSubmit } from "coral-framework/lib/form";
import CLASSES from "coral-stream/classes";
import { ReplyCommentFocusEvent } from "coral-stream/events";
import { AriaInfo } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import RTEContainer from "../../RTE";
import CommentForm from "../../Stream/CommentForm";
import { OnChangeHandler } from "../../Stream/CommentForm/CommentForm";
import ReplyTo from "./ReplyTo";

export interface ReplyCommentFormProps {
  id: string;
  className?: string;
  onSubmit: OnSubmit<any>;
  onCancel?: EventHandler<MouseEvent<any>>;
  onChange?: OnChangeHandler;
  initialValues?: any;
  rteRef?: Ref<CoralRTE>;
  parentUsername: string | null;
  min: number | null;
  max: number | null;
  disabled?: boolean;
  siteID: string;
  disabledMessage?: React.ReactNode;
  rteConfig: PropTypesOf<typeof RTEContainer>["config"];
  mediaConfig: PropTypesOf<typeof CommentForm>["mediaConfig"];
}

const classes: PropTypesOf<typeof CommentForm>["classes"] = {
  root: CLASSES.createReplyComment.$root,
  disabledMessage: CLASSES.createReplyComment.disabledMessage,
  cancelButton: CLASSES.createReplyComment.cancel,
  submitButton: CLASSES.createReplyComment.submit,
  rteFocus: CLASSES.createReplyComment.rteFocus,
};

const ReplyCommentForm: FunctionComponent<ReplyCommentFormProps> = (props) => {
  const inputID = `comments-replyCommentForm-rte-${props.id}`;
  const emitFocusEvent = useViewerEvent(ReplyCommentFocusEvent);
  const onFocus = useCallback(() => {
    emitFocusEvent();
  }, [emitFocusEvent]);

  return (
    <div>
      <Localized
        id="comments-replyCommentForm-rte"
        attrs={{ placeholder: true }}
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
          onFocus={onFocus}
          onCancel={props.onCancel}
          mediaConfig={props.mediaConfig}
          placeholder="Write a reply"
          bodyInputID={inputID}
          bodyLabel={
            <>
              <Localized id="comments-replyCommentForm-rteLabel">
                <AriaInfo component="label" htmlFor={inputID}>
                  Write a reply
                </AriaInfo>
              </Localized>
              {props.parentUsername && (
                <ReplyTo username={props.parentUsername} />
              )}
            </>
          }
          rteConfig={props.rteConfig}
          topBorder={false}
        />
      </Localized>
    </div>
  );
};

export default ReplyCommentForm;
