import cn from "classnames";
import React from "react";
import { StatelessComponent } from "react";

import { Timestamp, Typography } from "talk-ui/components";

import * as styles from "./Comment.css";
import Username from "./Username";

export interface CommentProps {
  className?: string;
  author: {
    username: string;
  } | null;
  body: string | null;
  createdAt: string;
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
        <Timestamp date={props.createdAt} />
      </div>
      <Typography>{props.body}</Typography>
    </div>
  );
};

export default Comment;
