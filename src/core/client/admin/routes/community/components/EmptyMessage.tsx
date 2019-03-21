import { Localized } from "fluent-react/compat";
import React, { StatelessComponent } from "react";

import { Typography } from "talk-ui/components";

import styles from "./EmptyMessage.css";

const EmptyMessage: StatelessComponent = props => (
  <Localized id="community-emptyMessage">
    <Typography className={styles.root} variant="bodyCopyBold" align="center">
      We could not find anyone in your community matching your criteria.
    </Typography>
  </Localized>
);

export default EmptyMessage;
