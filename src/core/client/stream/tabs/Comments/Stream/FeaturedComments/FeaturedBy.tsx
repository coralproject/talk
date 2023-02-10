import React, { FunctionComponent } from "react";

import styles from "./FeaturedBy.css";

interface Props {
  username: string;
}

const FeaturedBy: FunctionComponent<Props> = ({ username }) => {
  return (
    <span className={styles.root}>
      featured by <strong className={styles.name}>{username}</strong>
    </span>
  );
};

export default FeaturedBy;
