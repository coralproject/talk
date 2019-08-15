import cn from "classnames";
import React, { FunctionComponent } from "react";

import { Markdown } from "coral-framework/components";
import { PropTypesOf } from "coral-framework/types";
import CLASSES from "coral-stream/classes";
import { CallOut, HorizontalGutter } from "coral-ui/components";

import MessageBoxContainer from "../MessageBoxContainer";

import styles from "./PostCommentFormClosedSitewide.css";

interface Props {
  message: string;
  showMessageBox?: boolean;
  story: PropTypesOf<typeof MessageBoxContainer>["story"];
}
const PostCommentFormClosedSitewide: FunctionComponent<Props> = props => (
  <HorizontalGutter size="double">
    <CallOut fullWidth className={cn(styles.root, CLASSES.closedSitewide)}>
      <Markdown className={styles.message}>{props.message}</Markdown>
    </CallOut>
    {props.showMessageBox && (
      <div className={CLASSES.createComment.$root}>
        <MessageBoxContainer
          story={props.story}
          className={CLASSES.createComment.message}
        />
      </div>
    )}
  </HorizontalGutter>
);

export default PostCommentFormClosedSitewide;
