import React, { StatelessComponent } from "react";

import { PropTypesOf } from "talk-framework/types";
import { CallOut, HorizontalGutter } from "talk-ui/components";

import MessageBoxContainer from "../containers/MessageBoxContainer";

import styles from "./PostCommentFormClosedSitewide.css";

interface Props {
  showMessageBox?: boolean;
  story: PropTypesOf<typeof MessageBoxContainer>["story"];
  children?: React.ReactNode;
}
const PostCommentFormClosedSitewide: StatelessComponent<Props> = props => (
  <HorizontalGutter size="double">
    <CallOut fullWidth className={styles.root}>
      {props.children}
    </CallOut>
    {props.showMessageBox && <MessageBoxContainer story={props.story} />}
  </HorizontalGutter>
);

export default PostCommentFormClosedSitewide;
