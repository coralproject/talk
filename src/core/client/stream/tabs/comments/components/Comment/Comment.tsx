import cn from "classnames";
import React, { StatelessComponent } from "react";

import HTMLContent from "talk-stream/components/HTMLContent";
import Timestamp from "talk-stream/components/Timestamp";
import { Flex, HorizontalGutter } from "talk-ui/components";

import * as styles from "./Comment.css";
import EditedMarker from "./EditedMarker";
import InReplyTo from "./InReplyTo";
import TopBarLeft from "./TopBarLeft";
import Username from "./Username";

export interface CommentProps {
  id?: string;
  className?: string;
  username: string | null;
  body: string | null;
  createdAt: string;
  topBarRight?: React.ReactNode;
  footer?: React.ReactNode;
  showEditedMarker?: boolean;
  highlight?: boolean;
  parentAuthorName?: string | null;
}

const Comment: StatelessComponent<CommentProps> = props => {
  return (
    <div
      role="article"
      className={cn(styles.root, { [styles.highlight]: props.highlight })}
    >
      <Flex direction="row" justifyContent="space-between" id={props.id}>
        <TopBarLeft>
          {props.username && <Username>{props.username}</Username>}
          <Flex direction="row" alignItems="baseline" itemGutter>
            <Timestamp>{props.createdAt}</Timestamp>
            {props.showEditedMarker && <EditedMarker />}
          </Flex>
        </TopBarLeft>
        {props.topBarRight && <div>{props.topBarRight}</div>}
      </Flex>
      {props.parentAuthorName && (
        <div className={styles.subBar}>
          <InReplyTo username={props.parentAuthorName} />
        </div>
      )}

      <HorizontalGutter>
        <HTMLContent>{props.body || ""}</HTMLContent>
        {props.footer}
      </HorizontalGutter>
    </div>
  );
};

export default Comment;
