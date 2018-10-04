import React, { StatelessComponent } from "react";

import HTMLContent from "talk-stream/components/HTMLContent";
import Timestamp from "talk-stream/components/Timestamp";
import { Flex, HorizontalGutter } from "talk-ui/components";

import * as styles from "./Comment.css";
import EditedMarker from "./EditedMarker";
import TopBarLeft from "./TopBarLeft";
import Username from "./Username";

export interface CommentProps {
  id?: string;
  className?: string;
  author: {
    username: string | null;
  } | null;
  body: string | null;
  createdAt: string;
  topBarRight?: React.ReactNode;
  footer?: React.ReactNode;
  showEditedMarker?: boolean;
}

const Comment: StatelessComponent<CommentProps> = props => {
  return (
    <div role="article" className={styles.root}>
      <Flex
        className={styles.topBar}
        direction="row"
        justifyContent="space-between"
        id={props.id}
      >
        <TopBarLeft>
          {props.author &&
            props.author.username && (
              <Username>{props.author.username}</Username>
            )}
          <Flex direction="row" alignItems="baseline" itemGutter>
            <Timestamp>{props.createdAt}</Timestamp>
            {props.showEditedMarker && <EditedMarker />}
          </Flex>
        </TopBarLeft>
        {props.topBarRight && <div>{props.topBarRight}</div>}
      </Flex>
      <HorizontalGutter>
        <HTMLContent>{props.body || ""}</HTMLContent>
        {props.footer}
      </HorizontalGutter>
    </div>
  );
};

export default Comment;
