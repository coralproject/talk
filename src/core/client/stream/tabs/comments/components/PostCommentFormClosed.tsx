import React, { StatelessComponent } from "react";

import { Markdown } from "talk-framework/components";
import { PropTypesOf } from "talk-framework/types";
import { CallOut } from "talk-ui/components";

import MessageBoxContainer from "../containers/MessageBoxContainer";

import styles from "./PostCommentFormClosed.css";

interface Props {
  message: string;
  showMessageBox?: boolean;
  story: PropTypesOf<typeof MessageBoxContainer>["story"];
}
const PostCommentFormClosed: StatelessComponent<Props> = props => (
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
