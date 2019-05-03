import React from "react";
import { FunctionComponent } from "react";

import { MatchMedia, Typography } from "talk-ui/components";

import styles from "./Username.css";

export interface UsernameProps {
  children: string;
}

const Username: FunctionComponent<UsernameProps> = props => {
  return (
    <MatchMedia gtWidth="xs">
      {matches => (
        <Typography
          variant={matches ? "heading2" : "heading3"}
          className={styles.root}
          container="span"
        >
          {props.children}
        </Typography>
      )}
    </MatchMedia>
  );
};

export default Username;
