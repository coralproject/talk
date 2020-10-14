import React, { FunctionComponent } from "react";

import { Typography } from "coral-ui/components/v2";

import styles from "./Version.css";

const Version: FunctionComponent = () => {
  return (
    <Typography className={styles.version} variant="detail">
      {process.env.TALK_VERSION ? `v${process.env.TALK_VERSION}` : "Unknown"}
    </Typography>
  );
};

export default Version;
