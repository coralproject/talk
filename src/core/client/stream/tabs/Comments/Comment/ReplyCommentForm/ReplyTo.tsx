import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Flex, Icon } from "coral-ui/components/v2";

import styles from "./ReplyTo.css";

interface Props {
  username: string;
}

const ReplyTo: FunctionComponent<Props> = ({ username }) => {
  const Username = () => (
    <Localized id="username" attrs={{ "aria-label": true }} vars={{ username }}>
      <span
        className={cn(
          styles.username,
          CLASSES.createReplyComment.replyTo.username
        )}
        aria-label="untranslated"
      >
        {username}
      </span>
    </Localized>
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

export default ReplyTo;
