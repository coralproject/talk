import React, { FunctionComponent } from "react";

import { Marker } from "coral-ui/components/v2";

import styles from "./EndpointStatusMarker.css";

interface Props {
  enabled: boolean;
}

const EndpointStatusMarker: FunctionComponent<Props> = ({ enabled }) =>
  enabled ? (
    <Marker className={styles.success}>Enabled</Marker>
  ) : (
    <Marker className={styles.error}>Disabled</Marker>
  );

export default EndpointStatusMarker;
