import { CoralRTE } from "@coralproject/rte";
import { Localized } from "@fluent/react/compat";
// import cn from "classnames";
import React, { EventHandler, FunctionComponent, MouseEvent, Ref } from "react";

import { OnSubmit } from "coral-framework/lib/form";
import CLASSES from "coral-stream/classes";
import Timestamp from "coral-stream/common/Timestamp";
import ValidationMessage from "coral-stream/common/ValidationMessage";
import { AriaInfo } from "coral-ui/components/v2";
import { PropTypesOf } from "coral-ui/types";

import CommentForm from "../../Stream/CommentForm";
import TopBarLeft from "../TopBarLeft";
import Username from "../Username";

// import styles from "./EditCommentForm.css";

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
  embedConfig: PropTypesOf<typeof CommentForm>["embedConfig"];
}

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

      <CommentForm
        onSubmit={props.onSubmit}
        min={props.min}
        max={props.max}
        disabled={props.expired}
        initialValues={props.initialValues}
        onCancel={props.onCancel}
        editableUntil={props.editableUntil}
        classNameRoot="editComment"
        embedConfig={props.embedConfig}
        expired={props.expired}
        action="UPDATE"
        disabledMessage={
          <Localized id="comments-editCommentForm-editTimeExpired">
            <ValidationMessage className={CLASSES.editComment.expiredTime}>
              Edit time has expired. You can no longer edit this comment. Why
              not post another one?
            </ValidationMessage>
          </Localized>
        }
        bodyLabel={
          <Localized id="comments-editCommentForm-rteLabel">
            <AriaInfo component="label" htmlFor={inputID}>
              Edit comment
            </AriaInfo>
          </Localized>
        }
        rteConfig={props.rteConfig}
      />
    </div>
  );
};

export default EditCommentForm;
