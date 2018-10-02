import React from "react";
import { Typography } from "talk-ui/components";
import * as styles from "./MainBar.css";

const MainBar = () => {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <Typography variant="heading1" className={styles.title}>
          Talk
        </Typography>
      </div>
    </div>
  );
};

export default MainBar;
