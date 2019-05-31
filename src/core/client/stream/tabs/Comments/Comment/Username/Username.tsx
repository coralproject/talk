import React from "react";
import { FunctionComponent } from "react";

import { MatchMedia, Typography } from "coral-ui/components";

import styles from "./Username.css";

interface Props {
  children: React.ReactNode;
}

const Username: FunctionComponent<Props> = props => {
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
