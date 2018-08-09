import React from "react";
import { StatelessComponent } from "react";
import { Typography } from "talk-ui/components";
import * as styles from "./Comment.css";

import PermalinkButtonContainer from "../../containers/PermalinkButtonContainer";
import Timestamp from "./Timestamp";
import TopBar from "./TopBar";
import Username from "./Username";

export interface CommentProps {
  id: string;
  className?: string;
  author: {
    username: string | null;
  } | null;
  body: string | null;
  createdAt: string;
}

const Comment: StatelessComponent<CommentProps> = props => {
  return (
    <div role="article" className={styles.root}>
      <TopBar>
        {props.author &&
          props.author.username && <Username>{props.author.username}</Username>}
        <Timestamp>{props.createdAt}</Timestamp>
      </TopBar>
      <Typography>{props.body}</Typography>
      <div className={styles.footer}>
        <PermalinkButtonContainer commentID={props.id} />
      </div>
    </div>
  );
};

export default Comment;
