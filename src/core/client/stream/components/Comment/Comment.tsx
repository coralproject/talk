import React, { ReactElement, StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import * as styles from "./Comment.css";
import HTMLContent from "./HTMLContent";
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
  footer?: ReactElement<any> | Array<ReactElement<any>>;
}

const Comment: StatelessComponent<CommentProps> = props => {
  return (
    <div role="article" className={styles.root}>
      <TopBar className={styles.topBar}>
        {props.author &&
          props.author.username && <Username>{props.author.username}</Username>}
        <Timestamp>{props.createdAt}</Timestamp>
      </TopBar>
      <HTMLContent>{props.body || ""}</HTMLContent>
      <Flex className={styles.footer} direction="row" itemGutter="half">
        {props.footer}
      </Flex>
    </div>
  );
};

export default Comment;
