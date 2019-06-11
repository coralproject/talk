import React from "react";

import { Typography } from "coral-ui/components";

import styles from "./MainBar.css";

const MainBar = () => {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Typography variant="heading1" className={styles.title}>
          Coral
        </Typography>
      </div>
    </div>
  );
};

export default MainBar;
