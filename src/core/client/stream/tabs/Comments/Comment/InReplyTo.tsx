import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import CLASSES from "coral-stream/classes";
import { Flex, Icon, Typography } from "coral-ui/components";

import styles from "./InReplyTo.css";

interface Props {
  username: string;
}

const InReplyTo: FunctionComponent<Props> = ({ username }) => {
  const Username = () => (
    <Typography
      variant="heading4"
      container="span"
      color="textDark"
      className={cn(styles.username, CLASSES.comment.inReplyTo.username)}
    >
      {username}
    </Typography>
  );

  return (
    <Flex alignItems="center" className={CLASSES.comment.inReplyTo.$root}>
      <Icon className={styles.icon}>reply</Icon>{" "}
      <Localized id="comments-inReplyTo" Username={<Username />}>
        <Typography
          variant="timestamp"
          container="span"
          className={cn(styles.inReplyTo, CLASSES.comment.inReplyTo.text)}
        >
          {"In reply to <Username></Username>"}
        </Typography>
      </Localized>
    </Flex>
  );
};

export default InReplyTo;
