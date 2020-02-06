import React, { FunctionComponent, useCallback } from "react";

import { Button, Flex } from "coral-ui/components";

import styles from "./ExpertSearchItem.css";

interface Props {
  id: string;
  username: string | null;
  email: string | null;
  onClickAdd: (
    id: string,
    username: string | null,
    email: string | null
  ) => void;
}

const ExpertSearchItem: FunctionComponent<Props> = ({
  id,
  username,
  email,
  onClickAdd,
}) => {
  const onClick = useCallback(() => {
    onClickAdd(id, username, email);
  }, [id, username, email, onClickAdd]);

  return (
    <Flex alignItems="center" key={id}>
      <Button onClick={onClick} className={styles.button}>
        {username && <span className={styles.username}>{username}</span>}
        {email && (
          <span className={styles.email}>
            {"("}
            {email}
            {")"}
          </span>
        )}
      </Button>
    </Flex>
  );
};

export default ExpertSearchItem;
