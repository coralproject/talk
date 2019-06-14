import cn from "classnames";
import React, { FunctionComponent } from "react";

import HTMLContent from "coral-stream/common/HTMLContent";
import Timestamp from "coral-stream/common/Timestamp";
import { Flex, HorizontalGutter } from "coral-ui/components";

import EditedMarker from "./EditedMarker";
import InReplyTo from "./InReplyTo";
import TopBarLeft from "./TopBarLeft";

import styles from "./Comment.css";

export interface CommentProps {
  className?: string;
  username: React.ReactNode;
  body: string | null;
  createdAt: string;
  topBarRight?: React.ReactNode;
  footer?: React.ReactNode;
  showEditedMarker?: boolean;
  highlight?: boolean;
  parentAuthorName?: string | null;
  userTags?: React.ReactNode;
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
            {props.username && props.username}
            {props.userTags}
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

      <HorizontalGutter spacing={1}>
        <HTMLContent>{props.body || ""}</HTMLContent>
        {props.footer}
      </HorizontalGutter>
    </div>
  );
};

export default Comment;
