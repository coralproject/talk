import React, { FunctionComponent } from "react";

import styles from "./FlagDetailsEntry.css";

interface Props {
  user: React.ReactNode;
  details?: React.ReactNode;
}

const FlagDetailsEntry: FunctionComponent<Props> = ({ user, details }) => {
  return (
    <div>
      <span className={styles.user}>
        {user}
        {details && ":"}
      </span>
      {details && <span className={styles.details}>{details}</span>}
    </div>
  );
};

export default FlagDetailsEntry;
