import { Localized } from "@fluent/react/compat";
import React, { FunctionComponent } from "react";

import { Marker } from "coral-ui/components/v2";

import styles from "./StatusMarker.css";

interface Props {
  enabled: boolean;
}

const StatusMarker: FunctionComponent<Props> = ({ enabled }) =>
  enabled ? (
    <Localized id="configure-moderationPhases-enabledModerationPhase">
      <Marker className={styles.success}>Enabled</Marker>
    </Localized>
  ) : (
    <Localized id="configure-moderationPhases-disableModerationPhase">
      <Marker className={styles.error}>Disabled</Marker>
    </Localized>
  );

export default StatusMarker;
