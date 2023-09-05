import React from "react";

import { Typography } from "coral-ui/components/v2";

import styles from "./MainBar.css";

const MainBar = () => {
  return (
    <header className={styles.root}>
      <div className={styles.container}>
        <Typography variant="heading1" className={styles.title}>
          Coral
        </Typography>
      </div>
    </header>
  );
};

export default MainBar;
