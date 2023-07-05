import React, { FunctionComponent } from "react";

import { BaseButton } from "coral-ui/components/v2";

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
        <BaseButton className={styles.flagger} onClick={onClick}>
          <span className={styles.user}>{user}</span>
        </BaseButton>
      )}
      {!onClick && <span className={styles.user}>{user}</span>}
      {details && <span className={styles.details}>{details}</span>}
    </div>
  );
};

export default FlagDetailsEntry;
