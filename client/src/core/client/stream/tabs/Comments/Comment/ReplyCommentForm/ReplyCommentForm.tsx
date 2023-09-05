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
import { ReplyCommentFocusEvent } from "coral-stream/events";
import { AriaInfo } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import RTEContainer from "../../RTE";
import CommentForm from "../../Stream/CommentForm";
import { OnChangeHandler } from "../../Stream/CommentForm/CommentForm";
import ReplyingTo from "./ReplyingTo";

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

const ReplyCommentForm: FunctionComponent<ReplyCommentFormProps> = (props) => {
  const inputID = `comments-replyCommentForm-rte-${props.id}`;
  const emitFocusEvent = useViewerEvent(ReplyCommentFocusEvent);
  const onFocus = useCallback(() => {
    emitFocusEvent();
  }, [emitFocusEvent]);

  return (
    <div>
      <CommentForm
        rteRef={props.rteRef}
        siteID={props.siteID}
        onSubmit={props.onSubmit}
        onChange={props.onChange}
        initialValues={props.initialValues}
        min={props.min}
        max={props.max}
        disabled={props.disabled}
        classNameRoot="createReplyComment"
        disabledMessage={props.disabledMessage}
        onFocus={onFocus}
        onCancel={props.onCancel}
        mediaConfig={props.mediaConfig}
        placeHolderId="comments-replyCommentForm-rte"
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
              <ReplyingTo username={props.parentUsername} />
            )}
          </>
        }
        rteConfig={props.rteConfig}
        topBorder={false}
      />
    </div>
  );
};

export default ReplyCommentForm;
