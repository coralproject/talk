import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
// import cn from "classnames";
import { FormApi, FormState } from "final-form";
import React, {
  EventHandler,
  FunctionComponent,
  MouseEvent,
  Ref,
  useCallback,
} from "react";

import { useViewerEvent } from "coral-framework/lib/events";
import { OnSubmit } from "coral-framework/lib/form";
// import CLASSES from "coral-stream/classes";
import { ReplyCommentFocusEvent } from "coral-stream/events";
import { AriaInfo } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import RTEContainer from "../../RTE";
import CommentForm from "../../Stream/CommentForm";
import ReplyTo from "./ReplyTo";

// import styles from "./ReplyCommentForm.css";

export interface ReplyCommentFormProps {
  id: string;
  className?: string;
  onSubmit: OnSubmit<any>;
  onCancel?: EventHandler<MouseEvent<any>>;
  onChange?: (state: FormState<any>, form: FormApi) => void;
  initialValues?: any;
  rteRef?: Ref<CoralRTE>;
  parentUsername: string | null;
  min: number | null;
  max: number | null;
  disabled?: boolean;
  disabledMessage?: React.ReactNode;
  rteConfig: PropTypesOf<typeof RTEContainer>["config"];
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
        onSubmit={props.onSubmit}
        initialValues={props.initialValues}
        min={props.min}
        max={props.max}
        disabled={props.disabled}
        classNameRoot="createReplyComment"
        disabledMessage={props.disabledMessage}
        onFocus={onFocus}
        action="CREATE"
        onCancel={props.onCancel}
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
      />
    </div>
  );
};

export default ReplyCommentForm;
