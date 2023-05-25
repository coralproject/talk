import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import styles from "./FeaturedBy.css";

interface Props {
  username: string;
}

const FeaturedBy: FunctionComponent<Props> = ({ username }) => {
  return (
    <Localized
      id="comments-featuredBy"
      vars={{ username }}
      elems={{ strong: <strong className={styles.name} /> }}
    >
      <span className={styles.root}>
        featured by <strong className={styles.name}>{username}</strong>
      </span>
    </Localized>
  );
};

export default FeaturedBy;
