import React, { FunctionComponent } from "react";

import styles from "./DotDivider.css";

const Footer: FunctionComponent<{}> = () => (
  <div className={styles.root} data-testid="decisionHistory-dotDivider">
    •
  </div>
);

export default Footer;
