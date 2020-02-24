import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { Button } from "coral-ui/components";

import styles from "./ExpertListItem.css";

interface Props {
  id: string;
  username: string | null;
  email: string | null;
  onClickRemove: (id: string) => void;
}

const ExpertListItem: FunctionComponent<Props> = ({
  id,
  username,
  email,
  onClickRemove,
}) => {
  const onClick = useCallback(() => {
    onClickRemove(id);
  }, [id, onClickRemove]);

  return (
    <li key={id} className={styles.root}>
      <div className={styles.usernameEmail}>
        {username && <span className={styles.username}>{username}</span>}
        {email && (
          <span className={styles.email}>
            <Localized id="qa-expert-email" $email={email}>
              email
            </Localized>
          </span>
        )}
      </div>
      <Button
        variant="outlined"
        color="error"
        onClick={onClick}
        className={styles.removeButton}
      >
        <Localized id="configure-experts-remove-button">Remove</Localized>
      </Button>
    </li>
  );
};

export default ExpertListItem;
