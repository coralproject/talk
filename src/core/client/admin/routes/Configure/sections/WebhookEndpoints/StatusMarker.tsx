import React, { FunctionComponent } from "react";

import { Marker } from "coral-ui/components/v2";

import styles from "./StatusMarker.css";

interface Props {
  enabled: boolean;
}

const StatusMarker: FunctionComponent<Props> = ({ enabled }) =>
  enabled ? (
    <Marker className={styles.success}>Enabled</Marker>
  ) : (
    <Marker className={styles.error}>Disabled</Marker>
  );

export default StatusMarker;
