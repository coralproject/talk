import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Typography } from "talk-ui/components";

import styles from "./EmptyMessage.css";

const EmptyMessage: StatelessComponent = props => (
  <Localized id="stories-emptyMessage">
    <Typography className={styles.root} variant="bodyCopyBold" align="center">
      There are currently no published stories.
    </Typography>
  </Localized>
);

export default EmptyMessage;
