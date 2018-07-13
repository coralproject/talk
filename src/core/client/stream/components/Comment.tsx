import cn from "classnames";
import React from "react";
import { StatelessComponent } from "react";
import { Typography } from "talk-ui/components";
import * as styles from "./Comment.css";
import PermalinkPopover from "./PermalinkPopover";
import Username from "./Username";

export interface CommentProps {
  id: string;
  className?: string;
  author: {
    username: string;
  } | null;
  body: string | null;
  gutterBottom?: boolean;
}

const Comment: StatelessComponent<CommentProps> = props => {
  const rootClassName = cn(styles.root, props.className, {
    [styles.gutterBottom]: props.gutterBottom,
  });
  return (
    <div className={rootClassName} role="article">
      <div className={styles.topBar}>
        {props.author && <Username>{props.author.username}</Username>}
      </div>
      <Typography>{props.body}</Typography>
      <div className={cn("talk-comment-footer")}>
        <PermalinkPopover commentId={props.id} />
      </div>
    </div>
  );
};

export default Comment;
