import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Icon, Marker } from "coral-ui/components/v2";

import styles from "./ArchivedMarker.css";

const ArchivedMarker: FunctionComponent = () => {
  return (
    <Marker color="warning" variant="filled">
      <Icon size="sm" className={styles.icon}>
        archive
      </Icon>
      <Localized id="general-archived">
        <span>Archived</span>
      </Localized>
    </Marker>
  );
};

export default ArchivedMarker;
