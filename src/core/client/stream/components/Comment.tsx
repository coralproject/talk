import cn from "classnames";
import React from "react";
import { StatelessComponent } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { Button, Input, Popover, Typography } from "talk-ui/components";
import * as styles from "./Comment.css";

export interface CommentProps {
  id: string;
  className?: string;
  author: {
    username: string;
  } | null;
  body: string | null;
  gutterBottom?: boolean;
}

// make a permalink popover

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
      <div className={cn("talk-comment-footer")}>
        <Popover
          body={
            <div>
              <Input defaultValue={props.id} className={styles.input} />
              <CopyToClipboard text={props.id}>
                <Button primary>Copy</Button>
              </CopyToClipboard>
            </div>
          }
        >
          <Button className={styles.shareButton}>Share</Button>
        </Popover>
      </div>
    </div>
  );
};

export default Comment;
