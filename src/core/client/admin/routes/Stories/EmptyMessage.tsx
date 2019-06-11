import { Localized } from "fluent-react/compat";
import React, { FunctionComponent } from "react";

import { Typography } from "coral-ui/components";

import styles from "./EmptyMessage.css";

const EmptyMessage: FunctionComponent = props => (
  <Localized id="stories-emptyMessage">
    <Typography className={styles.root} variant="bodyCopyBold" align="center">
      There are currently no published stories.
    </Typography>
  </Localized>
);

export default EmptyMessage;
