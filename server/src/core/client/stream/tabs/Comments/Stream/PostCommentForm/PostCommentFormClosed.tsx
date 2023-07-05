import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Markdown } from "coral-framework/components";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { Icon } from "coral-ui/components/v2";
import { CallOut } from "coral-ui/components/v3";

import MessageBoxContainer from "../MessageBoxContainer";

import styles from "./PostCommentFormClosed.css";

interface Props {
  message: string;
  showMessageBox?: boolean;
  story: PropTypesOf<typeof MessageBoxContainer>["story"];
}
const PostCommentFormClosed: FunctionComponent<Props> = (props) => (
  <div className={CLASSES.createComment.$root}>
    {props.showMessageBox && (
      <MessageBoxContainer
        story={props.story}
        className={cn(CLASSES.createComment.message, styles.messageBox)}
      />
    )}
    <CallOut
      color="mono"
      icon={<Icon size="sm">feedback</Icon>}
      className={cn(CLASSES.createComment.closed)}
      titleWeight="semiBold"
      title={<Markdown>{props.message}</Markdown>}
    />
  </div>
);

export default PostCommentFormClosed;
