import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Flex, Icon, Typography } from "coral-ui/components";

import styles from "./InReplyTo.css";

interface Props {
  children: string;
}

const InReplyTo: FunctionComponent<Props> = ({ children }) => {
  const Username = () => (
    <Typography variant="heading5" container="span" className={styles.username}>
      {children}
    </Typography>
  );

  return (
    <Flex alignItems="center">
      <Icon className={styles.icon}>reply</Icon>{" "}
      <Localized id="moderate-comment-inReplyTo" Username={<Username />}>
        <Typography
          variant="timestamp"
          container="span"
          className={styles.inReplyTo}
        >
          {"Reply to <Username></Username>"}
        </Typography>
      </Localized>
    </Flex>
  );
};

export default InReplyTo;
