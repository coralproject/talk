import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Flex, Icon } from "coral-ui/components";

import styles from "./InReplyTo.css";

interface Props {
  children: string;
}

const InReplyTo: FunctionComponent<Props> = ({ children }) => {
  const Username = () => <span className={styles.username}>{children}</span>;

  return (
    <Flex alignItems="center">
      <Icon className={styles.icon}>reply</Icon>{" "}
      <Localized id="moderate-comment-inReplyTo" Username={<Username />}>
        <span className={styles.inReplyTo}>
          Reply to <Username />
        </span>
      </Localized>
    </Flex>
  );
};

export default InReplyTo;
