import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { RemoveIcon, SvgIcon } from "coral-ui/components/icons";
import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./ExpertListItem.css";

interface Props {
  id: string;
  username: string | null;
  email: string | null;
  onClickRemove: (
    id: string,
    username: string | null,
    email: string | null
  ) => void;
}

const ExpertListItem: FunctionComponent<Props> = ({
  id,
  username,
  email,
  onClickRemove,
}) => {
  const onClick = useCallback(() => {
    onClickRemove(id, username, email);
  }, [id, username, email, onClickRemove]);

  return (
    <li key={id} className={styles.root}>
      <div className={styles.usernameEmail}>
        {username && <span className={styles.username}>{username}</span>}
        {email && (
          <span className={styles.email}>
            <Localized id="qa-expert-email" vars={{ email }}>
              email
            </Localized>
          </span>
        )}
      </div>
      <Button
        variant="flat"
        color="primary"
        fontSize="none"
        fontWeight="semiBold"
        paddingSize="none"
        onClick={onClick}
        className={styles.removeButton}
      >
        <Flex alignItems="center" justifyContent="center">
          <SvgIcon
            size="xs"
            className={styles.removeIcon}
            strokeWidth="semibold"
            Icon={RemoveIcon}
          />
          <Localized id="configure-experts-remove-button">Remove</Localized>
        </Flex>
      </Button>
    </li>
  );
};

export default ExpertListItem;
