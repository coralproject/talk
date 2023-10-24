import { Localized } from "@fluent/react/compat";
import cn from "classnames";
import React, { FunctionComponent } from "react";

import { EmailActionReplyIcon, SvgIcon } from "coral-ui/components/icons";
import { BaseButton, Flex } from "coral-ui/components/v2";

import styles from "./InReplyTo.css";

interface Props {
  className?: string;
  children: string;
  onUsernameClick: () => void;
}

const InReplyTo: FunctionComponent<Props> = ({
  className,
  children,
  onUsernameClick,
}) => {
  const Username = () => (
    <Localized
      id="common-username"
      attrs={{ "aria-label": true }}
      vars={{ username: children }}
    >
      <BaseButton onClick={onUsernameClick} className={styles.usernameButton}>
        <span className={cn(styles.username, className)}>{children}</span>
      </BaseButton>
    </Localized>
  );

  return (
    <Flex alignItems="center">
      <SvgIcon
        className={styles.icon}
        size="xs"
        filled
        Icon={EmailActionReplyIcon}
      />{" "}
      <Localized
        id="moderate-comment-inReplyTo"
        elems={{ Username: <Username /> }}
      >
        <span className={styles.inReplyTo}>
          Reply to
          <Username />
        </span>
      </Localized>
    </Flex>
  );
};

export default InReplyTo;
