import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Flex, Icon } from "coral-ui/components/v2";

import styles from "./ReplyingTo.css";

interface Props {
  username: string;
}

const ReplyingTo: FunctionComponent<Props> = ({ username }) => {
  const Username = () => (
    <span
      className={cn(
        styles.username,
        CLASSES.createReplyComment.replyTo.username
      )}
    >
      {username}
    </span>
  );

  return (
    <Flex
      alignItems="center"
      className={cn(styles.root, CLASSES.createReplyComment.replyTo.$root)}
    >
      <Icon>reply</Icon>{" "}
      <Localized id="comments-replyingTo" elems={{ Username: <Username /> }}>
        <span
          className={cn(styles.text, CLASSES.createReplyComment.replyTo.text)}
        >
          {"Replying to <Username></Username>"}
        </span>
      </Localized>
    </Flex>
  );
};

export default ReplyingTo;
