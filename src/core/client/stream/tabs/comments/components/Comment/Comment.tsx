import cn from "classnames";
import React, { FunctionComponent } from "react";

import HTMLContent from "talk-stream/components/HTMLContent";
import Timestamp from "talk-stream/components/Timestamp";
import { Flex, HorizontalGutter, Tag } from "talk-ui/components";

import EditedMarker from "./EditedMarker";
import InReplyTo from "./InReplyTo";
import TopBarLeft from "./TopBarLeft";
import Username from "./Username";

import styles from "./Comment.css";

export interface CommentProps {
  className?: string;
  username: string | null;
  body: string | null;
  createdAt: string;
  topBarRight?: React.ReactNode;
  footer?: React.ReactNode;
  showEditedMarker?: boolean;
  highlight?: boolean;
  parentAuthorName?: string | null;
  tags?: ReadonlyArray<string>;
}

const Comment: FunctionComponent<CommentProps> = props => {
  return (
    <div
      role="article"
      className={cn(styles.root, { [styles.highlight]: props.highlight })}
    >
      <Flex direction="row" justifyContent="space-between">
        <TopBarLeft>
          <Flex direction="row" alignItems="center" itemGutter="half">
            {props.username && <Username>{props.username}</Username>}
            {props.tags && props.tags.map((t, i) => <Tag key={i}>{t}</Tag>)}
          </Flex>
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
