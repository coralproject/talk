import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Flex, Icon } from "coral-ui/components/v2";

import styles from "./InReplyTo.css";

interface Props {
  username: string;
}

const InReplyTo: FunctionComponent<Props> = ({ username }) => {
  const Username = () => (
    <span className={cn(styles.username, CLASSES.comment.inReplyTo.username)}>
      {username}
    </span>
  );

  return (
    <Flex alignItems="center" className={CLASSES.comment.inReplyTo.$root}>
      <Icon className={styles.icon}>reply</Icon>{" "}
      <Localized id="comments-inReplyTo" Username={<Username />}>
        <span className={cn(styles.inReplyTo, CLASSES.comment.inReplyTo.text)}>
          {"In reply to <Username></Username>"}
        </span>
      </Localized>
    </Flex>
  );
};

export default InReplyTo;
