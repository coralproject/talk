import cn from "classnames";
import React, { StatelessComponent } from "react";

import { CallOut } from "talk-ui/components";

import styles from "./PostCommentFormCollapsed.css";

interface Props {
  closedSitewide?: boolean;
  closedMessage?: React.ReactNode;
}
const PostCommentFormCollapsed: StatelessComponent<Props> = props => (
  <CallOut
    fullWidth
    className={cn(styles.root, { [styles.sitewide]: props.closedSitewide })}
  >
    {props.closedMessage}
  </CallOut>
);

export default PostCommentFormCollapsed;
