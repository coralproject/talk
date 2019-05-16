import React, { FunctionComponent } from "react";

import { Markdown } from "coral-framework/components";
import { PropTypesOf } from "coral-framework/types";
import { CallOut } from "coral-ui/components";

import MessageBoxContainer from "../containers/MessageBoxContainer";

import styles from "./PostCommentFormClosed.css";

interface Props {
  message: string;
  showMessageBox?: boolean;
  story: PropTypesOf<typeof MessageBoxContainer>["story"];
}
const PostCommentFormClosed: FunctionComponent<Props> = props => (
  <div>
    {props.showMessageBox && (
      <MessageBoxContainer story={props.story} className={styles.messageBox} />
    )}
    <CallOut fullWidth>
      <Markdown>{props.message}</Markdown>
    </CallOut>
  </div>
);

export default PostCommentFormClosed;
