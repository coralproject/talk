import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Flex, Icon, Typography } from "coral-ui/components";

import styles from "./InReplyTo.css";

interface Props {
  username: string;
}

const InReplyTo: FunctionComponent<Props> = ({ username }) => {
  const Username = () => (
    <Typography variant="heading5" container="span" className={styles.username}>
      {username}
    </Typography>
  );

  return (
    <Flex alignItems="center">
      <Icon className={styles.icon}>reply</Icon>{" "}
      <Localized id="comments-inReplyTo" Username={<Username />}>
        <Typography
          variant="timestamp"
          container="span"
          className={styles.inReplyTo}
        >
          {"In reply to <Username></Username>"}
        </Typography>
      </Localized>
    </Flex>
  );
};

export default InReplyTo;
