import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
import React, { EventHandler, FunctionComponent, MouseEvent, Ref } from "react";

import { OnSubmit } from "coral-framework/lib/form";
import CLASSES from "coral-stream/classes";
import Timestamp from "coral-stream/common/Timestamp";
import {
  AriaInfo,
  Message,
  MessageIcon,
  RelativeTime,
} from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import CommentForm from "../../Stream/CommentForm";
import TopBarLeft from "../TopBarLeft";
import Username from "../Username";

import styles from "./EditCommentForm.css";

export interface EditCommentFormProps {
  id: string;
  className?: string;
  author: {
    username: string | null;
  } | null;
  createdAt: string;
  editableUntil: string;
  onSubmit: OnSubmit<any>;
  onCancel?: EventHandler<MouseEvent<any>>;
  onClose?: EventHandler<MouseEvent<any>>;
  initialValues?: any;
  rteRef?: Ref<CoralRTE>;
  expired?: boolean;
  min: number | null;
  max: number | null;
  rteConfig: PropTypesOf<typeof CommentForm>["rteConfig"];
  mediaConfig: PropTypesOf<typeof CommentForm>["mediaConfig"];
  siteID: string;
}

const classes: PropTypesOf<typeof CommentForm>["classes"] = {
  root: CLASSES.editComment.$root,
  disabledMessage: CLASSES.editComment.expiredTime,
  cancelButton: CLASSES.editComment.cancel,
  submitButton: CLASSES.editComment.submit,
  rteFocus: CLASSES.editComment.rteFocus,
};

const EditCommentForm: FunctionComponent<EditCommentFormProps> = (props) => {
  const inputID = `comments-editCommentForm-rte-${props.id}`;

  return (
    <div>
      <div>
        <TopBarLeft>
          {props.author && props.author.username && (
            <div>
              <Username>{props.author.username}</Username>
            </div>
          )}
          <Timestamp>{props.createdAt}</Timestamp>
        </TopBarLeft>
      </div>

      <Localized
        id="comments-editCommentForm-rte"
        attrs={{ placeholder: true }}
      >
        <CommentForm
          classes={classes}
          siteID={props.siteID}
          onSubmit={props.onSubmit}
          min={props.min}
          max={props.max}
          disabled={props.expired}
          bodyInputID={inputID}
          initialValues={props.initialValues}
          onCancel={props.onCancel}
          mediaConfig={props.mediaConfig}
          placeholder="Edit comment"
          topBorder={true}
          disabledMessage={
            <Localized id="comments-editCommentForm-editTimeExpired">
              Edit time has expired. You can no longer edit this comment. Why
              not post another one?
            </Localized>
          }
          bodyLabel={
            <Localized id="comments-editCommentForm-rteLabel">
              <AriaInfo component="label" htmlFor={inputID}>
                Edit comment
              </AriaInfo>
            </Localized>
          }
          className={styles.root}
          rteConfig={props.rteConfig}
          submitButtonContent={
            <Localized id="comments-commentForm-saveChanges">
              Save changes
            </Localized>
          }
          message={
            !props.expired &&
            props.editableUntil && (
              <Message className={CLASSES.editComment.remainingTime} fullWidth>
                <MessageIcon>alarm</MessageIcon>
                <Localized
                  id="comments-editCommentForm-editRemainingTime"
                  time={<RelativeTime date={props.editableUntil} live />}
                >
                  <span>{"Edit: <time></time> remaining"}</span>
                </Localized>
              </Message>
            )
          }
          noSubmitWhenPristine
        />
      </Localized>
    </div>
  );
};

export default EditCommentForm;
