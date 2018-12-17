import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Flex, Icon, Typography } from "talk-ui/components";

import styles from "./InReplyTo.css";

interface Props {
  username: string;
}

const InReplyTo: StatelessComponent<Props> = ({ username }) => {
  const Username = () => (
    <Typography variant="heading5" container="span" className={styles.username}>
      {username}
    </Typography>
  );

  return (
    <Flex alignItems="center">
      <Icon className={styles.icon}>reply</Icon>{" "}
      <Localized id="comments-inReplyTo" username={<Username />}>
        <Typography
          variant="timestamp"
          container="span"
          className={styles.inReplyTo}
        >
          {"In reply to <username><username>"}
        </Typography>
      </Localized>
    </Flex>
  );
};

export default InReplyTo;
