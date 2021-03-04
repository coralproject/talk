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
import { LiveCreateCommentFocusEvent } from "coral-stream/events";
import { AriaInfo } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";
import CommentForm from "../Comments/Stream/CommentForm";
import { OnChangeHandler } from "../Comments/Stream/CommentForm/CommentForm";
import PostCommentSubmitStatusContainer from "../Comments/Stream/PostCommentForm/PostCommentSubmitStatusContainer";

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
}

const LiveCommentForm: FunctionComponent<LiveCommentFormProps> = (props) => {
  const inputID = `comments-LiveCommentForm-rte`;
  const emitFocusEvent = useViewerEvent(LiveCreateCommentFocusEvent);
  const onFocus = useCallback(() => {
    emitFocusEvent();
  }, [emitFocusEvent]);
  // TODO @cvle.
  const classNameRoot = "createComment";

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
        classNameRoot={classNameRoot}
        disabledMessage={props.disabledMessage}
        onFocus={onFocus}
        onCancel={props.onCancel}
        mediaConfig={props.mediaConfig}
        placeHolderId="comments-liveCommentForm-rte"
        placeholder="Write a message..."
        bodyInputID={inputID}
        bodyLabel={
          <>
            <Localized id="comments-liveCommentForm-rteLabel">
              <AriaInfo component="label" htmlFor={inputID}>
                Write a message...
              </AriaInfo>
            </Localized>
          </>
        }
        rteConfig={props.rteConfig}
        mode="chat"
        submitStatus={
          <PostCommentSubmitStatusContainer status={props.submitStatus} />
        }
      />
    </div>
  );
};

export default LiveCommentForm;
