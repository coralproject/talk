import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { BaseButton, Flex, Icon } from "coral-ui/components/v2";

import styles from "./InReplyTo.css";

interface Props {
  children: string;
  onUsernameClick: () => void;
}

const InReplyTo: FunctionComponent<Props> = ({ children, onUsernameClick }) => {
  const Username = () => (
    <BaseButton onClick={onUsernameClick} className={styles.usernameButton}>
      <span className={styles.username}>{children}</span>
    </BaseButton>
  );

  return (
    <Flex alignItems="center">
      <Icon className={styles.icon}>reply</Icon>{" "}
      <Localized id="moderate-comment-inReplyTo" Username={<Username />}>
        <span className={styles.inReplyTo}>
          Reply to
          <Username />
        </span>
      </Localized>
    </Flex>
  );
};

export default InReplyTo;
