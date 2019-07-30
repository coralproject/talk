import React, { FunctionComponent } from "react";

import { Button } from "coral-ui/components";
import styles from "./FlagDetailsEntry.css";

interface Props {
  user: React.ReactNode;
  details?: React.ReactNode;
  onClick?: () => void;
}

const FlagDetailsEntry: FunctionComponent<Props> = ({
  user,
  details,
  onClick,
}) => {
  return (
    <div>
      {onClick && (
        <Button variant="underlined" onClick={onClick}>
          <span className={styles.user}>
            {user}
            {details && ":"}
          </span>
        </Button>
      )}
      {!onClick && (
        <span className={styles.user}>
          {user}
          {details && ":"}
        </span>
      )}
      {details && <span className={styles.details}>{details}</span>}
    </div>
  );
};

export default FlagDetailsEntry;
