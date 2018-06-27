import cn from "classnames";
import React from "react";
import { StatelessComponent } from "react";

import { Typography } from "talk-ui/components";

import * as styles from "./Comment.css";

export interface CommentProps {
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
    <div className={rootClassName}>
      <Typography className={styles.author} gutterBottom>
        {props.author && props.author.username}
      </Typography>
      <Typography>{props.body}</Typography>
    </div>
  );
};

export default Comment;
