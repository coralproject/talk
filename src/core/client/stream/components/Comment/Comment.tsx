import React, { ReactElement, StatelessComponent } from "react";

import { Flex } from "talk-ui/components";

import * as styles from "./Comment.css";
import HTMLContent from "./HTMLContent";
import Timestamp from "./Timestamp";
import TopBarLeft from "./TopBarLeft";
import Username from "./Username";

export interface CommentProps {
  className?: string;
  author: {
    username: string | null;
  } | null;
  body: string | null;
  createdAt: string;
  topBarRight?: ReactElement<any> | Array<ReactElement<any>>;
  footer?: ReactElement<any> | Array<ReactElement<any>>;
}

const Comment: StatelessComponent<CommentProps> = props => {
  return (
    <div role="article" className={styles.root}>
      <Flex
        className={styles.topBar}
        direction="row"
        justifyContent="space-between"
      >
        <TopBarLeft>
          {props.author &&
            props.author.username && (
              <Username>{props.author.username}</Username>
            )}
          <Timestamp>{props.createdAt}</Timestamp>
        </TopBarLeft>
        <div>{props.topBarRight}</div>
      </Flex>
      <HTMLContent>{props.body || ""}</HTMLContent>
      <Flex className={styles.footer} direction="row" itemGutter="half">
        {props.footer}
      </Flex>
    </div>
  );
};

export default Comment;
