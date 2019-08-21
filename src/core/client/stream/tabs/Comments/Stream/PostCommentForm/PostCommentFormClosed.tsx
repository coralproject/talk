import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Markdown } from "coral-framework/components";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { CallOut } from "coral-ui/components";

import MessageBoxContainer from "../MessageBoxContainer";

import styles from "./PostCommentFormClosed.css";

interface Props {
  message: string;
  showMessageBox?: boolean;
  story: PropTypesOf<typeof MessageBoxContainer>["story"];
}
const PostCommentFormClosed: FunctionComponent<Props> = props => (
  <div className={CLASSES.createComment.$root}>
    {props.showMessageBox && (
      <MessageBoxContainer
        story={props.story}
        className={cn(CLASSES.createComment.message, styles.messageBox)}
      />
    )}
    <CallOut fullWidth className={cn(CLASSES.createComment.closed)}>
      <Markdown>{props.message}</Markdown>
    </CallOut>
  </div>
);

export default PostCommentFormClosed;
