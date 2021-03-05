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
  showToolbar?: boolean;
  onFocus?: EventHandler<FocusEvent>;
  onBlur?: EventHandler<FocusEvent>;
}

const LiveCommentForm: FunctionComponent<LiveCommentFormProps> = (props) => {
  const inputID = `comments-LiveCommentReplyForm-rte`;
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
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        showToolbar={props.showToolbar}
        onCancel={props.onCancel}
        mediaConfig={props.mediaConfig}
        placeHolderId="comments-liveCommentForm-rte"
        placeholder="Write a reply..."
        bodyInputID={inputID}
        bodyLabel={
          <>
            <Localized id="comments-liveCommentForm-rteLabel">
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
      />
    </div>
  );
};

export default LiveCommentForm;
