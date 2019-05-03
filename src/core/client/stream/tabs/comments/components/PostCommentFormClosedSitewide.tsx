import React, { FunctionComponent } from "react";

import { Markdown } from "talk-framework/components";
import { PropTypesOf } from "talk-framework/types";
import { CallOut, HorizontalGutter } from "talk-ui/components";

import MessageBoxContainer from "../containers/MessageBoxContainer";

import styles from "./PostCommentFormClosedSitewide.css";

interface Props {
  message: string;
  showMessageBox?: boolean;
  story: PropTypesOf<typeof MessageBoxContainer>["story"];
}
const PostCommentFormClosedSitewide: FunctionComponent<Props> = props => (
  <HorizontalGutter size="double">
    <CallOut fullWidth className={styles.root}>
      <Markdown className={styles.message}>{props.message}</Markdown>
    </CallOut>
    {props.showMessageBox && <MessageBoxContainer story={props.story} />}
  </HorizontalGutter>
);

export default PostCommentFormClosedSitewide;
