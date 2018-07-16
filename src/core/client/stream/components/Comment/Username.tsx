import React from "react";
import { StatelessComponent } from "react";

import { MatchMedia, Typography } from "talk-ui/components";

import * as styles from "./Username.css";

export interface UsernameProps {
  children: string;
}

const Username: StatelessComponent<UsernameProps> = props => {
  return (
    <MatchMedia minWidth="xs">
      {matches => (
        <Typography
          variant={matches ? "heading2" : "heading3"}
          className={styles.root}
          component="span"
        >
          {props.children}
        </Typography>
      )}
    </MatchMedia>
  );
};

export default Username;
