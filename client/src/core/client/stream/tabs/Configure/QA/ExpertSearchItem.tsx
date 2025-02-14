import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { Flex } from "coral-ui/components/v2";
import { Button } from "coral-ui/components/v3";

import styles from "./ExpertSearchItem.css";

interface Props {
  id: string;
  username: string | null;
  email: string | null;
  onClickAdd: (id: string) => void;
}

const ExpertSearchItem: FunctionComponent<Props> = ({
  id,
  username,
  email,
  onClickAdd,
}) => {
  const onClick = useCallback(() => {
    onClickAdd(id);
  }, [id, onClickAdd]);

  return (
    <Flex alignItems="center" key={id}>
      <Button
        onClick={onClick}
        className={styles.button}
        variant="none"
        color="none"
      >
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
      </Button>
    </Flex>
  );
};

export default ExpertSearchItem;
