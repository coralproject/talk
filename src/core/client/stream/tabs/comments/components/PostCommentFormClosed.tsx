import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { CallOut } from "talk-ui/components";

import MessageBoxContainer from "../containers/MessageBoxContainer";

import styles from "./PostCommentFormClosed.css";

interface Props {
  showMessageBox?: boolean;
  story: PropTypesOf<typeof MessageBoxContainer>["story"];
  children?: React.ReactNode;
}
const PostCommentFormClosed: StatelessComponent<Props> = props => (
  <div>
    {props.showMessageBox && (
      <MessageBoxContainer story={props.story} className={styles.messageBox} />
    )}
    <CallOut fullWidth>{props.children}</CallOut>
  </div>
);

export default PostCommentFormClosed;
