import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent, useCallback } from "react";

import { Button, Typography } from "coral-ui/components";

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
    <div key={id} className={styles.root}>
      <Typography variant="bodyCopy">
        {email && username && (
          <span>
            {email}
            {` (${username})`}
          </span>
        )}
        {email && !username && <span>{email}</span>}
      </Typography>
      <Button
        variant="filled"
        color="error"
        onClick={onClick}
        className={styles.removeButton}
      >
        <Localized id="configure-experts-remove-button">Remove</Localized>
      </Button>
    </div>
  );
};

export default ExpertListItem;
